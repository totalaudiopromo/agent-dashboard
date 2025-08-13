'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Brain, FileText, TrendingUp, Zap, Target, AlertTriangle, CheckCircle, Clock, Music, Users, Headphones, Mic, Play, Pause, Square } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface AgentWorkItem {
  id: string;
  agentId: string;
  agentName: string;
  platform: 'audio-intel' | 'playlist-pulse' | 'voice-echo' | 'cross-platform';
  currentTask: {
    title: string;
    description: string;
    progress: number;
    status: 'not-started' | 'in-progress' | 'paused' | 'completed' | 'error';
    startedAt: Date;
    estimatedCompletion: Date;
    actualProgress: string;
  };
  nextActions: string[];
  recentActivity: {
    timestamp: Date;
    action: string;
    result: string;
  }[];
  performance: {
    tasksCompletedToday: number;
    successRate: number;
    avgTaskDuration: number;
  };
}

export default function AgentWorkVisualization() {
  const [agents, setAgents] = useState<AgentWorkItem[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  useEffect(() => {
    // Initialize with realistic agent work data
    const initialAgents: AgentWorkItem[] = [
      {
        id: 'intel-research-agent',
        agentId: 'intel-research',
        agentName: 'Intel Research Agent',
        platform: 'audio-intel',
        currentTask: {
          title: 'Contact Database Enhancement',
          description: 'Enriching 2,847 contacts with strategic intelligence and outreach preferences',
          progress: 67,
          status: 'in-progress',
          startedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
          estimatedCompletion: new Date(Date.now() + 20 * 60 * 1000), // 20 minutes from now
          actualProgress: '1,907 of 2,847 contacts processed'
        },
        nextActions: [
          'Generate strategic insights report',
          'Identify high-priority outreach targets',
          'Update contact scoring algorithm'
        ],
        recentActivity: [
          {
            timestamp: new Date(Date.now() - 2 * 60 * 1000),
            action: 'Contact enrichment',
            result: 'Added 47 new strategic insights'
          },
          {
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            action: 'Database sync',
            result: 'Synchronized with CRM system'
          },
          {
            timestamp: new Date(Date.now() - 8 * 60 * 1000),
            action: 'Quality check',
            result: 'Verified 156 email addresses'
          }
        ],
        performance: {
          tasksCompletedToday: 12,
          successRate: 96.8,
          avgTaskDuration: 2.3
        }
      },
      {
        id: 'campaign-planner-agent',
        agentId: 'campaign-planner',
        agentName: 'Campaign Planner Agent',
        platform: 'cross-platform',
        currentTask: {
          title: 'Luna Rivers Campaign Strategy',
          description: 'Creating 8-week cross-platform campaign spanning Audio Intel, Playlist Pulse, and Voice Echo',
          progress: 34,
          status: 'in-progress',
          startedAt: new Date(Date.now() - 90 * 60 * 1000), // 90 minutes ago
          estimatedCompletion: new Date(Date.now() + 120 * 60 * 1000), // 2 hours from now
          actualProgress: 'Week 1-3 strategy complete, working on Week 4-8'
        },
        nextActions: [
          'Finalize playlist targeting strategy',
          'Create content calendar',
          'Set up performance tracking'
        ],
        recentActivity: [
          {
            timestamp: new Date(Date.now() - 3 * 60 * 1000),
            action: 'Strategy planning',
            result: 'Completed Week 3 campaign outline'
          },
          {
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            action: 'Platform integration',
            result: 'Connected Audio Intel and Playlist Pulse data'
          },
          {
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            action: 'Target audience analysis',
            result: 'Identified 3 key audience segments'
          }
        ],
        performance: {
          tasksCompletedToday: 8,
          successRate: 94.2,
          avgTaskDuration: 4.1
        }
      },
      {
        id: 'content-creation-agent',
        agentId: 'content-creation',
        agentName: 'Content Creation Agent',
        platform: 'voice-echo',
        currentTask: {
          title: 'Press Release Generation',
          description: 'Creating press releases and social media content for 3 upcoming releases',
          progress: 89,
          status: 'in-progress',
          startedAt: new Date(Date.now() - 25 * 60 * 1000), // 25 minutes ago
          estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
          actualProgress: '2 of 3 press releases complete, finalizing social media pack'
        },
        nextActions: [
          'Finalize social media templates',
          'Generate email campaign copy',
          'Create blog pitch templates'
        ],
        recentActivity: [
          {
            timestamp: new Date(Date.now() - 1 * 60 * 1000),
            action: 'Content creation',
            result: 'Completed press release for Alex Storm'
          },
          {
            timestamp: new Date(Date.now() - 8 * 60 * 1000),
            action: 'Social media pack',
            result: 'Generated Instagram and TikTok content'
          },
          {
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            action: 'Press release',
            result: 'Completed Maya Chen press release'
          }
        ],
        performance: {
          tasksCompletedToday: 15,
          successRate: 91.7,
          avgTaskDuration: 1.8
        }
      },
      {
        id: 'playlist-curator-agent',
        agentId: 'playlist-curator',
        agentName: 'Playlist Curator Agent',
        platform: 'playlist-pulse',
        currentTask: {
          title: 'Playlist Outreach Campaign',
          description: 'Pitching 156 tracks to 89 curated playlists across Spotify and Apple Music',
          progress: 23,
          status: 'in-progress',
          startedAt: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
          estimatedCompletion: new Date(Date.now() + 180 * 60 * 1000), // 3 hours from now
          actualProgress: '36 of 156 tracks pitched, 12 curator responses received'
        },
        nextActions: [
          'Follow up on pending pitches',
          'Analyze curator feedback',
          'Adjust targeting strategy'
        ],
        recentActivity: [
          {
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            action: 'Playlist pitching',
            result: 'Pitched 8 tracks to indie electronic playlists'
          },
          {
            timestamp: new Date(Date.now() - 12 * 60 * 1000),
            action: 'Curator response',
            result: 'Added to "Chill Vibes" playlist (67K followers)'
          },
          {
            timestamp: new Date(Date.now() - 20 * 60 * 1000),
            action: 'Target research',
            result: 'Identified 23 new playlist opportunities'
          }
        ],
        performance: {
          tasksCompletedToday: 6,
          successRate: 87.3,
          avgTaskDuration: 3.2
        }
      },
      {
        id: 'performance-monitor-agent',
        agentId: 'performance-monitor',
        agentName: 'Performance Monitor Agent',
        platform: 'cross-platform',
        currentTask: {
          title: 'Viral Opportunity Monitoring',
          description: 'Monitoring 247 active campaigns for viral opportunities and engagement spikes',
          progress: 100,
          status: 'completed',
          startedAt: new Date(Date.now() - 180 * 60 * 1000), // 3 hours ago
          estimatedCompletion: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
          actualProgress: 'All campaigns monitored, 7 viral opportunities detected'
        },
        nextActions: [
          'Generate viral opportunity report',
          'Alert campaign managers',
          'Update performance dashboards'
        ],
        recentActivity: [
          {
            timestamp: new Date(Date.now() - 2 * 60 * 1000),
            action: 'Viral detection',
            result: 'Identified TikTok trend opportunity'
          },
          {
            timestamp: new Date(Date.now() - 8 * 60 * 1000),
            action: 'Performance alert',
            result: 'Luna Rivers engagement up 18.4%'
          },
          {
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            action: 'Campaign monitoring',
            result: 'All 247 campaigns status updated'
          }
        ],
        performance: {
          tasksCompletedToday: 22,
          successRate: 97.1,
          avgTaskDuration: 0.8
        }
      }
    ];

    setAgents(initialAgents);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setAgents(prevAgents => 
        prevAgents.map(agent => {
          if (agent.currentTask.status === 'in-progress') {
            const newProgress = Math.min(100, agent.currentTask.progress + Math.random() * 2);
            const isCompleted = newProgress >= 100;
            
            return {
              ...agent,
              currentTask: {
                ...agent.currentTask,
                progress: newProgress,
                status: isCompleted ? 'completed' : 'in-progress',
                actualProgress: isCompleted ? 'Task completed' : agent.currentTask.actualProgress
              },
              performance: {
                ...agent.performance,
                tasksCompletedToday: isCompleted ? agent.performance.tasksCompletedToday + 1 : agent.performance.tasksCompletedToday
              }
            };
          }
          return agent;
        })
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-progress': return <Play className="w-4 h-4 text-blue-400" />;
      case 'paused': return <Pause className="w-4 h-4 text-yellow-400" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'paused': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'error': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'audio-intel': return <Brain className="w-5 h-5 text-blue-400" />;
      case 'playlist-pulse': return <Music className="w-5 h-5 text-green-400" />;
      case 'voice-echo': return <Mic className="w-5 h-5 text-purple-400" />;
      case 'cross-platform': return <Zap className="w-5 h-5 text-yellow-400" />;
      default: return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const formatTimeRemaining = (estimatedCompletion: Date) => {
    const now = new Date();
    const diffMs = estimatedCompletion.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMs < 0) return 'Overdue';
    if (diffMins < 60) return `${diffMins}m remaining`;
    return `${diffHours}h ${diffMins % 60}m remaining`;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    return `${diffHours}h ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Agent Work Visualization</h3>
        <div className="text-sm text-gray-400">
          Real-time view of what each agent is working on
        </div>
      </div>

      {/* Agent Work Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="bg-gray-900 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gray-800">
                    {getPlatformIcon(agent.platform)}
                  </div>
                  <div>
                    <CardTitle className="text-white text-base">{agent.agentName}</CardTitle>
                    <div className="text-xs text-gray-400 capitalize">{agent.platform.replace('-', ' ')}</div>
                  </div>
                </div>
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border text-xs ${getStatusColor(agent.currentTask.status)}`}>
                  {getStatusIcon(agent.currentTask.status)}
                  <span className="capitalize font-medium">{agent.currentTask.status.replace('-', ' ')}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Current Task */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">Current Task</h4>
                  <span className="text-xs text-gray-400">
                    {agent.currentTask.status === 'completed' 
                      ? 'Completed' 
                      : formatTimeRemaining(agent.currentTask.estimatedCompletion)
                    }
                  </span>
                </div>
                
                <div>
                  <div className="text-sm text-white font-medium mb-1">
                    {agent.currentTask.title}
                  </div>
                  <div className="text-xs text-gray-400 mb-3">
                    {agent.currentTask.description}
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        agent.currentTask.status === 'completed' 
                          ? 'bg-green-500' 
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${agent.currentTask.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-gray-400">
                    {agent.currentTask.actualProgress}
                  </div>
                </div>
              </div>

              {/* Next Actions */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Next Actions</h4>
                <div className="space-y-1">
                  {agent.nextActions.slice(0, 2).map((action, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span className="text-gray-300">{action}</span>
                    </div>
                  ))}
                  {agent.nextActions.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{agent.nextActions.length - 2} more actions
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white">Recent Activity</h4>
                <div className="space-y-1">
                  {agent.recentActivity.slice(0, 2).map((activity, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">{activity.action}</span>
                      </div>
                      <span className="text-gray-500">{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Summary */}
              <div className="pt-3 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-400">{agent.performance.tasksCompletedToday}</div>
                    <div className="text-xs text-gray-400">Today</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-400">{agent.performance.successRate}%</div>
                    <div className="text-xs text-gray-400">Success</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-yellow-400">{agent.performance.avgTaskDuration}s</div>
                    <div className="text-xs text-gray-400">Avg Time</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Work Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {agents.filter(a => a.currentTask.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {agents.filter(a => a.currentTask.status === 'in-progress').length}
              </div>
              <div className="text-sm text-gray-400">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {agents.reduce((sum, a) => sum + a.performance.tasksCompletedToday, 0)}
              </div>
              <div className="text-sm text-gray-400">Tasks Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {agents.reduce((sum, a) => sum + a.performance.successRate, 0) / agents.length}%
              </div>
              <div className="text-sm text-gray-400">Avg Success</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
