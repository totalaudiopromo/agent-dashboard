'use client';

import React, { useState, useEffect } from 'react';
import { Brain, FileText, TrendingUp, Activity, Clock, CheckCircle, AlertCircle, Zap, Users, Target, Music, Headphones, Mic } from 'lucide-react';

interface AgentStatus {
  id: string;
  name: string;
  platform: 'audio-intel' | 'playlist-pulse' | 'voice-echo' | 'cross-platform';
  status: 'active' | 'idle' | 'busy' | 'maintenance';
  lastActivity: string;
  currentTask?: string;
  performance: {
    successRate: number;
    tasksCompleted: number;
    avgResponseTime: number;
  };
  metrics: {
    primary: { label: string; value: string | number; trend?: 'up' | 'down' | 'stable' };
    secondary: { label: string; value: string | number; trend?: 'up' | 'down' | 'stable' };
    tertiary: { label: string; value: string | number; trend?: 'up' | 'down' | 'stable' };
  };
}

export default function AgentStatusGrid() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // Import the Claude Code service
        const { default: ClaudeCodeService } = await import('../services/claudeCodeService');
        const claudeCodeService = ClaudeCodeService.getInstance();
        
        const claudeAgents = await claudeCodeService.getAllAgents();
        
        // Transform Claude Code agents to AgentStatus format
        const transformedAgents: AgentStatus[] = claudeAgents.map(agent => ({
          id: agent.id,
          name: agent.name,
          platform: getPlatformFromAgent(agent.id),
          status: agent.status,
          lastActivity: formatTimeAgo(agent.last_activity),
          currentTask: agent.current_task,
          performance: {
            successRate: agent.performance.success_rate,
            tasksCompleted: agent.performance.tasks_completed,
            avgResponseTime: agent.performance.avg_response_time
          },
          metrics: {
            primary: { 
              label: getPrimaryMetricLabel(agent.id), 
              value: getPrimaryMetricValue(agent.id, agent.performance), 
              trend: 'up' 
            },
            secondary: { 
              label: 'Success Rate', 
              value: `${agent.performance.success_rate}%`, 
              trend: 'up' 
            },
            tertiary: { 
              label: getTertiaryMetricLabel(agent.id), 
              value: getTertiaryMetricValue(agent.id, agent.performance), 
              trend: 'stable' 
            }
          }
        }));
        
        setAgents(transformedAgents);
      } catch (error) {
        console.error('Failed to fetch agents:', error);
        // Fallback to default agents if service fails
        setAgents(getDefaultAgents());
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Helper function to determine platform from agent ID
  const getPlatformFromAgent = (agentId: string): 'audio-intel' | 'playlist-pulse' | 'voice-echo' | 'cross-platform' => {
    switch (agentId) {
      case 'intel-research-agent':
        return 'audio-intel';
      case 'campaign-planner-agent':
        return 'cross-platform';
      case 'content-creation-agent':
        return 'voice-echo';
      case 'performance-monitor-agent':
        return 'cross-platform';
      case 'testing-agent':
        return 'cross-platform';
      case 'documentation-agent':
        return 'cross-platform';
      default:
        return 'cross-platform';
    }
  };

  // Helper function to get primary metric label
  const getPrimaryMetricLabel = (agentId: string): string => {
    switch (agentId) {
      case 'intel-research-agent':
        return 'Contacts Analysed';
      case 'campaign-planner-agent':
        return 'Active Campaigns';
      case 'content-creation-agent':
        return 'Content Queue';
      case 'performance-monitor-agent':
        return 'Monitored Campaigns';
      case 'testing-agent':
        return 'Tests Completed';
      case 'documentation-agent':
        return 'Guides Created';
      default:
        return 'Tasks Completed';
    }
  };

  // Helper function to get primary metric value
  const getPrimaryMetricValue = (agentId: string, performance: any): string | number => {
    switch (agentId) {
      case 'intel-research-agent':
        return '47.2K';
      case 'campaign-planner-agent':
        return 23;
      case 'content-creation-agent':
        return 12;
      case 'performance-monitor-agent':
        return 247;
      case 'testing-agent':
        return performance.tasks_completed;
      case 'documentation-agent':
        return performance.tasks_completed;
      default:
        return performance.tasks_completed;
    }
  };

  // Helper function to get tertiary metric label
  const getTertiaryMetricLabel = (agentId: string): string => {
    switch (agentId) {
      case 'intel-research-agent':
        return 'Insights Generated';
      case 'campaign-planner-agent':
        return 'Avg Strategy Time';
      case 'content-creation-agent':
        return 'Pieces Generated';
      case 'performance-monitor-agent':
        return 'Alert Response';
      case 'testing-agent':
        return 'Bug Reports';
      case 'documentation-agent':
        return 'Support Tickets';
      default:
        return 'Response Time';
    }
  };

  // Helper function to get tertiary metric value
  const getTertiaryMetricValue = (agentId: string, performance: any): string | number => {
    switch (agentId) {
      case 'intel-research-agent':
        return 8743;
      case 'campaign-planner-agent':
        return `${performance.avg_response_time}s`;
      case 'content-creation-agent':
        return '3.4K';
      case 'performance-monitor-agent':
        return `${performance.avg_response_time}s`;
      case 'testing-agent':
        return Math.floor(performance.tasks_completed * 0.1);
      case 'documentation-agent':
        return Math.floor(performance.tasks_completed * 0.2);
      default:
        return `${performance.avg_response_time}s`;
    }
  };

  // Helper function to format time ago
  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  };

  // Fallback default agents if service fails
  const getDefaultAgents = (): AgentStatus[] => [
    {
      id: 'intel-research-agent',
      name: 'Intel Research Agent',
      platform: 'audio-intel',
      status: 'active',
      lastActivity: '2 minutes ago',
      currentTask: 'Analysing contact database for strategic insights',
      performance: {
        successRate: 96.8,
        tasksCompleted: 2847,
        avgResponseTime: 1.2
      },
      metrics: {
        primary: { label: 'Contacts Analysed', value: '47.2K', trend: 'up' },
        secondary: { label: 'Success Rate', value: '96.8%', trend: 'up' },
        tertiary: { label: 'Insights Generated', value: 8743, trend: 'up' }
      }
    },
    {
      id: 'campaign-planner-agent',
      name: 'Campaign Planner Agent',
      platform: 'cross-platform',
      status: 'busy',
      lastActivity: '30 seconds ago',
      currentTask: 'Creating 8-week cross-platform strategy for Luna Rivers',
      performance: {
        successRate: 94.2,
        tasksCompleted: 1247,
        avgResponseTime: 2.3
      },
      metrics: {
        primary: { label: 'Active Campaigns', value: 23, trend: 'up' },
        secondary: { label: 'Success Rate', value: '94.2%', trend: 'up' },
        tertiary: { label: 'Avg Strategy Time', value: '2.3s', trend: 'stable' }
      }
    },
    {
      id: 'content-creation-agent',
      name: 'Content Creation Agent',
      platform: 'voice-echo',
      status: 'active',
      lastActivity: '1 minute ago',
      currentTask: 'Generating press releases and social media content',
      performance: {
        successRate: 91.7,
        tasksCompleted: 3456,
        avgResponseTime: 1.8
      },
      metrics: {
        primary: { label: 'Content Queue', value: 12, trend: 'stable' },
        secondary: { label: 'Completion Rate', value: '91.7%', trend: 'up' },
        tertiary: { label: 'Pieces Generated', value: '3.4K', trend: 'up' }
      }
    },
    {
      id: 'performance-monitor-agent',
      name: 'Performance Monitor Agent',
      platform: 'cross-platform',
      status: 'active',
      lastActivity: '5 seconds ago',
      currentTask: 'Monitoring viral opportunities across all platforms',
      performance: {
        successRate: 97.1,
        tasksCompleted: 4521,
        avgResponseTime: 0.8
      },
      metrics: {
        primary: { label: 'Monitored Campaigns', value: 247, trend: 'up' },
        secondary: { label: 'Viral Opportunities', value: 7, trend: 'up' },
        tertiary: { label: 'Alert Response', value: '0.8s', trend: 'stable' }
      }
    },
    {
      id: 'testing-agent',
      name: 'Testing Agent',
      platform: 'cross-platform',
      status: 'idle',
      lastActivity: '2 hours ago',
      currentTask: undefined,
      performance: {
        successRate: 98.9,
        tasksCompleted: 2156,
        avgResponseTime: 3.1
      },
      metrics: {
        primary: { label: 'Tests Completed', value: 2156, trend: 'up' },
        secondary: { label: 'Success Rate', value: '98.9%', trend: 'up' },
        tertiary: { label: 'Bug Reports', value: 23, trend: 'down' }
      }
    },
    {
      id: 'documentation-agent',
      name: 'Documentation Agent',
      platform: 'cross-platform',
      status: 'active',
      lastActivity: '45 minutes ago',
      currentTask: 'Creating feature adoption guides for new customers',
      performance: {
        successRate: 95.3,
        tasksCompleted: 892,
        avgResponseTime: 4.2
      },
      metrics: {
        primary: { label: 'Guides Created', value: 892, trend: 'up' },
        secondary: { label: 'Success Rate', value: '95.3%', trend: 'up' },
        tertiary: { label: 'Support Tickets', value: 156, trend: 'down' }
      }
    }
  ];

  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    // Simulate real-time updates for agent status
    const interval = setInterval(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => ({
          ...agent,
          lastActivity: Math.random() > 0.7 ? 'Just now' : agent.lastActivity,
          performance: {
            ...agent.performance,
            tasksCompleted: agent.performance.tasksCompleted + (Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0)
          }
        }))
      );
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Claude Code agents...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'busy': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'idle': return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
      case 'maintenance': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'busy': return <Activity className="w-4 h-4" />;
      case 'idle': return <Clock className="w-4 h-4" />;
      case 'maintenance': return <AlertCircle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'audio-intel': return <Brain className="w-5 h-5" />;
      case 'playlist-pulse': return <Music className="w-5 h-5" />;
      case 'voice-echo': return <Mic className="w-5 h-5" />;
      case 'cross-platform': return <Zap className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'audio-intel': return 'text-blue-400 bg-blue-400/10';
      case 'playlist-pulse': return 'text-green-400 bg-green-400/10';
      case 'voice-echo': return 'text-purple-400 bg-purple-400/10';
      case 'cross-platform': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '→';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`bg-gray-900 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:border-yellow-500/50 ${
              selectedAgent === agent.id ? 'border-yellow-500' : 'border-gray-700'
            }`}
            onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
          >
            {/* Agent Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getPlatformColor(agent.platform)}`}>
                    {getPlatformIcon(agent.platform)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">{agent.name}</h3>
                    <div className="text-xs text-gray-400 capitalize">{agent.platform.replace('-', ' ')}</div>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(agent.status)}`}>
                  {getStatusIcon(agent.status)}
                  <span className="capitalize font-medium">{agent.status}</span>
                </div>
              </div>

              {/* Current Task */}
              {agent.currentTask && (
                <div className="text-xs text-gray-400 mb-2">
                  <span className="text-gray-500">Current: </span>
                  {agent.currentTask}
                </div>
              )}

              <div className="text-xs text-gray-500">
                Last activity: {agent.lastActivity}
              </div>
            </div>

            {/* Agent Metrics */}
            <div className="p-4">
              <div className="grid grid-cols-1 gap-3">
                {/* Primary Metric */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{agent.metrics.primary.label}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-white">{agent.metrics.primary.value}</span>
                    {agent.metrics.primary.trend && (
                      <span className="text-xs">{getTrendIcon(agent.metrics.primary.trend)}</span>
                    )}
                  </div>
                </div>

                {/* Secondary Metric */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{agent.metrics.secondary.label}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-green-400">{agent.metrics.secondary.value}</span>
                    {agent.metrics.secondary.trend && (
                      <span className="text-xs">{getTrendIcon(agent.metrics.secondary.trend)}</span>
                    )}
                  </div>
                </div>

                {/* Tertiary Metric */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">{agent.metrics.tertiary.label}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold text-blue-400">{agent.metrics.tertiary.value}</span>
                    {agent.metrics.tertiary.trend && (
                      <span className="text-xs">{getTrendIcon(agent.metrics.tertiary.trend)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-400">Performance</span>
                  <span className="text-green-400 font-medium">{agent.performance.successRate}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full"
                    style={{ width: `${agent.performance.successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedAgent === agent.id && (
              <div className="border-t border-gray-700 p-4 bg-gray-800/50">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Tasks Completed</span>
                    <span className="text-sm text-white font-medium">{agent.performance.tasksCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Avg Response Time</span>
                    <span className="text-sm text-white font-medium">{agent.performance.avgResponseTime}s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Success Rate</span>
                    <span className="text-sm text-green-400 font-medium">{agent.performance.successRate}%</span>
                  </div>
                  
                  {/* Platform-Specific Details */}
                  <div className="pt-2 border-t border-gray-600">
                    <div className="text-xs text-gray-400 mb-2">Platform: {agent.platform.replace('-', ' ')}</div>
                    {agent.platform === 'audio-intel' && (
                      <div className="space-y-1 text-xs">
                        <div className="text-gray-300">• 2.4K contacts enriched this week</div>
                        <div className="text-gray-300">• 347 strategic insights generated</div>
                        <div className="text-gray-300">• 96.8% accuracy rate maintained</div>
                      </div>
                    )}
                    
                    {agent.platform === 'playlist-pulse' && (
                      <div className="space-y-1 text-xs">
                        <div className="text-gray-300">• 234 playlists pitched this week</div>
                        <div className="text-gray-300">• 81 curator responses received</div>
                        <div className="text-gray-300">• 34.7% acceptance rate achieved</div>
                      </div>
                    )}
                    
                    {agent.platform === 'voice-echo' && (
                      <div className="space-y-1 text-xs">
                        <div className="text-gray-300">• 156 content pieces generated</div>
                        <div className="text-gray-300">• 47 press releases created</div>
                        <div className="text-gray-300">• 289 social media posts optimized</div>
                      </div>
                    )}
                    
                    {agent.platform === 'cross-platform' && (
                      <div className="space-y-1 text-xs">
                        <div className="text-gray-300">• 34 cross-platform campaigns active</div>
                        <div className="text-gray-300">• 127 data sync operations completed</div>
                        <div className="text-gray-300">• 92.5% synchronization success rate</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ecosystem Summary Stats */}
      <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
        <h4 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
          <Target className="w-5 h-5 text-yellow-400" />
          <span>Total Audio Promo Ecosystem Performance</span>
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">95.1%</div>
            <div className="text-sm text-gray-400">Overall Success Rate</div>
            <div className="text-xs text-green-400 mt-1">Across all platforms</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">13.8K</div>
            <div className="text-sm text-gray-400">Total Tasks Completed</div>
            <div className="text-xs text-yellow-400 mt-1">This month</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">1.4s</div>
            <div className="text-sm text-gray-400">Avg Response Time</div>
            <div className="text-xs text-blue-400 mt-1">Cross-platform</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">99.98%</div>
            <div className="text-sm text-gray-400">System Uptime</div>
            <div className="text-xs text-purple-400 mt-1">Ecosystem wide</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">6</div>
            <div className="text-sm text-gray-400">Active Agents</div>
            <div className="text-xs text-orange-400 mt-1">Operational</div>
          </div>
        </div>
      </div>
    </div>
  );
}