'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Brain, FileText, TrendingUp, Zap, Target, AlertTriangle, CheckCircle, Clock, Music, Users, Headphones, Mic } from 'lucide-react';

interface ActivityItem {
  id: string;
  timestamp: Date;
  agent: 'intel-research' | 'campaign-planner' | 'content-creation' | 'playlist-curator' | 'performance-monitor' | 'cross-promotion';
  platform: 'audio-intel' | 'playlist-pulse' | 'voice-echo' | 'cross-platform';
  type: 'action' | 'milestone' | 'alert' | 'success' | 'warning' | 'sync';
  title: string;
  description: string;
  metadata?: {
    campaign?: string;
    artist?: string;
    metric?: string;
    value?: string | number;
    platform?: string;
  };
}

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      agent: 'performance-monitor',
      platform: 'cross-platform',
      type: 'alert',
      title: 'Viral Opportunity Detected',
      description: 'High engagement spike across TikTok and Instagram',
      metadata: { campaign: 'Luna Rivers - Midnight Echoes', metric: 'cross_platform_engagement', value: '18.4%' }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 4 * 60 * 1000),
      agent: 'playlist-curator',
      platform: 'playlist-pulse',
      type: 'success',
      title: 'Playlist Placement Confirmed',
      description: 'Added to "Indie Electronic Vibes" (89K followers)',
      metadata: { artist: 'Alex Storm', campaign: 'Thunder Road' }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 6 * 60 * 1000),
      agent: 'content-creation',
      platform: 'voice-echo',
      type: 'milestone',
      title: 'Content Suite Generated',
      description: 'Press release, social media pack, and email campaign completed',
      metadata: { artist: 'Maya Chen', campaign: 'Neon Dreams' }
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      agent: 'intel-research',
      platform: 'audio-intel',
      type: 'success',
      title: 'Contact Database Enhanced',
      description: 'Enriched 247 new contacts with strategic intelligence',
      metadata: { metric: 'contacts_enriched', value: 247 }
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      agent: 'cross-promotion',
      platform: 'cross-platform',
      type: 'sync',
      title: 'Cross-Platform Sync Complete',
      description: 'Campaign data synchronized between Audio Intel and Playlist Pulse',
      metadata: { campaign: 'Luna Rivers - Midnight Echoes', value: '100%' }
    },
    {
      id: '6',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      agent: 'campaign-planner',
      platform: 'cross-platform',
      type: 'milestone',
      title: 'Multi-Platform Strategy Complete',
      description: '8-week campaign spanning Audio Intel, Playlist Pulse, and Voice Echo',
      metadata: { artist: 'DJ Phoenix', campaign: 'Electric Nights' }
    }
  ]);

  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Simulate new activities from different platforms
      const newActivities = [
        {
          agent: 'intel-research' as const,
          platform: 'audio-intel' as const,
          type: 'success' as const,
          title: 'Strategic Insight Generated',
          description: 'Contact analysis reveals optimal outreach timing',
          metadata: { campaign: `Campaign ${Math.floor(Math.random() * 100)}`, metric: 'success_probability', value: `${Math.floor(Math.random() * 30) + 70}%` }
        },
        {
          agent: 'playlist-curator' as const,
          platform: 'playlist-pulse' as const,
          type: 'action' as const,
          title: 'Curator Outreach Optimized',
          description: 'Pitch customized for curator preferences',
          metadata: { artist: `Artist ${Math.floor(Math.random() * 100)}`, campaign: 'New Pitch' }
        },
        {
          agent: 'content-creation' as const,
          platform: 'voice-echo' as const,
          type: 'milestone' as const,
          title: 'Content Batch Completed',
          description: 'Generated content for 3 active campaigns',
          metadata: { value: 3, metric: 'content_batches' }
        },
        {
          agent: 'performance-monitor' as const,
          platform: 'cross-platform' as const,
          type: 'alert' as const,
          title: 'Performance Threshold Exceeded',
          description: 'Campaign metrics surpassing targets across platforms',
          metadata: { metric: 'performance_boost', value: `+${Math.floor(Math.random() * 50) + 25}%` }
        },
        {
          agent: 'cross-promotion' as const,
          platform: 'cross-platform' as const,
          type: 'sync' as const,
          title: 'Real-Time Data Sync',
          description: 'Live campaign data updated across all platforms',
          metadata: { value: `${Math.floor(Math.random() * 50) + 50} campaigns`, metric: 'sync_count' }
        },
        {
          agent: 'campaign-planner' as const,
          platform: 'cross-platform' as const,
          type: 'success' as const,
          title: 'Campaign Milestone Reached',
          description: 'Week 4 objectives achieved across all platforms',
          metadata: { campaign: `Multi-Platform Campaign ${Math.floor(Math.random() * 20)}`, metric: 'milestone_completion', value: '100%' }
        }
      ];

      if (Math.random() > 0.6) {
        const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          timestamp: new Date(),
          ...randomActivity
        };

        setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Keep only latest 20
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getAgentIcon = (agent: string) => {
    switch (agent) {
      case 'intel-research': return <Brain className="w-4 h-4" />;
      case 'campaign-planner': return <Target className="w-4 h-4" />;
      case 'content-creation': return <FileText className="w-4 h-4" />;
      case 'playlist-curator': return <Music className="w-4 h-4" />;
      case 'performance-monitor': return <TrendingUp className="w-4 h-4" />;
      case 'cross-promotion': return <Zap className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'audio-intel': return <Brain className="w-3 h-3" />;
      case 'playlist-pulse': return <Music className="w-3 h-3" />;
      case 'voice-echo': return <Mic className="w-3 h-3" />;
      case 'cross-platform': return <Zap className="w-3 h-3" />;
      default: return <Activity className="w-3 h-3" />;
    }
  };

  const getAgentColor = (agent: string) => {
    switch (agent) {
      case 'intel-research': return 'text-blue-400 bg-blue-400/10';
      case 'campaign-planner': return 'text-purple-400 bg-purple-400/10';
      case 'content-creation': return 'text-green-400 bg-green-400/10';
      case 'playlist-curator': return 'text-pink-400 bg-pink-400/10';
      case 'performance-monitor': return 'text-orange-400 bg-orange-400/10';
      case 'cross-promotion': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'milestone': return <Target className="w-4 h-4 text-purple-400" />;
      case 'action': return <Zap className="w-4 h-4 text-blue-400" />;
      case 'sync': return <Activity className="w-4 h-4 text-cyan-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isLive 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-gray-700 text-gray-400 border border-gray-600'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{isLive ? 'Live Feed' : 'Paused'}</span>
          </button>
          <span className="text-sm text-gray-400">
            {activities.length} ecosystem activities
          </span>
        </div>

        {/* Platform Status Indicators */}
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getPlatformColor('audio-intel')}`}>
            {getPlatformIcon('audio-intel')}
            <span>AI</span>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getPlatformColor('playlist-pulse')}`}>
            {getPlatformIcon('playlist-pulse')}
            <span>PP</span>
          </div>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getPlatformColor('voice-echo')}`}>
            {getPlatformIcon('voice-echo')}
            <span>VE</span>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="px-6 pb-4">
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex items-start space-x-3 p-4 rounded-lg bg-gray-900/50 border border-gray-700/50 transition-all duration-200 hover:border-gray-600 ${
                index === 0 && isLive ? 'animate-pulse border-yellow-500/30' : ''
              }`}
            >
              {/* Agent Badge */}
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getAgentColor(activity.agent)}`}>
                {getAgentIcon(activity.agent)}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(activity.type)}
                      <h4 className="text-sm font-medium text-white">{activity.title}</h4>
                      {/* Platform indicator */}
                      <div className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs ${getPlatformColor(activity.platform)}`}>
                        {getPlatformIcon(activity.platform)}
                        <span className="capitalize">{activity.platform.replace('-', ' ')}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
                    
                    {/* Metadata */}
                    {activity.metadata && (
                      <div className="mt-2 space-y-1">
                        {activity.metadata.campaign && (
                          <div className="flex items-center space-x-1 text-xs">
                            <Music className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-400">{activity.metadata.campaign}</span>
                          </div>
                        )}
                        {activity.metadata.artist && !activity.metadata.campaign && (
                          <div className="flex items-center space-x-1 text-xs">
                            <Users className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-400">{activity.metadata.artist}</span>
                          </div>
                        )}
                        {activity.metadata.metric && activity.metadata.value && (
                          <div className="text-xs text-yellow-400">
                            {activity.metadata.metric.replace('_', ' ')}: {activity.metadata.value}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center space-x-2 text-xs text-gray-500 ml-4">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimestamp(activity.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-6 text-center">
          <button className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors border border-gray-700 rounded-lg hover:border-gray-600">
            Load More Activities
          </button>
        </div>
      </div>

      {/* Ecosystem Activity Stats */}
      <div className="px-6 py-4 border-t border-gray-700 bg-gray-900/30">
        <div className="grid grid-cols-6 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-green-400">
              {activities.filter(a => a.type === 'success').length}
            </div>
            <div className="text-xs text-gray-400">Successes</div>
          </div>
          <div>
            <div className="text-lg font-bold text-purple-400">
              {activities.filter(a => a.type === 'milestone').length}
            </div>
            <div className="text-xs text-gray-400">Milestones</div>
          </div>
          <div>
            <div className="text-lg font-bold text-red-400">
              {activities.filter(a => a.type === 'alert').length}
            </div>
            <div className="text-xs text-gray-400">Alerts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-400">
              {activities.filter(a => a.type === 'action').length}
            </div>
            <div className="text-xs text-gray-400">Actions</div>
          </div>
          <div>
            <div className="text-lg font-bold text-cyan-400">
              {activities.filter(a => a.type === 'sync').length}
            </div>
            <div className="text-xs text-gray-400">Syncs</div>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-400">
              {activities.filter(a => a.platform === 'cross-platform').length}
            </div>
            <div className="text-xs text-gray-400">Cross-Platform</div>
          </div>
        </div>
      </div>
    </div>
  );
}