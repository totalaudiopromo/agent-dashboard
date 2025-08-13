import { Client } from '@notionhq/client';

interface NotionPage {
  id: string;
  title: string;
  url: string;
  lastEditedTime: string;
  properties: Record<string, any>;
}

interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, any>;
}

interface AgentTask {
  id: string;
  agent: string;
  task: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  progress: number;
  estimatedCompletion: Date;
  actualCompletion?: Date;
  metadata: Record<string, any>;
}

interface BusinessMetrics {
  mrr: number;
  customerCount: number;
  growthRate: number;
  churnRate: number;
  platformUsage: Record<string, number>;
}

export default class NotionService {
  private static instance: NotionService;
  private notion: Client;
  private databaseId: string;
  private projectPageId: string;

  private constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_TOKEN || '',
    });
    this.databaseId = process.env.NOTION_DATABASE_ID || '';
    this.projectPageId = process.env.NOTION_PROJECT_PAGE_ID || '';
  }

  public static getInstance(): NotionService {
    if (!NotionService.instance) {
      NotionService.instance = new NotionService();
    }
    return NotionService.instance;
  }

  // Test Notion connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.notion.users.me({});
      return {
        success: true,
        message: `Connected as ${response.name || 'Unknown User'}`
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Connection failed: ${error.message}`
      };
    }
  }

  // Create or update project status page
  async updateProjectStatus(projectName: string, status: string, progress: number): Promise<string> {
    try {
      // Check if project page exists
      const existingPage = await this.findProjectPage(projectName);
      
      if (existingPage) {
        // Update existing page
        await this.notion.pages.update({
          page_id: existingPage.id,
          properties: {
            'Status': {
              select: {
                name: status
              }
            },
            'Progress': {
              number: progress
            },
            'Last Updated': {
              date: {
                start: new Date().toISOString()
              }
            }
          }
        });
        return existingPage.id;
      } else {
        // Create new project page
        const response = await this.notion.pages.create({
          parent: { database_id: this.databaseId },
          properties: {
            'Name': {
              title: [
                {
                  text: {
                    content: projectName
                  }
                }
              ]
            },
            'Status': {
              select: {
                name: status
              }
            },
            'Progress': {
              number: progress
            },
            'Created': {
              date: {
                start: new Date().toISOString()
              }
            },
            'Last Updated': {
              date: {
                start: new Date().toISOString()
              }
            }
          }
        });
        return response.id;
      }
    } catch (error: any) {
      console.error('Failed to update project status:', error);
      throw new Error(`Notion update failed: ${error.message}`);
    }
  }

  // Sync agent task completion to Notion
  async syncAgentTask(task: AgentTask): Promise<void> {
    try {
      const taskPageId = await this.createOrUpdateTaskPage(task);
      
      // Add task completion to project status
      if (task.status === 'completed') {
        await this.addTaskCompletionToProject(task);
      }
    } catch (error: any) {
      console.error('Failed to sync agent task:', error);
      throw new Error(`Task sync failed: ${error.message}`);
    }
  }

  // Update business metrics dashboard
  async updateBusinessMetrics(metrics: BusinessMetrics): Promise<void> {
    try {
      const metricsPageId = await this.findOrCreateMetricsPage();
      
      await this.notion.pages.update({
        page_id: metricsPageId,
        properties: {
          'MRR': {
            number: metrics.mrr
          },
          'Customer Count': {
            number: metrics.customerCount
          },
          'Growth Rate': {
            number: metrics.growthRate
          },
          'Churn Rate': {
            number: metrics.churnRate
          },
          'Last Updated': {
            date: {
              start: new Date().toISOString()
            }
          }
        }
      });

      // Update platform usage metrics
      await this.updatePlatformUsageMetrics(metricsPageId, metrics.platformUsage);
    } catch (error: any) {
      console.error('Failed to update business metrics:', error);
      throw new Error(`Metrics update failed: ${error.message}`);
    }
  }

  // Create automated progress report
  async createProgressReport(reportData: {
    period: string;
    completedTasks: number;
    totalTasks: number;
    agentPerformance: Record<string, number>;
    revenueImpact: number;
    nextWeekPriorities: string[];
  }): Promise<string> {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          'Report Type': {
            select: {
              name: 'Progress Report'
            }
          },
          'Period': {
            rich_text: [
              {
                text: {
                  content: reportData.period
                }
              }
            ]
          },
          'Completion Rate': {
            number: (reportData.completedTasks / reportData.totalTasks) * 100
          },
          'Revenue Impact': {
            number: reportData.revenueImpact
          },
          'Created': {
            date: {
              start: new Date().toISOString()
            }
          }
        }
      });

      // Add detailed content to the page
      await this.addReportContent(response.id, reportData);

      return response.id;
    } catch (error: any) {
      console.error('Failed to create progress report:', error);
      throw new Error(`Report creation failed: ${error.message}`);
    }
  }

  // Private helper methods
  private async findProjectPage(projectName: string): Promise<NotionPage | null> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Name',
          title: {
            equals: projectName
          }
        }
      });

      if (response.results.length > 0) {
        const page = response.results[0] as any;
        return {
          id: page.id,
          title: page.properties.Name?.title?.[0]?.text?.content || '',
          url: page.url,
          lastEditedTime: page.last_edited_time,
          properties: page.properties
        };
      }
      return null;
    } catch (error) {
      console.error('Failed to find project page:', error);
      return null;
    }
  }

  private async findOrCreateMetricsPage(): Promise<string> {
    try {
      const response = await this.notion.databases.query({
        database_id: this.databaseId,
        filter: {
          property: 'Report Type',
          select: {
            equals: 'Business Metrics'
          }
        }
      });

      if (response.results.length > 0) {
        return response.results[0].id;
      } else {
        // Create new metrics page
        const newPage = await this.notion.pages.create({
          parent: { database_id: this.databaseId },
          properties: {
            'Report Type': {
              select: {
                name: 'Business Metrics'
              }
            },
            'Name': {
              title: [
                {
                  text: {
                    content: 'Business Metrics Dashboard'
                  }
                }
              ]
            }
          }
        });
        return newPage.id;
      }
    } catch (error) {
      console.error('Failed to find or create metrics page:', error);
      throw new Error('Metrics page creation failed');
    }
  }

  private async createOrUpdateTaskPage(task: AgentTask): Promise<string> {
    try {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          'Task Type': {
            select: {
              name: 'Agent Task'
            }
          },
          'Agent': {
            rich_text: [
              {
                text: {
                  content: task.agent
                }
              }
            ]
          },
          'Task': {
            rich_text: [
              {
                text: {
                  content: task.task
                }
              }
            ]
          },
          'Status': {
            select: {
              name: task.status
            }
          },
          'Progress': {
            number: task.progress
          },
          'Estimated Completion': {
            date: {
              start: task.estimatedCompletion.toISOString()
            }
          },
          'Created': {
            date: {
              start: new Date().toISOString()
            }
          }
        }
      });

      return response.id;
    } catch (error: any) {
      console.error('Failed to create task page:', error);
      throw new Error('Task page creation failed');
    }
  }

  private async addTaskCompletionToProject(task: AgentTask): Promise<void> {
    try {
      // Find the project this task belongs to
      const projectPage = await this.findProjectPage(task.metadata.project || 'Unknown Project');
      
      if (projectPage) {
        // Add task completion to project page
        await this.notion.blocks.children.append({
          block_id: projectPage.id,
          children: [
            {
              object: 'block',
              type: 'bulleted_list_item',
              bulleted_list_item: {
                rich_text: [
                  {
                    type: 'text',
                    text: {
                      content: `✅ ${task.agent} completed: ${task.task}`
                    }
                  }
                ]
              }
            }
          ]
        });
      }
    } catch (error) {
      console.error('Failed to add task completion to project:', error);
    }
  }

  private async updatePlatformUsageMetrics(pageId: string, platformUsage: Record<string, number>): Promise<void> {
    try {
      // Add platform usage as child blocks
      const children = Object.entries(platformUsage).map(([platform, usage]) => ({
        object: 'block' as const,
        type: 'bulleted_list_item' as const,
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text' as const,
              text: {
                content: `${platform}: ${usage}% usage`
              }
            }
          ]
        }
      }));

      await this.notion.blocks.children.append({
        block_id: pageId,
        children
      });
    } catch (error) {
      console.error('Failed to update platform usage metrics:', error);
    }
  }

  private async addReportContent(pageId: string, reportData: any): Promise<void> {
    try {
      const children = [
        {
          object: 'block' as const,
          type: 'heading_2' as const,
          heading_2: {
            rich_text: [
              {
                type: 'text' as const,
                text: {
                  content: 'Agent Performance'
                }
              }
            ]
          }
        },
        ...Object.entries(reportData.agentPerformance).map(([agent, performance]) => ({
          object: 'block' as const,
          type: 'bulleted_list_item' as const,
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text' as const,
                text: {
                  content: `${agent}: ${performance}% success rate`
                }
              }
            ]
          }
        })),
        {
          object: 'block' as const,
          type: 'heading_2' as const,
          heading_2: {
            rich_text: [
              {
                type: 'text' as const,
                text: {
                  content: 'Next Week Priorities'
                }
              }
            ]
          }
        },
        ...reportData.nextWeekPriorities.map((priority: string) => ({
          object: 'block' as const,
          type: 'bulleted_list_item' as const,
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text' as const,
                text: {
                  content: priority
                }
              }
            ]
          }
        }))
      ];

      await this.notion.blocks.children.append({
        block_id: pageId,
        children
      });
    } catch (error) {
      console.error('Failed to add report content:', error);
    }
  }
}
