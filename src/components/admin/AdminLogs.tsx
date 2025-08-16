import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  User, 
  Activity, 
  Brain, 
  BarChart3,
  MapPin,
  Monitor,
  Globe,
  RefreshCw
} from 'lucide-react';
import { adminService, type AdminLog } from '@/lib/adminServices';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const AdminLogs: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, typeFilter]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const adminLogs = await adminService.getAdminLogs(100);
      setLogs(adminLogs);
    } catch (error) {
      toast.error('Failed to load logs');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...logs];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(term) ||
        log.adminEmail.toLowerCase().includes(term) ||
        log.type.toLowerCase().includes(term)
      );
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(log => log.type === typeFilter);
    }

    setFilteredLogs(filtered);
  };

  const handleDeleteLog = async (logId: string) => {
    if (!user || !window.confirm('Are you sure you want to delete this log?')) return;

    try {
      await adminService.deleteLog(logId);
      setLogs(logs.filter(log => log.id !== logId));
      toast.success('Log deleted successfully');
      
      // Log this action
      await adminService.logAdminAction(
        user.uid,
        user.email || 'Unknown',
        'Deleted admin log',
        { deletedLogId: logId }
      );
    } catch (error) {
      toast.error('Failed to delete log');
    }
  };

  const handleClearOldLogs = async () => {
    if (!user || !window.confirm('This will delete all logs older than 90 days. Continue?')) return;

    try {
      const deletedCount = await adminService.clearOldLogs(90);
      toast.success(`Deleted ${deletedCount} old logs`);
      loadLogs(); // Refresh the list
      
      // Log this action
      await adminService.logAdminAction(
        user.uid,
        user.email || 'Unknown',
        'Cleared old logs',
        { deletedCount, daysOld: 90 }
      );
    } catch (error) {
      toast.error('Failed to clear old logs');
    }
  };

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Type', 'Admin', 'Message', 'Device', 'Location'].join(','),
      ...filteredLogs.map(log => [
        log.timestamp?.toDate?.()?.toISOString() || 'N/A',
        log.type,
        log.adminEmail,
        `"${log.message.replace(/"/g, '""')}"`,
        log.metadata?.device || 'N/A',
        log.metadata?.location || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'market_analysis':
        return <Brain className="w-4 h-4 text-purple-500" />;
      case 'inventory_review':
        return <BarChart3 className="w-4 h-4 text-green-500" />;
      case 'action':
        return <Activity className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLogBadgeColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'market_analysis':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'inventory_review':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'action':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Admin Activity Logs</h2>
          <p className="text-muted-foreground">Monitor system activities and admin actions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadLogs} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={handleClearOldLogs}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Old
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="all">All Types</option>
              <option value="login">Login</option>
              <option value="market_analysis">Market Analysis</option>
              <option value="inventory_review">Inventory Review</option>
              <option value="action">Actions</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Logs ({filteredLogs.length})</CardTitle>
          <CardDescription>Recent admin activities and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Device Info</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLogIcon(log.type)}
                        <Badge className={getLogBadgeColor(log.type)}>
                          {log.type.replace('_', ' ')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.adminEmail}</div>
                        <div className="text-xs text-muted-foreground">{log.adminId.slice(0, 8)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">{log.message}</div>
                    </TableCell>
                    <TableCell>
                      {log.metadata && (
                        <div className="text-xs space-y-1">
                          {log.metadata.device && (
                            <div className="flex items-center gap-1">
                              <Monitor className="w-3 h-3" />
                              {log.metadata.device}
                            </div>
                          )}
                          {log.metadata.browser && (
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {log.metadata.browser}
                            </div>
                          )}
                          {log.metadata.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate max-w-24">{log.metadata.location}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {log.timestamp?.toDate?.()?.toLocaleString() || 'N/A'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedLog(log)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteLog(log.id!)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Log Details
                <Button variant="ghost" onClick={() => setSelectedLog(null)}>×</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Type</h4>
                  <Badge className={getLogBadgeColor(selectedLog.type)}>
                    {selectedLog.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium">Timestamp</h4>
                  <p className="text-sm">{selectedLog.timestamp?.toDate?.()?.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Admin</h4>
                <p className="text-sm">{selectedLog.adminEmail}</p>
                <p className="text-xs text-muted-foreground">{selectedLog.adminId}</p>
              </div>
              
              <div>
                <h4 className="font-medium">Message</h4>
                <p className="text-sm">{selectedLog.message}</p>
              </div>
              
              {selectedLog.metadata && (
                <div>
                  <h4 className="font-medium">Device Information</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Device:</strong> {selectedLog.metadata.device}</p>
                    <p><strong>Browser:</strong> {selectedLog.metadata.browser}</p>
                    <p><strong>Platform:</strong> {selectedLog.metadata.platform}</p>
                    <p><strong>Location:</strong> {selectedLog.metadata.location}</p>
                    <p><strong>User Agent:</strong> <span className="text-xs break-all">{selectedLog.metadata.userAgent}</span></p>
                  </div>
                </div>
              )}
              
              {selectedLog.data && (
                <div>
                  <h4 className="font-medium">Additional Data</h4>
                  <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                    {JSON.stringify(selectedLog.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;