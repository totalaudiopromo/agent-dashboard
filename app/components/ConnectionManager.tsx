'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Database, GitBranch, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import StripeService from '../services/stripeService';
import DatabaseService from '../services/databaseService';
import GitService from '../services/gitService';

interface ConnectionStatus {
  connected: boolean;
  message: string;
  testing: boolean;
}

interface ConnectionManagerProps {
  onConnectionChange?: (service: string, status: ConnectionStatus) => void;
}

export default function ConnectionManager({ onConnectionChange }: ConnectionManagerProps) {
  const [connections, setConnections] = useState<Record<string, ConnectionStatus>>({
    stripe: { connected: false, message: 'Not connected', testing: false },
    database: { connected: false, message: 'Not connected', testing: false },
    git: { connected: false, message: 'Not connected', testing: false }
  });

  const stripeService = StripeService.getInstance();
  const databaseService = DatabaseService.getInstance();
  const gitService = GitService.getInstance();

  // Test Stripe connection
  const testStripeConnection = async () => {
    setConnections(prev => ({
      ...prev,
      stripe: { ...prev.stripe, testing: true }
    }));

    try {
      const result = await stripeService.testConnection();
      const newStatus: ConnectionStatus = {
        connected: result.connected,
        message: result.message,
        testing: false
      };

      setConnections(prev => ({
        ...prev,
        stripe: newStatus
      }));

      onConnectionChange?.('stripe', newStatus);
    } catch (error) {
      const newStatus: ConnectionStatus = {
        connected: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        testing: false
      };

      setConnections(prev => ({
        ...prev,
        stripe: newStatus
      }));

      onConnectionChange?.('stripe', newStatus);
    }
  };

  // Test Database connection
  const testDatabaseConnection = async () => {
    setConnections(prev => ({
      ...prev,
      database: { ...prev.database, testing: true }
    }));

    try {
      const result = await databaseService.testConnection();
      const newStatus: ConnectionStatus = {
        connected: result.connected,
        message: result.message,
        testing: false
      };

      setConnections(prev => ({
        ...prev,
        database: newStatus
      }));

      onConnectionChange?.('database', newStatus);
    } catch (error) {
      const newStatus: ConnectionStatus = {
        connected: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        testing: false
      };

      setConnections(prev => ({
        ...prev,
        database: newStatus
      }));

      onConnectionChange?.('database', newStatus);
    }
  };

  // Test Git connection
  const testGitConnection = async () => {
    setConnections(prev => ({
      ...prev,
      git: { ...prev.git, testing: true }
    }));

    try {
      const result = await gitService.testConnection();
      const newStatus: ConnectionStatus = {
        connected: result.connected,
        message: result.message,
        testing: false
      };

      setConnections(prev => ({
        ...prev,
        git: newStatus
      }));

      onConnectionChange?.('git', newStatus);
    } catch (error) {
      const newStatus: ConnectionStatus = {
        connected: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        testing: false
      };

      setConnections(prev => ({
        ...prev,
        git: newStatus
      }));

      onConnectionChange?.('git', newStatus);
    }
  };

  // Test all connections
  const testAllConnections = async () => {
    await Promise.all([
      testStripeConnection(),
      testDatabaseConnection(),
      testGitConnection()
    ]);
  };

  // Get connection status icon
  const getConnectionIcon = (status: ConnectionStatus) => {
    if (status.testing) {
      return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
    }
    
    if (status.connected) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  // Get connection status colour
  const getConnectionColour = (status: ConnectionStatus) => {
    if (status.testing) {
      return 'border-blue-200 bg-blue-50';
    }
    
    if (status.connected) {
      return 'border-green-200 bg-green-50';
    }
    
    return 'border-red-200 bg-red-50';
  };

  // Get connection status text colour
  const getConnectionTextColour = (status: ConnectionStatus) => {
    if (status.testing) {
      return 'text-blue-700';
    }
    
    if (status.connected) {
      return 'text-green-700';
    }
    
    return 'text-red-700';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">System Connections</h2>
        <Button
          onClick={testAllConnections}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <Loader2 className="w-4 h-4" />
          <span>Test All Connections</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stripe Connection */}
        <Card className={`border-2 ${getConnectionColour(connections.stripe)}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-gray-700" />
                <span>Stripe Integration</span>
              </div>
              {getConnectionIcon(connections.stripe)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className={`text-sm ${getConnectionTextColour(connections.stripe)}`}>
                {connections.stripe.message}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">MRR Tracking</span>
                <span className={`text-xs font-medium ${
                  connections.stripe.connected ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {connections.stripe.connected ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Subscription Management</span>
                <span className={`text-xs font-medium ${
                  connections.stripe.connected ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {connections.stripe.connected ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <Button
                onClick={testStripeConnection}
                disabled={connections.stripe.testing}
                variant={connections.stripe.connected ? "outline" : "default"}
                size="sm"
                className="w-full"
              >
                {connections.stripe.testing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : connections.stripe.connected ? (
                  'Reconnect Stripe'
                ) : (
                  'Connect Stripe'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database Connection */}
        <Card className={`border-2 ${getConnectionColour(connections.database)}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-gray-700" />
                <span>Customer Database</span>
              </div>
              {getConnectionIcon(connections.database)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className={`text-sm ${getConnectionTextColour(connections.database)}`}>
                {connections.database.message}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Customer Analytics</span>
                <span className={`text-xs font-medium ${
                  connections.database.connected ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {connections.database.connected ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Campaign Tracking</span>
                <span className={`text-xs font-medium ${
                  connections.database.connected ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {connections.database.connected ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <Button
                onClick={testDatabaseConnection}
                disabled={connections.database.testing}
                variant={connections.database.connected ? "outline" : "default"}
                size="sm"
                className="w-full"
              >
                {connections.database.testing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : connections.database.connected ? (
                  'Reconnect Database'
                ) : (
                  'Connect Database'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Git Connection */}
        <Card className={`border-2 ${getConnectionColour(connections.git)}`}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center space-x-2">
                <GitBranch className="w-5 h-5 text-gray-700" />
                <span>Git Repository</span>
              </div>
              {getConnectionIcon(connections.git)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className={`text-sm ${getConnectionTextColour(connections.git)}`}>
                {connections.git.message}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Development Velocity</span>
                <span className={`text-xs font-medium ${
                  connections.git.connected ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {connections.git.connected ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Commit Tracking</span>
                <span className={`text-xs font-medium ${
                  connections.git.connected ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {connections.git.connected ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <Button
                onClick={testGitConnection}
                disabled={connections.git.testing}
                variant={connections.git.connected ? "outline" : "default"}
                size="sm"
                className="w-full"
              >
                {connections.git.testing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : connections.git.connected ? (
                  'Reconnect Git'
                ) : (
                  'Connect Git'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Connection Status Summary */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">
                  {Object.values(connections).filter(c => c.connected).length} Connected
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-gray-600">
                  {Object.values(connections).filter(c => !c.connected).length} Disconnected
                </span>
              </div>
            </div>
            
            <div className="text-sm text-gray-500">
              Last tested: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
