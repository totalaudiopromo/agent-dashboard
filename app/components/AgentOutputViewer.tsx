'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Code, 
  Search, 
  BarChart3, 
  Target, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Copy, 
  Download, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Eye,
  Brain,
  Zap,
  Users,
  TrendingUp,
  Music
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface AgentOutput {
  id: string;
  agentName: string;
  agentRole: string;
  taskType: 'Content Creation' | 'Research' | 'Analysis' | 'Strategy' | 'Coordination' | 'Testing';
  inputSummary: string;
  outputPreview: string;
  fullOutput: string;
  timestamp: Date;
  status: 'Success' | 'Error' | 'In Progress';
  executionTime: number; // in seconds
  successMetrics: {
    accuracy?: number;
    relevance?: number;
    completeness?: number;
    timeSaved?: number;
  };
  generatedFiles?: Array<{
    name: string;
    type: 'text' | 'code' | 'image' | 'link';
    url?: string;
    content?: string;
  }>;
  errors?: string[];
  warnings?: string[];
}

// Helper functions for agent icons and styling

const getAgentIcon = (agentName: string) => {
  switch (agentName) {
    case 'REMIX': return <Music className="w-5 h-5" />;
    case 'SCOUT': return <Search className="w-5 h-5" />;
    case 'TEMPO': return <BarChart3 className="w-5 h-5" />;
    case 'PRODUCER': return <Target className="w-5 h-5" />;
    case 'SYNC': return <RefreshCw className="w-5 h-5" />;
    default: return <Brain className="w-5 h-5" />;
  }
};

const getTaskTypeIcon = (taskType: string) => {
  switch (taskType) {
    case 'Content Creation': return <FileText className="w-4 h-4" />;
    case 'Research': return <Search className="w-4 h-4" />;
    case 'Analysis': return <BarChart3 className="w-4 h-4" />;
    case 'Strategy': return <Target className="w-4 h-4" />;
    case 'Coordination': return <RefreshCw className="w-4 h-4" />;
    case 'Testing': return <Zap className="w-4 h-4" />;
    default: return <FileText className="w-4 h-4" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Success': return 'text-green-600 bg-green-100 border-green-200';
    case 'Error': return 'text-red-600 bg-red-100 border-red-200';
    case 'In Progress': return 'text-blue-600 bg-blue-100 border-blue-200';
    default: return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Success': return <CheckCircle2 className="w-4 h-4" />;
    case 'Error': return <AlertCircle className="w-4 h-4" />;
    case 'In Progress': return <Clock className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export default function AgentOutputViewer() {
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedTaskType, setSelectedTaskType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [agentOutputs, setAgentOutputs] = useState<AgentOutput[]>([]);

  const toggleCard = (id: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCards(newExpanded);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const fetchAgentOutputs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/agent-outputs');
      const data = await response.json();
      
      if (data.success) {
        setAgentOutputs(data.outputs);
      } else {
        console.error('Failed to fetch agent outputs:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch agent outputs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch outputs when component mounts
  useEffect(() => {
    fetchAgentOutputs();
  }, []);

  const filteredOutputs = agentOutputs.filter(output => {
    if (selectedAgent !== 'all' && output.agentName !== selectedAgent) return false;
    if (selectedTaskType !== 'all' && output.taskType !== selectedTaskType) return false;
    return true;
  });

  const uniqueAgents = [...new Set(agentOutputs.map(output => output.agentName))];
  const uniqueTaskTypes = [...new Set(agentOutputs.map(output => output.taskType))];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Agent Work Outputs</CardTitle>
              <p className="text-sm text-muted-foreground">Real-time feed of agent completions and deliverables</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAgentOutputs}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mt-4">
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-background"
          >
            <option value="all">All Agents</option>
            {uniqueAgents.map(agent => (
              <option key={agent} value={agent}>{agent}</option>
            ))}
          </select>
          
          <select
            value={selectedTaskType}
            onChange={(e) => setSelectedTaskType(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm bg-background"
          >
            <option value="all">All Task Types</option>
            {uniqueTaskTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredOutputs.map((output) => (
            <div key={output.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Card Header */}
              <div className="p-4 bg-muted/50 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      {getAgentIcon(output.agentName)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-lg">{output.agentName}</h3>
                        <span className="text-sm text-muted-foreground">({output.agentRole})</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {getTaskTypeIcon(output.taskType)}
                        <span>{output.taskType}</span>
                        <span>•</span>
                        <span>{output.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(output.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(output.status)}
                        <span>{output.status}</span>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCard(output.id)}
                      className="p-1"
                    >
                      {expandedCards.has(output.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4">
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Input Request</h4>
                    <p className="text-sm">{output.inputSummary}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Output Preview</h4>
                    <p className="text-sm">{output.outputPreview}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Execution time: {output.executionTime}s</span>
                    <span>Time saved: {output.successMetrics.timeSaved}s</span>
                  </div>
                </div>

                {/* Expandable Details */}
                {expandedCards.has(output.id) && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    {/* Full Output */}
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Complete Output</h4>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm font-mono">{output.fullOutput}</pre>
                      </div>
                    </div>

                    {/* Success Metrics */}
                    <div>
                      <h4 className="font-medium text-sm text-muted-foreground mb-2">Success Metrics</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {output.successMetrics.accuracy && (
                          <div className="text-center p-2 bg-green-50 rounded-md">
                            <div className="text-lg font-bold text-green-600">{output.successMetrics.accuracy}%</div>
                            <div className="text-xs text-green-600">Accuracy</div>
                          </div>
                        )}
                        {output.successMetrics.relevance && (
                          <div className="text-center p-2 bg-blue-50 rounded-md">
                            <div className="text-lg font-bold text-blue-600">{output.successMetrics.relevance}%</div>
                            <div className="text-xs text-blue-600">Relevance</div>
                          </div>
                        )}
                        {output.successMetrics.completeness && (
                          <div className="text-center p-2 bg-purple-50 rounded-md">
                            <div className="text-lg font-bold text-purple-600">{output.successMetrics.completeness}%</div>
                            <div className="text-xs text-purple-600">Completeness</div>
                          </div>
                        )}
                        {output.successMetrics.timeSaved && (
                          <div className="text-center p-2 bg-orange-50 rounded-md">
                            <div className="text-lg font-bold text-orange-600">{output.successMetrics.timeSaved}s</div>
                            <div className="text-xs text-orange-600">Time Saved</div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Generated Files */}
                    {output.generatedFiles && output.generatedFiles.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Generated Files</h4>
                        <div className="space-y-2">
                          {output.generatedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">{file.name}</span>
                                <span className="text-xs text-muted-foreground">({file.type})</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(file.content || '')}
                                  className="p-1 h-8 w-8"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="p-1 h-8 w-8"
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Errors and Warnings */}
                    {(output.errors && output.errors.length > 0) || (output.warnings && output.warnings.length > 0) ? (
                      <div className="space-y-2">
                        {output.errors && output.errors.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm text-red-600 mb-2">Errors</h4>
                            <div className="space-y-1">
                              {output.errors.map((error, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 bg-red-50 rounded-md">
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                  <span className="text-sm text-red-700">{error}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {output.warnings && output.warnings.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm text-yellow-600 mb-2">Warnings</h4>
                            <div className="space-y-1">
                              {output.warnings.map((warning, index) => (
                                <div key={index} className="flex items-center space-x-2 p-2 bg-yellow-50 rounded-md">
                                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                                  <span className="text-sm text-yellow-700">{warning}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Full
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Output
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        ID: {output.id}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOutputs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No agent outputs available yet.</p>
            <p className="text-sm">
              {agentOutputs.length === 0 
                ? "Connect your agent system to see real-time work outputs here. The component is ready to display actual agent completions, metrics, and deliverables."
                : "No outputs match your current filters. Try adjusting the criteria or check back later."
              }
            </p>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>Ready to display:</p>
              <ul className="mt-2 space-y-1">
                <li>• Agent task completions and outputs</li>
                <li>• Success metrics and performance data</li>
                <li>• Generated files and deliverables</li>
                <li>• Execution times and efficiency stats</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
