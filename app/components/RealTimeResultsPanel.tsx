'use client';

import React, { useState, useEffect } from 'react';
import { Download, Copy, Save, ExternalLink, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

interface AgentResult {
  id: string;
  taskId: string;
  agent: string;
  title: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'data' | 'analysis';
  files?: { name: string; url: string; type: string }[];
  downloadable: boolean;
  copyable: boolean;
  saveable: boolean;
  notionIntegration?: boolean;
}

interface RealTimeResultsPanelProps {
  results: AgentResult[];
  onDownload: (resultId: string) => void;
  onCopy: (content: string) => void;
  onSaveToProject: (resultId: string) => void;
  onSaveToNotion: (resultId: string) => void;
}

export default function RealTimeResultsPanel({
  results,
  onDownload,
  onCopy,
  onSaveToProject,
  onSaveToNotion
}: RealTimeResultsPanelProps) {
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedToNotion, setSavedToNotion] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (copiedId) {
      const timeout = setTimeout(() => setCopiedId(null), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copiedId]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'data':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'analysis':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getAgentColor = (agent: string) => {
    const colors: Record<string, string> = {
      'Intel Research Agent': 'bg-blue-50 text-blue-700 border-blue-200',
      'Content Creation Agent': 'bg-green-50 text-green-700 border-green-200',
      'Campaign Planner Agent': 'bg-purple-50 text-purple-700 border-purple-200',
      'Performance Monitor Agent': 'bg-orange-50 text-orange-700 border-orange-200',
      'Playlist Curator Agent': 'bg-pink-50 text-pink-700 border-pink-200',
      'Main Orchestrator': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[agent] || colors['Main Orchestrator'];
  };

  const handleCopy = async (content: string, resultId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(resultId);
      onCopy(content);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const handleSaveToNotion = async (resultId: string) => {
    try {
      await onSaveToNotion(resultId);
      setSavedToNotion(prev => new Set(prev).add(resultId));
    } catch (err) {
      console.error('Failed to save to Notion:', err);
    }
  };

  const formatContent = (content: string) => {
    // Convert markdown-style formatting to HTML-like display
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .split('\n')
      .map((line, index) => (
        <div key={index} dangerouslySetInnerHTML={{ __html: line || '<br />' }} />
      ));
  };

  const truncateContent = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-gray-700" />
            <span>Live Results</span>
          </div>
          <div className="text-sm text-gray-600">
            {results.length} results available
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No results yet</p>
              <p className="text-sm text-gray-400">Agent outputs will appear here as they complete</p>
            </div>
          ) : (
            results.map((result) => (
              <div key={result.id} className={`border rounded-lg overflow-hidden ${getAgentColor(result.agent)}`}>
                {/* Result Header */}
                <div className="p-4 border-b border-opacity-30">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getTypeIcon(result.type)}
                      <div>
                        <h4 className="font-medium text-sm">{result.title}</h4>
                        <div className="flex items-center space-x-2 text-xs mt-1">
                          <span>{result.agent}</span>
                          <span>•</span>
                          <span>{result.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-1">
                      {result.copyable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(result.content, result.id)}
                          className="p-1 h-auto"
                          title="Copy content"
                        >
                          {copiedId === result.id ? (
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                      
                      {result.downloadable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownload(result.id)}
                          className="p-1 h-auto"
                          title="Download files"
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {result.saveable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSaveToProject(result.id)}
                          className="p-1 h-auto"
                          title="Save to project"
                        >
                          <Save className="w-3 h-3" />
                        </Button>
                      )}
                      
                      {result.notionIntegration && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSaveToNotion(result.id)}
                          className="p-1 h-auto"
                          title="Save to Notion"
                        >
                          {savedToNotion.has(result.id) ? (
                            <CheckCircle2 className="w-3 h-3 text-green-600" />
                          ) : (
                            <ExternalLink className="w-3 h-3" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Result Content */}
                <div className="p-4">
                  <div 
                    className={`text-sm cursor-pointer ${
                      expandedResult === result.id ? '' : 'line-clamp-3'
                    }`}
                    onClick={() => setExpandedResult(
                      expandedResult === result.id ? null : result.id
                    )}
                  >
                    {expandedResult === result.id ? (
                      <div className="whitespace-pre-wrap">
                        {formatContent(result.content)}
                      </div>
                    ) : (
                      <div className="text-gray-700">
                        {truncateContent(result.content)}
                        {result.content.length > 200 && (
                          <span className="text-blue-600 hover:text-blue-800 ml-2 cursor-pointer">
                            Read more...
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Files */}
                  {result.files && result.files.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-opacity-30">
                      <p className="text-xs text-gray-600 mb-2">Generated Files:</p>
                      <div className="space-y-1">
                        {result.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <FileText className="w-3 h-3 text-gray-500" />
                              <span>{file.name}</span>
                              <span className="text-gray-500">({file.type})</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(file.url, '_blank')}
                              className="p-0 h-auto text-blue-600 hover:text-blue-800"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Integration Status */}
                  {savedToNotion.has(result.id) && (
                    <div className="mt-3 pt-3 border-t border-opacity-30">
                      <div className="flex items-center space-x-2 text-xs text-green-700">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Saved to Notion workspace</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Results Summary */}
        {results.length > 0 && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">{results.length}</div>
                <div className="text-xs text-gray-600">Total Results</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {results.filter(r => r.downloadable).length}
                </div>
                <div className="text-xs text-gray-600">Downloadable</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">
                  {savedToNotion.size}
                </div>
                <div className="text-xs text-gray-600">Saved to Notion</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}