'use client';

import React, { useState, useEffect } from 'react';
import { Brain, Music, Headphones, Users, TrendingUp, Target, Activity, Zap, BarChart3, DollarSign, Play, Pause, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface PlatformMetrics {
  audioIntel: {
    contactsAnalyzed: number;
    databaseHealth: 'excellent' | 'good' | 'warning' | 'critical';
    userActivity: number;
    successRate: number;
    recentEnrichments: number;
    strategicInsights: number;
  };
  playlistPulse: {
    activeCampaigns: number;
    curatorResponses: number;
    playlistPlacements: number;
    acceptanceRate: number;
    tracksPitched: number;
    responseTime: number;
  };
  totalAudioPromo: {
    mrr: number;
    customerGrowth: number;
    featureUsage: Record<string, number>;
    churnRate: number;
    revenueGrowth: number;
    platformAdoption: number;
  };
}

export default function PlatformSpecificDashboards() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<'audio-intel' | 'playlist-pulse' | 'total-audio-promo'>('audio-intel');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching platform-specific metrics
    const fetchMetrics = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockMetrics: PlatformMetrics = {
          audioIntel: {
            contactsAnalyzed: 47234,
            databaseHealth: 'excellent',
            userActivity: 156,
            successRate: 96.8,
            recentEnrichments: 247,
            strategicInsights: 8743
          },
          playlistPulse: {
            activeCampaigns: 23,
            curatorResponses: 81,
            playlistPlacements: 34,
            acceptanceRate: 34.7,
            tracksPitched: 156,
            responseTime: 2.3
          },
          totalAudioPromo: {
            mrr: 67200,
            customerGrowth: 12.4,
            featureUsage: {
              'Audio Intel': 78,
              'Playlist Pulse': 65,
              'Voice Echo': 42,
              'Cross Platform': 89
            },
            churnRate: 5.8,
            revenueGrowth: 18.7,
            platformAdoption: 73.2
          }
        };
        
        setMetrics(mockMetrics);
      } catch (error) {
        console.error('Failed to fetch platform metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'good': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'warning': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="w-4 h-4" />;
      case 'good': return <CheckCircle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      case 'critical': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading platform metrics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load platform metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Selection Tabs */}
      <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg">
        <button
          onClick={() => setSelectedPlatform('audio-intel')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPlatform === 'audio-intel'
              ? 'bg-blue-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Audio Intel</span>
        </button>
        
        <button
          onClick={() => setSelectedPlatform('playlist-pulse')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPlatform === 'playlist-pulse'
              ? 'bg-green-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Music className="w-4 h-4" />
          <span>Playlist Pulse</span>
        </button>
        
        <button
          onClick={() => setSelectedPlatform('total-audio-promo')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedPlatform === 'total-audio-promo'
              ? 'bg-purple-500 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Total Audio Promo</span>
        </button>
      </div>

      {/* Platform-Specific Dashboard */}
      {selectedPlatform === 'audio-intel' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Brain className="w-6 h-6 text-blue-400" />
              <span>Audio Intel Platform Dashboard</span>
            </h3>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm ${getHealthColor(metrics.audioIntel.databaseHealth)}`}>
              {getHealthIcon(metrics.audioIntel.databaseHealth)}
              <span className="capitalize font-medium">{metrics.audioIntel.databaseHealth}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Contacts Analyzed */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Contacts Analyzed</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {metrics.audioIntel.contactsAnalyzed.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  Total contacts in database
                </div>
                <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (metrics.audioIntel.contactsAnalyzed / 100000) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Target: 100K contacts
                </div>
              </CardContent>
            </Card>

            {/* Database Health */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-green-400" />
                  <span>Database Health</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {metrics.audioIntel.successRate}%
                </div>
                <div className="text-sm text-gray-400">
                  Data accuracy rate
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Uptime</span>
                    <span className="text-white font-medium">99.98%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Sync Status</span>
                    <span className="text-green-400 font-medium">✓ Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Enrichments Today</span>
                    <span className="text-sm text-white font-medium">{metrics.audioIntel.recentEnrichments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Insights Generated</span>
                    <span className="text-sm text-white font-medium">{metrics.audioIntel.strategicInsights.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Active Users</span>
                    <span className="text-sm text-white font-medium">{metrics.audioIntel.userActivity}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedPlatform === 'playlist-pulse' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Music className="w-6 h-6 text-green-400" />
              <span>Playlist Pulse Platform Dashboard</span>
            </h3>
            <div className="text-sm text-gray-400">
              Campaign performance & curator engagement
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Active Campaigns */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span>Active Campaigns</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {metrics.playlistPulse.activeCampaigns}
                </div>
                <div className="text-sm text-gray-400">
                  Currently running campaigns
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Tracks Pitched</span>
                    <span className="text-white font-medium">{metrics.playlistPulse.tracksPitched}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Response Time</span>
                    <span className="text-white font-medium">{metrics.playlistPulse.responseTime}s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Curator Engagement */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Curator Engagement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {metrics.playlistPulse.curatorResponses}
                </div>
                <div className="text-sm text-gray-400">
                  Curator responses received
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Acceptance Rate</span>
                    <span className="text-white font-medium">{metrics.playlistPulse.acceptanceRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Placements</span>
                    <span className="text-white font-medium">{metrics.playlistPulse.playlistPlacements}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-yellow-400" />
                  <span>Performance Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Success Rate</span>
                    <span className="text-sm text-green-400 font-medium">{metrics.playlistPulse.acceptanceRate}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${metrics.playlistPulse.acceptanceRate}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500">
                    Target: 40% acceptance rate
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {selectedPlatform === 'total-audio-promo' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Headphones className="w-6 h-6 text-purple-400" />
              <span>Total Audio Promo Platform Dashboard</span>
            </h3>
            <div className="text-sm text-gray-400">
              Overall business performance & growth
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Revenue Metrics */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span>Revenue Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {formatCurrency(metrics.totalAudioPromo.mrr)}
                </div>
                <div className="text-sm text-gray-400">
                  Monthly Recurring Revenue
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Growth</span>
                    <span className="text-green-400 font-medium">+{metrics.totalAudioPromo.revenueGrowth}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Churn Rate</span>
                    <span className="text-red-400 font-medium">{metrics.totalAudioPromo.churnRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Metrics */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span>Customer Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  +{metrics.totalAudioPromo.customerGrowth}%
                </div>
                <div className="text-sm text-gray-400">
                  Customer growth rate
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Platform Adoption</span>
                    <span className="text-white font-medium">{metrics.totalAudioPromo.platformAdoption}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${metrics.totalAudioPromo.platformAdoption}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Usage */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-sm flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span>Feature Usage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(metrics.totalAudioPromo.featureUsage).map(([feature, usage]) => (
                    <div key={feature} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{feature}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${usage}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-white font-medium">{usage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Cross-Platform Summary */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Cross-Platform Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(metrics.totalAudioPromo.mrr)}
              </div>
              <div className="text-sm text-gray-400">Total MRR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {metrics.audioIntel.contactsAnalyzed.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Contacts Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {metrics.playlistPulse.playlistPlacements}
              </div>
              <div className="text-sm text-gray-400">Playlist Placements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {metrics.totalAudioPromo.platformAdoption}%
              </div>
              <div className="text-sm text-gray-400">Platform Adoption</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
