import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Search, 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Calendar,
  Activity,
  Eye,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { adminService } from '@/lib/adminServices';

interface UserProfile {
  uid: string;
  email: string;
  role: string;
  theme: string;
  favorites: string[];
  createdAt: any;
  displayName?: string;
  lastLogin?: any;
  isActive?: boolean;
}

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, roleFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersQuery = query(
        collection(db, 'user_profiles'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(usersQuery);
      const userProfiles = querySnapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as UserProfile[];
      
      setUsers(userProfiles);
      
      if (user) {
        await adminService.logAdminAction(
          user.uid,
          user.email || 'Unknown',
          'Loaded user management data',
          { userCount: userProfiles.length }
        );
      }
    } catch (error) {
      toast.error('Failed to load users');
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(term) ||
        user.displayName?.toLowerCase().includes(term) ||
        user.uid.toLowerCase().includes(term)
      );
    }

    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const activeUsers = users.filter(u => u.isActive !== false).length;
    const recentUsers = users.filter(u => {
      if (!u.createdAt) return false;
      const createdDate = u.createdAt.toDate ? u.createdAt.toDate() : new Date(u.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return createdDate > weekAgo;
    }).length;

    return { totalUsers, adminUsers, activeUsers, recentUsers };
  };

  const stats = getUserStats();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'user':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage system users and permissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadUsers} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">Total Users</p>
              </div>
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">Active Users</p>
              </div>
              <Activity className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.adminUsers}</div>
                <p className="text-xs text-muted-foreground">Admin Users</p>
              </div>
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.recentUsers}</div>
                <p className="text-xs text-muted-foreground">New This Week</p>
              </div>
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Search by email, name, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>System users and their information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Favorites</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((userProfile) => (
                  <TableRow key={userProfile.uid}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{userProfile.displayName || 'No name'}</div>
                        <div className="text-sm text-muted-foreground">{userProfile.email}</div>
                        <div className="text-xs text-muted-foreground">{userProfile.uid.slice(0, 8)}...</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(userProfile.role)}>
                        {userProfile.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={userProfile.isActive !== false ? "default" : "secondary"}>
                        {userProfile.isActive !== false ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{userProfile.favorites?.length || 0}</span>
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDate(userProfile.createdAt)}
                    </TableCell>
                    <TableCell className="text-xs">
                      {formatDate(userProfile.lastLogin)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedUser(userProfile)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
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

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto m-4">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                User Details
                <Button variant="ghost" onClick={() => setSelectedUser(null)}>×</Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-sm">{selectedUser.email}</p>
                </div>
                <div>
                  <h4 className="font-medium">Role</h4>
                  <Badge className={getRoleBadgeColor(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">User ID</h4>
                  <p className="text-sm font-mono">{selectedUser.uid}</p>
                </div>
                <div>
                  <h4 className="font-medium">Theme</h4>
                  <p className="text-sm capitalize">{selectedUser.theme || 'System'}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Favorites ({selectedUser.favorites?.length || 0})</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedUser.favorites?.length > 0 
                    ? `User has ${selectedUser.favorites.length} favorite cars`
                    : 'No favorite cars'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Created</h4>
                  <p className="text-sm">{formatDate(selectedUser.createdAt)}</p>
                </div>
                <div>
                  <h4 className="font-medium">Last Login</h4>
                  <p className="text-sm">{formatDate(selectedUser.lastLogin)}</p>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit User
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserManagement;