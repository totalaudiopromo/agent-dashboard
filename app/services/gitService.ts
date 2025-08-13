// Real Git Integration Service for Total Audio Promo
// Connects to actual Git repository for development velocity tracking and commit analysis

interface GitCommit {
  sha: string;
  author: string;
  date: Date;
  message: string;
  files_changed: number;
  additions: number;
  deletions: number;
  branch: string;
  tags: string[];
}

interface GitBranch {
  name: string;
  last_commit: string;
  last_commit_date: Date;
  ahead_count: number;
  behind_count: number;
  is_protected: boolean;
}

interface GitRepository {
  name: string;
  description: string;
  url: string;
  default_branch: string;
  branches: GitBranch[];
  total_commits: number;
  contributors: string[];
  last_activity: Date;
}

interface DevelopmentMetrics {
  commits_this_week: number;
  commits_this_month: number;
  lines_added_this_week: number;
  lines_removed_this_week: number;
  active_contributors: number;
  pull_requests_open: number;
  pull_requests_merged: number;
  development_velocity: number; // commits per day
  code_churn_rate: number; // (additions + deletions) / total lines
  feature_completion_rate: number;
}

class GitService {
  private static instance: GitService;
  private readonly GITHUB_TOKEN: string;
  private readonly REPOSITORY_OWNER: string;
  private readonly REPOSITORY_NAME: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes

  constructor() {
    this.GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN || '';
    this.REPOSITORY_OWNER = process.env.GITHUB_REPOSITORY_OWNER || 'total-audio-promo';
    this.REPOSITORY_NAME = process.env.GITHUB_REPOSITORY_NAME || 'total-audio-promo';
    
    if (!this.GITHUB_TOKEN) {
      console.warn('GitHub token not found. Git integration will be limited.');
    }
  }

  static getInstance(): GitService {
    if (!GitService.instance) {
      GitService.instance = new GitService();
    }
    return GitService.instance;
  }

  // Test Git connection
  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      if (!this.GITHUB_TOKEN) {
        return {
          connected: false,
          message: 'GitHub token not configured'
        };
      }

      // Test API call to verify connection
      const response = await fetch(`https://api.github.com/repos/${this.REPOSITORY_OWNER}/${this.REPOSITORY_NAME}`, {
        headers: {
          'Authorization': `token ${this.GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (response.ok) {
        const repo = await response.json();
        return {
          connected: true,
          message: `Connected to repository: ${repo.full_name}`
        };
      } else {
        return {
          connected: false,
          message: `GitHub API error: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      return {
        connected: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Get repository information
  async getRepositoryInfo(): Promise<GitRepository> {
    return this.fetchWithCache('repository_info', async () => {
      try {
        if (!this.GITHUB_TOKEN) {
          throw new Error('GitHub not configured');
        }

        const response = await fetch(`https://api.github.com/repos/${this.REPOSITORY_OWNER}/${this.REPOSITORY_NAME}`, {
          headers: {
            'Authorization': `token ${this.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const repo = await response.json();
        
        // Get branches
        const branchesResponse = await fetch(`https://api.github.com/repos/${this.REPOSITORY_OWNER}/${this.REPOSITORY_NAME}/branches`, {
          headers: {
            'Authorization': `token ${this.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        let branches: GitBranch[] = [];
        if (branchesResponse.ok) {
          const branchesData = await branchesResponse.json();
          branches = branchesData.map((branch: any) => ({
            name: branch.name,
            last_commit: branch.commit.sha,
            last_commit_date: new Date(branch.commit.commit.author.date),
            ahead_count: 0, // Would need additional API calls to calculate
            behind_count: 0,
            is_protected: branch.protected || false
          }));
        }

        return {
          name: repo.name,
          description: repo.description || '',
          url: repo.html_url,
          default_branch: repo.default_branch,
          branches,
          total_commits: 0, // Would need additional API calls
          contributors: [], // Would need additional API calls
          last_activity: new Date(repo.updated_at)
        };
      } catch (error) {
        console.error('Failed to fetch repository info:', error);
        throw error;
      }
    });
  }

  // Get recent commits
  async getRecentCommits(branch: string = 'main', limit: number = 50): Promise<GitCommit[]> {
    return this.fetchWithCache(`commits_${branch}_${limit}`, async () => {
      try {
        if (!this.GITHUB_TOKEN) {
          throw new Error('GitHub not configured');
        }

        const response = await fetch(
          `https://api.github.com/repos/${this.REPOSITORY_OWNER}/${this.REPOSITORY_NAME}/commits?sha=${branch}&per_page=${limit}`,
          {
            headers: {
              'Authorization': `token ${this.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`);
        }

        const commits = await response.json();
        
        return commits.map((commit: any) => ({
          sha: commit.sha,
          author: commit.commit.author.name,
          date: new Date(commit.commit.author.date),
          message: commit.commit.message,
          files_changed: 0, // Would need additional API calls
          additions: 0,
          deletions: 0,
          branch,
          tags: []
        }));
      } catch (error) {
        console.error('Failed to fetch recent commits:', error);
        throw error;
      }
    });
  }

  // Get development metrics
  async getDevelopmentMetrics(): Promise<DevelopmentMetrics> {
    return this.fetchWithCache('development_metrics', async () => {
      try {
        if (!this.GITHUB_TOKEN) {
          throw new Error('GitHub not configured');
        }

        // Get commits for this week and month
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [weeklyCommits, monthlyCommits] = await Promise.all([
          this.getCommitsSince(weekAgo),
          this.getCommitsSince(monthAgo)
        ]);

        // Get pull request metrics
        const prMetrics = await this.getPullRequestMetrics();

        // Calculate development velocity (commits per day)
        const daysSinceWeekAgo = (now.getTime() - weekAgo.getTime()) / (1000 * 60 * 60 * 24);
        const developmentVelocity = weeklyCommits.length / daysSinceWeekAgo;

        // Calculate code churn rate (simplified)
        const totalLinesChanged = weeklyCommits.reduce((sum, commit) => 
          sum + (commit.additions + commit.deletions), 0
        );
        const codeChurnRate = totalLinesChanged > 0 ? totalLinesChanged / 10000 : 0; // Normalized

        return {
          commits_this_week: weeklyCommits.length,
          commits_this_month: monthlyCommits.length,
          lines_added_this_week: weeklyCommits.reduce((sum, commit) => sum + commit.additions, 0),
          lines_removed_this_week: weeklyCommits.reduce((sum, commit) => sum + commit.deletions, 0),
          active_contributors: new Set(weeklyCommits.map(c => c.author)).size,
          pull_requests_open: prMetrics.open,
          pull_requests_merged: prMetrics.merged,
          development_velocity: Math.round(developmentVelocity * 100) / 100,
          code_churn_rate: Math.round(codeChurnRate * 100) / 100,
          feature_completion_rate: this.calculateFeatureCompletionRate(weeklyCommits)
        };
      } catch (error) {
        console.error('Failed to fetch development metrics:', error);
        throw error;
      }
    });
  }

  // Get commits since a specific date
  private async getCommitsSince(since: Date): Promise<GitCommit[]> {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${this.REPOSITORY_OWNER}/${this.REPOSITORY_NAME}/commits?since=${since.toISOString()}&per_page=100`,
        {
          headers: {
            'Authorization': `token ${this.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        return [];
      }

      const commits = await response.json();
      return commits.map((commit: any) => ({
        sha: commit.sha,
        author: commit.commit.author.name,
        date: new Date(commit.commit.author.date),
        message: commit.commit.message,
        files_changed: 0,
        additions: 0,
        deletions: 0,
        branch: 'main',
        tags: []
      }));
    } catch (error) {
      console.error('Failed to fetch commits since date:', error);
      return [];
    }
  }

  // Get pull request metrics
  private async getPullRequestMetrics(): Promise<{ open: number; merged: number }> {
    try {
      const [openResponse, closedResponse] = await Promise.all([
        fetch(
          `https://api.github.com/repos/${this.REPOSITORY_OWNER}/${this.REPOSITORY_NAME}/pulls?state=open&per_page=1`,
          {
            headers: {
              'Authorization': `token ${this.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        ),
        fetch(
          `https://api.github.com/repos/${this.REPOSITORY_OWNER}/${this.REPOSITORY_NAME}/pulls?state=closed&per_page=1`,
          {
            headers: {
              'Authorization': `token ${this.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        )
      ]);

      let open = 0;
      let merged = 0;

      if (openResponse.ok) {
        const openData = await openResponse.json();
        open = openData.length;
      }

      if (closedResponse.ok) {
        const closedData = await closedResponse.json();
        merged = closedData.length;
      }

      return { open, merged };
    } catch (error) {
      console.error('Failed to fetch pull request metrics:', error);
      return { open: 0, merged: 0 };
    }
  }

  // Calculate feature completion rate based on commit messages
  private calculateFeatureCompletionRate(commits: GitCommit[]): number {
    const featureKeywords = ['feat:', 'feature:', 'add:', 'implement:', 'complete:'];
    const bugfixKeywords = ['fix:', 'bugfix:', 'resolve:', 'patch:'];
    
    const featureCommits = commits.filter(c => 
      featureKeywords.some(keyword => c.message.toLowerCase().includes(keyword))
    ).length;
    
    const bugfixCommits = commits.filter(c => 
      bugfixKeywords.some(keyword => c.message.toLowerCase().includes(keyword))
    ).length;
    
    const totalRelevantCommits = featureCommits + bugfixCommits;
    
    if (totalRelevantCommits === 0) return 0;
    
    // Assume features are more valuable than bugfixes
    return Math.round(((featureCommits * 1.5 + bugfixCommits) / totalRelevantCommits) * 100);
  }

  // Get file changes for a specific commit
  async getCommitDetails(commitSha: string): Promise<{
    files_changed: number;
    additions: number;
    deletions: number;
    files: Array<{
      filename: string;
      status: string;
      additions: number;
      deletions: number;
    }>;
  }> {
    try {
      if (!this.GITHUB_TOKEN) {
        throw new Error('GitHub not configured');
      }

      const response = await fetch(
        `https://api.github.com/repos/${this.REPOSITORY_OWNER}/${this.REPOSITORY_NAME}/commits/${commitSha}`,
        {
          headers: {
            'Authorization': `token ${this.GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const commit = await response.json();
      
      const files = commit.files?.map((file: any) => ({
        filename: file.filename,
        status: file.status,
        additions: file.additions,
        deletions: file.deletions
      })) || [];

      const totalAdditions = files.reduce((sum, file) => sum + file.additions, 0);
      const totalDeletions = files.reduce((sum, file) => sum + file.deletions, 0);

      return {
        files_changed: files.length,
        additions: totalAdditions,
        deletions: totalDeletions,
        files
      };
    } catch (error) {
      console.error('Failed to fetch commit details:', error);
      throw error;
    }
  }

  // Get repository statistics
  async getRepositoryStats(): Promise<{
    total_commits: number;
    total_contributors: number;
    total_lines: number;
    language_breakdown: Record<string, number>;
  }> {
    return this.fetchWithCache('repository_stats', async () => {
      try {
        if (!this.GITHUB_TOKEN) {
          throw new Error('GitHub not configured');
        }

        // Get languages
        const languagesResponse = await fetch(
          `https://api.github.com/repos/${this.REPOSITORY_OWNER}/${this.REPOSITORY_NAME}/languages`,
          {
            headers: {
              'Authorization': `token ${this.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        let languageBreakdown: Record<string, number> = {};
        if (languagesResponse.ok) {
          languageBreakdown = await languagesResponse.json();
        }

        // Get contributors
        const contributorsResponse = await fetch(
          `https://api.github.com/repos/${this.REPOSITORY_OWNER}/${this.REPOSITORY_NAME}/contributors?per_page=100`,
          {
            headers: {
              'Authorization': `token ${this.GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json'
            }
          }
        );

        let contributors: any[] = [];
        if (contributorsResponse.ok) {
          contributors = await contributorsResponse.json();
        }

        const totalLines = Object.values(languageBreakdown).reduce((sum: number, lines: any) => sum + lines, 0);

        return {
          total_commits: 0, // Would need additional API calls
          total_contributors: contributors.length,
          total_lines: totalLines,
          language_breakdown: languageBreakdown
        };
      } catch (error) {
        console.error('Failed to fetch repository stats:', error);
        throw error;
      }
    });
  }

  // Helper method for caching
  private async fetchWithCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }

    try {
      const data = await fetcher();
      this.cache.set(key, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      throw error;
    }
  }

  // Clear cache
  clearCache(): void {
    this.cache.clear();
  }
}

export default GitService;
