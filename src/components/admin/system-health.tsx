"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Server, 
  Database, 
  Zap, 
  Globe,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SystemMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
  icon: any;
}

interface SystemHealthProps {
  metrics: SystemMetric[];
  loading?: boolean;
}

export function SystemHealth({ metrics, loading = false }: SystemHealthProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-50';
      case 'warning': return 'text-orange-600 bg-orange-50';
      case 'critical': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return XCircle;
      default: return Activity;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const overallHealth = metrics.reduce((acc, metric) => acc + metric.value, 0) / metrics.length;
  const overallStatus = overallHealth >= 95 ? 'healthy' : overallHealth >= 80 ? 'warning' : 'critical';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          System Health
          <Badge className={cn("text-xs px-3 py-1", getStatusColor(overallStatus))}>
            {overallHealth.toFixed(1)}% Uptime
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Health */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Overall System Health</h4>
              <div className="flex items-center gap-2">
                {(() => {
                  const StatusIcon = getStatusIcon(overallStatus);
                  return <StatusIcon className={cn("w-4 h-4", overallStatus === 'healthy' ? 'text-green-600' : overallStatus === 'warning' ? 'text-orange-600' : 'text-red-600')} />;
                })()}
                <span className="text-sm font-medium">{overallHealth.toFixed(1)}%</span>
              </div>
            </div>
            <Progress value={overallHealth} className="h-3" />
          </div>

          {/* Individual Metrics */}
          <div className="space-y-4">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              const StatusIcon = getStatusIcon(metric.status);
              
              return (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{metric.name}</h4>
                      <div className="flex items-center gap-2">
                        <StatusIcon className={cn("w-4 h-4", metric.status === 'healthy' ? 'text-green-600' : metric.status === 'warning' ? 'text-orange-600' : 'text-red-600')} />
                        <span className="text-sm font-medium">{metric.value}%</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <Progress value={metric.value} className="h-2" />
                    </div>
                    
                    <p className="text-xs text-gray-500">{metric.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="pt-4 border-t">
            <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Restart Services
              </button>
              <button className="p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Clear Cache
              </button>
              <button className="p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                View Logs
              </button>
              <button className="p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                Run Diagnostics
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}