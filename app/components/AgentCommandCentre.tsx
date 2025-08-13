'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Settings, 
  Plus, 
  MessageCircle, 
  Cog, 
  Eye, 
  MoreHorizontal,
  ChevronRight,
  Bell,
  RefreshCw,
  Play,
  Pause,
  Square
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  category: 'main-orchestrator' | 'content-agents' | 'research-agents' | 'analytics-agents';
  status: 'active' | 'idle' | 'working';
  lastActivity: string;
  currentTask?: string;
  progress?: number;
}

const AgentCommandCentre: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'main-orchestrator',
      name: 'Main Orchestrator',
      category: 'main-orchestrator',
      status: 'active',
      lastActivity: '2 minutes ago',
      currentTask: 'Coordinating agent activities'
    },
    {
      id: 'content-creator',
      name: 'Content Creator Agent',
      category: 'content-agents',
      status: 'working',
      lastActivity: '1 minute ago',
      currentTask: 'Generating promotional content',
      progress: 75
    },
    {
      id: 'social-media',
      name: 'Social Media Agent',
      category: 'content-agents',
      status: 'idle',
      lastActivity: '15 minutes ago'
    },
    {
      id: 'market-researcher',
      name: 'Market Research Agent',
      category: 'research-agents',
      status: 'working',
      lastActivity: '5 minutes ago',
      currentTask: 'Analysing competitor strategies',
      progress: 45
    },
    {
      id: 'data-analyst',
      name: 'Data Analyst Agent',
      category: 'analytics-agents',
      status: 'active',
      lastActivity: '3 minutes ago',
      currentTask: 'Processing campaign metrics'
    },
    {
      id: 'trend-tracker',
      name: 'Trend Tracker Agent',
      category: 'analytics-agents',
      status: 'idle',
      lastActivity: '1 hour ago'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  const getCategoryColour = (category: string) => {
    switch (category) {
      case 'main-orchestrator': return 'border-blue-500';
      case 'content-agents': return 'border-purple-500';
      case 'research-agents': return 'border-green-500';
      case 'analytics-agents': return 'border-orange-500';
      default: return 'border-slate-600';
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'main-orchestrator': return 'Main Orchestrator';
      case 'content-agents': return 'Content Agents';
      case 'research-agents': return 'Research Agents';
      case 'analytics-agents': return 'Analytics Agents';
      default: return 'Unknown';
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'working':
        return <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>;
      case 'idle':
        return <div className="w-3 h-3 bg-slate-500 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-slate-500 rounded-full"></div>;
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedAgents = filteredAgents.reduce((groups, agent) => {
    if (!groups[agent.category]) {
      groups[agent.category] = [];
    }
    groups[agent.category].push(agent);
    return groups;
  }, {} as Record<string, Agent[]>);

  const handleAgentAction = (agentId: string, action: string) => {
    console.log(`${action} action for agent: ${agentId}`);
    // Implement actual agent actions here
  };

  const toggleAgentExpansion = (agentId: string) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Agent Command Centre</h1>
            <p className="text-sm text-slate-400">Total Audio Promo AI Workforce</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colours">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded-lg transition-colours">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Category Filter Tabs */}
      <div className="px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colours ${
              !selectedCategory 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            All Agents
          </button>
          {['main-orchestrator', 'content-agents', 'research-agents', 'analytics-agents'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colours ${
                selectedCategory === category 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {getCategoryName(category)}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 py-4 space-y-4">
        {Object.entries(groupedAgents).map(([category, categoryAgents]) => (
          <div key={category} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-200">
                {getCategoryName(category)}
              </h2>
              <button className="p-2 hover:bg-slate-800 rounded-lg transition-colours">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              {categoryAgents.map(agent => (
                <div
                  key={agent.id}
                  className={`bg-slate-800 border-l-4 ${getCategoryColour(category)} rounded-r-lg p-4 transition-all duration-200 ${
                    expandedAgent === agent.id ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                  }`}
                >
                  {/* Agent Row Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        {getStatusIndicator(agent.status)}
                        <span className="text-sm text-slate-400">{agent.status}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-100">{agent.name}</h3>
                        <p className="text-sm text-slate-400">{agent.lastActivity}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {agent.currentTask && (
                        <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded-full">
                          Working
                        </span>
                      )}
                      <button
                        onClick={() => toggleAgentExpansion(agent.id)}
                        className="p-1 hover:bg-slate-700 rounded transition-colours"
                      >
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            expandedAgent === agent.id ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Agent Details */}
                  {expandedAgent === agent.id && (
                    <div className="mt-4 pt-4 border-t border-slate-700 space-y-4">
                      {agent.currentTask && (
                        <div className="space-y-2">
                          <p className="text-sm text-slate-300">Current Task:</p>
                          <p className="text-sm text-slate-400 bg-slate-700 p-3 rounded-lg">
                            {agent.currentTask}
                          </p>
                          {agent.progress !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs text-slate-400">
                                <span>Progress</span>
                                <span>{agent.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${agent.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300">Quick Actions:</p>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleAgentAction(agent.id, 'chat')}
                            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colours text-sm"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Chat</span>
                          </button>
                          <button
                            onClick={() => handleAgentAction(agent.id, 'configure')}
                            className="flex items-center justify-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white p-2 rounded-lg transition-colours text-sm"
                          >
                            <Cog className="w-4 h-4" />
                            <span>Configure</span>
                          </button>
                          <button
                            onClick={() => handleAgentAction(agent.id, 'view')}
                            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colours text-sm"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>

                      {/* Control Actions */}
                      <div className="space-y-2">
                        <p className="text-sm text-slate-300">Controls:</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAgentAction(agent.id, 'start')}
                            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colours text-sm"
                          >
                            <Play className="w-4 h-4" />
                            <span>Start</span>
                          </button>
                          <button
                            onClick={() => handleAgentAction(agent.id, 'pause')}
                            className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg transition-colours text-sm"
                          >
                            <Pause className="w-4 h-4" />
                            <span>Pause</span>
                          </button>
                          <button
                            onClick={() => handleAgentAction(agent.id, 'stop')}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colours text-sm"
                          >
                            <Square className="w-4 h-4" />
                            <span>Stop</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 px-4 py-3">
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Quick find agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-700 text-slate-100 placeholder-slate-400 pl-10 pr-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Refresh Button */}
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colours">
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* Add New Agent */}
          <button className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colours">
            <Plus className="w-5 h-5" />
          </button>

          {/* More Options */}
          <button className="p-2 hover:bg-slate-700 rounded-lg transition-colours">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Spacing for Bottom Navigation */}
      <div className="h-20"></div>
    </div>
  );
};

export default AgentCommandCentre;
