'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Play, CheckCircle2, XCircle, Trash2, Edit3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

export interface Task {
  id: string;
  type: string;
  description: string;
  status: 'queued' | 'in-progress' | 'complete' | 'cancelled' | 'error';
  timestamp: Date;
  estimatedDuration: number;
  actualDuration?: number;
  agent: string;
  priority: 'low' | 'medium' | 'high';
  progress?: number;
  result?: string;
}

interface TaskQueueVisualizationProps {
  tasks: Task[];
  onTaskCancel: (taskId: string) => void;
  onTaskModify: (taskId: string, newDescription: string) => void;
}

export default function TaskQueueVisualization({ 
  tasks, 
  onTaskCancel, 
  onTaskModify 
}: TaskQueueVisualizationProps) {
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editDescription, setEditDescription] = useState('');

  // Simulate task progress
  useEffect(() => {
    const interval = setInterval(() => {
      // This would normally be handled by real task updates
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'queued':
        return <Clock className="w-4 h-4 text-gray-400" />;
      case 'in-progress':
        return <Play className="w-4 h-4 text-blue-500" />;
      case 'complete':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'cancelled':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'complete':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled':
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${minutes} min`;
    return `${Math.round(minutes / 60)} hr`;
  };

  const getEstimatedCompletion = (task: Task) => {
    if (task.status === 'complete') return 'Completed';
    if (task.status === 'cancelled' || task.status === 'error') return 'Cancelled';
    
    const now = new Date();
    const elapsed = (now.getTime() - task.timestamp.getTime()) / (1000 * 60);
    const remaining = Math.max(0, task.estimatedDuration - elapsed);
    
    if (task.status === 'in-progress') {
      return remaining > 0 ? `${formatDuration(remaining)} remaining` : 'Finishing up...';
    }
    
    return `${formatDuration(task.estimatedDuration)} estimated`;
  };

  const handleEdit = (taskId: string, currentDescription: string) => {
    setEditingTask(taskId);
    setEditDescription(currentDescription);
  };

  const handleSaveEdit = (taskId: string) => {
    onTaskModify(taskId, editDescription);
    setEditingTask(null);
    setEditDescription('');
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditDescription('');
  };

  const activeTasks = tasks.filter(t => ['queued', 'in-progress'].includes(t.status));
  const completedTasks = tasks.filter(t => ['complete', 'cancelled', 'error'].includes(t.status));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Play className="w-5 h-5 text-gray-700" />
            <span>Live Task Queue</span>
          </div>
          <div className="text-sm text-gray-600">
            {activeTasks.length} active • {completedTasks.length} completed
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Active Tasks */}
          {activeTasks.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Active Tasks</h4>
              <div className="space-y-3">
                {activeTasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`border rounded-lg p-4 ${getStatusColor(task.status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getStatusIcon(task.status)}
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{task.agent}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          
                          {editingTask === task.id ? (
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                              />
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(task.id)}
                                  className="px-2 py-1 h-auto text-xs"
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={handleCancelEdit}
                                  className="px-2 py-1 h-auto text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm text-gray-700 mb-2">{task.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600">
                                  {getEstimatedCompletion(task)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Started {task.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                              
                              {/* Progress bar for in-progress tasks */}
                              {task.status === 'in-progress' && (
                                <div className="mt-2">
                                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                                    <div 
                                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                      style={{ 
                                        width: `${task.progress || Math.min(95, ((Date.now() - task.timestamp.getTime()) / (task.estimatedDuration * 60 * 1000)) * 100)}%` 
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      
                      {task.status === 'queued' && (
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(task.id, task.description)}
                            className="p-1 h-auto"
                          >
                            <Edit3 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onTaskCancel(task.id)}
                            className="p-1 h-auto text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Tasks (Recent) */}
          {completedTasks.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recently Completed</h4>
              <div className="space-y-2">
                {completedTasks.slice(-3).reverse().map((task) => (
                  <div 
                    key={task.id} 
                    className={`border rounded-lg p-3 ${getStatusColor(task.status)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(task.status)}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-sm">{task.agent}</span>
                            <span className="text-xs text-gray-600">
                              • {task.actualDuration ? formatDuration(task.actualDuration) : 'Instant'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 truncate max-w-xs">
                            {task.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {task.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {task.result && task.status === 'complete' && (
                      <div className="mt-2 p-2 bg-white bg-opacity-50 rounded text-xs text-gray-700">
                        <strong>Result:</strong> {task.result.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {activeTasks.length === 0 && completedTasks.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tasks in queue</p>
              <p className="text-sm text-gray-400">Start by asking the Agent Army to help with something</p>
            </div>
          )}

          {/* Queue Statistics */}
          {(activeTasks.length > 0 || completedTasks.length > 0) && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-900">{activeTasks.length}</div>
                  <div className="text-xs text-gray-600">In Queue</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {completedTasks.filter(t => t.status === 'complete').length}
                  </div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    {activeTasks.length > 0 
                      ? formatDuration(Math.max(...activeTasks.map(t => t.estimatedDuration)))
                      : '0 min'
                    }
                  </div>
                  <div className="text-xs text-gray-600">Longest Wait</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}