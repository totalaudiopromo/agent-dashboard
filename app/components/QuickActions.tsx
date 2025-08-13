'use client';

import React, { useState } from 'react';
import { MessageSquare, Settings, Download, BarChart3, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import ClaudeCodeService from '../services/claudeCodeService';

interface QuickActionsProps {
  onActionTriggered?: (action: string, result: any) => void;
}

export default function QuickActions({ onActionTriggered }: QuickActionsProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});
  const [actionResults, setActionResults] = useState<Record<string, any>>({});

  const claudeCodeService = ClaudeCodeService.getInstance();

  // Chat with Best Agent
  const handleChatWithBestAgent = async () => {
    setLoadingActions(prev => ({ ...prev, chat: true }));
    
    try {
      // Get the best performing agent
      const agents = await claudeCodeService.getAllAgents();
      const bestAgent = agents.reduce((best, current) => 
        current.performance.success_rate > best.performance.success_rate ? current : best
      );

      const result = {
        action: 'Chat with Best Agent',
        agent: bestAgent,
        message: `Connected to ${bestAgent.name} - Success Rate: ${bestAgent.performance.success_rate}%`,
        timestamp: new Date()
      };

      setActionResults(prev => ({ ...prev, chat: result }));
      onActionTriggered?.('chat', result);

      // Simulate opening chat interface
      setTimeout(() => {
        window.open(`/chat/${bestAgent.id}`, '_blank');
      }, 1000);

    } catch (error) {
      const result = {
        action: 'Chat with Best Agent',
        error: 'Failed to connect to agent',
        timestamp: new Date()
      };
      setActionResults(prev => ({ ...prev, chat: result }));
      onActionTriggered?.('chat', result);
    } finally {
      setLoadingActions(prev => ({ ...prev, chat: false }));
    }
  };

  // Manage All Agents
  const handleManageAllAgents = async () => {
    setLoadingActions(prev => ({ ...prev, manage: true }));
    
    try {
      const agents = await claudeCodeService.getAllAgents();
      const systemMetrics = await claudeCodeService.getSystemMetrics();

      const result = {
        action: 'Manage All Agents',
        agents,
        systemMetrics,
        message: `Managing ${agents.length} agents - Overall Success Rate: ${systemMetrics.overall_success_rate}%`,
        timestamp: new Date()
      };

      setActionResults(prev => ({ ...prev, manage: result }));
      onActionTriggered?.('manage', result);

      // Simulate opening agent management interface
      setTimeout(() => {
        window.open('/agent-management', '_blank');
      }, 1000);

    } catch (error) {
      const result = {
        action: 'Manage All Agents',
        error: 'Failed to load agent management',
        timestamp: new Date()
      };
      setActionResults(prev => ({ ...prev, manage: result }));
      onActionTriggered?.('manage', result);
    } finally {
      setLoadingActions(prev => ({ ...prev, manage: false }));
    }
  };

  // Export Performance Report
  const handleExportReport = async () => {
    setLoadingActions(prev => ({ ...prev, export: true }));
    
    try {
      const agents = await claudeCodeService.getAllAgents();
      const systemMetrics = await claudeCodeService.getSystemMetrics();

      // Generate report data
      const reportData = {
        title: 'Total Audio Promo Agent Performance Report',
        generated: new Date().toISOString(),
        summary: {
          totalAgents: systemMetrics.total_agents,
          activeAgents: systemMetrics.active_agents,
          overallSuccessRate: systemMetrics.overall_success_rate,
          totalTasksCompleted: systemMetrics.total_tasks_completed,
          averageResponseTime: systemMetrics.average_response_time,
          systemUptime: systemMetrics.system_uptime
        },
        agents: agents.map(agent => ({
          name: agent.name,
          status: agent.status,
          performance: agent.performance,
          lastActivity: agent.last_activity,
          currentTask: agent.current_task
        })),
        recommendations: [
          'Continue monitoring Intel Research Agent for optimal performance',
          'Consider scaling Campaign Planner Agent based on demand',
          'Maintain high uptime standards across all agents',
          'Focus on reducing response times for Content Creation Agent'
        ]
      };

      const result = {
        action: 'Export Performance Report',
        reportData,
        message: 'Performance report generated successfully',
        timestamp: new Date()
      };

      setActionResults(prev => ({ ...prev, export: result }));
      onActionTriggered?.('export', result);

      // Simulate PDF download
      setTimeout(() => {
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `agent-performance-report-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1500);

    } catch (error) {
      const result = {
        action: 'Export Performance Report',
        error: 'Failed to generate performance report',
        timestamp: new Date()
      };
      setActionResults(prev => ({ ...prev, export: result }));
      onActionTriggered?.('export', result);
    } finally {
      setLoadingActions(prev => ({ ...prev, export: false }));
    }
  };

  // View Analytics
  const handleViewAnalytics = async () => {
    setLoadingActions(prev => ({ ...prev, analytics: true }));
    
    try {
      const agents = await claudeCodeService.getAllAgents();
      const systemMetrics = await claudeCodeService.getSystemMetrics();

      const analyticsData = {
        agentPerformance: agents.map(agent => ({
          name: agent.name,
          successRate: agent.performance.success_rate,
          tasksCompleted: agent.performance.tasks_completed,
          responseTime: agent.performance.avg_response_time,
          uptime: agent.performance.uptime
        })),
        systemHealth: {
          overallSuccessRate: systemMetrics.overall_success_rate,
          totalTasksCompleted: systemMetrics.total_tasks_completed,
          averageResponseTime: systemMetrics.average_response_time,
          systemUptime: systemMetrics.system_uptime,
          agentHealth: systemMetrics.agent_health
        },
        trends: {
          performanceImprovement: '12.4% improvement in overall success rate',
          efficiencyGains: '23.7% reduction in average response time',
          reliability: '99.98% system uptime maintained'
        }
      };

      const result = {
        action: 'View Analytics',
        analyticsData,
        message: 'Analytics dashboard loaded successfully',
        timestamp: new Date()
      };

      setActionResults(prev => ({ ...prev, analytics: result }));
      onActionTriggered?.('analytics', result);

      // Simulate opening analytics dashboard
      setTimeout(() => {
        window.open('/analytics', '_blank');
      }, 1000);

    } catch (error) {
      const result = {
        action: 'View Analytics',
        error: 'Failed to load analytics dashboard',
        timestamp: new Date()
      };
      setActionResults(prev => ({ ...prev, analytics: result }));
      onActionTriggered?.('analytics', result);
    } finally {
      setLoadingActions(prev => ({ ...prev, analytics: false }));
    }
  };

  // Get action result display
  const getActionResult = (action: string) => {
    const result = actionResults[action];
    if (!result) return null;

    if (result.error) {
      return (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          ❌ {result.error}
        </div>
      );
    }

    return (
      <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
        ✅ {result.message}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="text-sm text-gray-500">
          Last action: {Object.keys(actionResults).length > 0 ? 
            new Date(Math.max(...Object.values(actionResults).map(r => r.timestamp.getTime()))).toLocaleTimeString() : 
            'None yet'
          }
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chat with Best Agent */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Chat with Best Agent</h3>
              <p className="text-xs text-gray-600">Connect to highest-performing agent</p>
              
              <Button
                onClick={handleChatWithBestAgent}
                disabled={loadingActions.chat}
                className="w-full"
                size="sm"
              >
                {loadingActions.chat ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Start Chat
                  </>
                )}
              </Button>

              {getActionResult('chat')}
            </div>
          </CardContent>
        </Card>

        {/* Manage All Agents */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
                <Settings className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Manage All Agents</h3>
              <p className="text-xs text-gray-600">Configure and monitor agents</p>
              
              <Button
                onClick={handleManageAllAgents}
                disabled={loadingActions.manage}
                className="w-full"
                size="sm"
                variant="outline"
              >
                {loadingActions.manage ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Manage
                  </>
                )}
              </Button>

              {getActionResult('manage')}
            </div>
          </CardContent>
        </Card>

        {/* Export Performance Report */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto">
                <Download className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Export Report</h3>
              <p className="text-xs text-gray-600">Generate performance PDF</p>
              
              <Button
                onClick={handleExportReport}
                disabled={loadingActions.export}
                className="w-full"
                size="sm"
                variant="outline"
              >
                {loadingActions.export ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </>
                )}
              </Button>

              {getActionResult('export')}
            </div>
          </CardContent>
        </Card>

        {/* View Analytics */}
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="text-center space-y-3">
              <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900">View Analytics</h3>
              <p className="text-xs text-gray-600">Detailed performance insights</p>
              
              <Button
                onClick={handleViewAnalytics}
                disabled={loadingActions.analytics}
                className="w-full"
                size="sm"
                variant="outline"
              >
                {loadingActions.analytics ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View
                  </>
                )}
              </Button>

              {getActionResult('analytics')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Summary */}
      {Object.keys(actionResults).length > 0 && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">
                    {Object.values(actionResults).filter(r => !r.error).length} Actions Completed
                  </span>
                </div>
                {Object.values(actionResults).filter(r => r.error).length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-600">
                      {Object.values(actionResults).filter(r => r.error).length} Failed
                    </span>
                  </div>
                )}
              </div>
              
              <Button
                onClick={() => setActionResults({})}
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-700"
              >
                Clear Results
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
