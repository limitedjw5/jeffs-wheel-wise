import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  Activity,
  BarChart3,
  Settings,
  Shield,
  RefreshCw,
  Brain,
  FileText,
  Eye
} from 'lucide-react';
import { useCarStore } from '@/stores/useCarStore';
import { adminService, type MarketAnalysis } from '@/lib/adminServices';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import InventoryManagement from './InventoryManagement';
import AdminLogs from './AdminLogs';
import MarketAnalysisDisplay from './MarketAnalysisDisplay';
import UserManagement from './UserManagement';

const AdminDashboard: React.FC = () => {
  const { cars } = useCarStore();
  const { user } = useAuth();
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null);
  const [inventoryReview, setInventoryReview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Log admin access
    if (user) {
      adminService.logAdminLogin(user.uid, user.email || 'Unknown');
    }
  }, [user]);

  const activeCars = cars.filter(car => car.status === 'Active');
  const soldCars = cars.filter(car => car.status === 'Sold');
  const featuredCars = cars.filter(car => car.isFeatured);
  const totalValue = activeCars.reduce((sum, car) => sum + (car.price || 0), 0);

  const handleMarketAnalysis = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const analysis = await adminService.generateMarketAnalysis(cars, user.uid, user.email || 'Unknown');
      setMarketAnalysis(analysis);
      toast.success('Market analysis generated successfully');
      
      // Log the action
      await adminService.logAdminAction(
        user.uid, 
        user.email || 'Unknown', 
        'Generated market analysis',
        { totalCars: cars.length, timestamp: new Date().toISOString() }
      );
    } catch (error) {
      toast.error('Failed to generate market analysis');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInventoryReview = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const review = await adminService.generateInventoryReview(cars, user.uid, user.email || 'Unknown');
      setInventoryReview(review);
      toast.success('Inventory review generated successfully');
      
      // Log the action
      await adminService.logAdminAction(
        user.uid, 
        user.email || 'Unknown', 
        'Generated inventory review',
        { activeCars: activeCars.length, timestamp: new Date().toISOString() }
      );
    } catch (error) {
      toast.error('Failed to generate inventory review');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trend?: { value: string; isPositive: boolean };
  }> = ({ title, value, description, icon, trend }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`flex items-center text-xs mt-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.email}. Here's your business overview.
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleMarketAnalysis} 
              disabled={loading}
              variant="outline"
            >
              <Brain className="w-4 h-4 mr-2" />
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Market Analysis'}
            </Button>
            <Button 
              onClick={handleInventoryReview} 
              disabled={loading}
              variant="outline"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Inventory Review'}
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Inventory"
            value={cars.length}
            description="Total cars in system"
            icon={<Car className="w-4 h-4 text-muted-foreground" />}
            trend={{ value: "+2.5% from last month", isPositive: true }}
          />
          
          <StatCard
            title="Active Listings"
            value={activeCars.length}
            description="Currently available"
            icon={<Activity className="w-4 h-4 text-muted-foreground" />}
            trend={{ value: `${Math.round((activeCars.length / cars.length) * 100)}% of total`, isPositive: true }}
          />
          
          <StatCard
            title="Cars Sold"
            value={soldCars.length}
            description="Total sales"
            icon={<TrendingUp className="w-4 h-4 text-muted-foreground" />}
            trend={{ value: "+12% this month", isPositive: true }}
          />
          
          <StatCard
            title="Total Value"
            value={`₦${(totalValue / 1000000).toFixed(1)}M`}
            description="Active inventory value"
            icon={<BarChart3 className="w-4 h-4 text-muted-foreground" />}
            trend={{ value: "+8.2% from last month", isPositive: true }}
          />
        </div>

        {/* Quick Alerts */}
        {(inventoryReview?.alerts?.length > 0 || marketAnalysis?.lowStockAlert?.length > 0) && (
          <Card className="mb-8 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Quick Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {inventoryReview?.alerts?.map((alert: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <Badge variant="outline" className="mr-2">Alert</Badge>
                    <span className="text-sm">{alert}</span>
                  </div>
                ))}
                {marketAnalysis?.lowStockAlert?.slice(0, 3).map((car, index) => (
                  <div key={index} className="flex items-center">
                    <Badge variant="outline" className="mr-2">Low Stock</Badge>
                    <span className="text-sm">{car.make} {car.model} {car.year}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest system activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Activity className="w-4 h-4 mr-3 text-green-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New car added to inventory</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-3 text-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Market analysis generated</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-3 text-purple-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New customer inquiry</p>
                        <p className="text-xs text-muted-foreground">1 day ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performers */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Cars</CardTitle>
                  <CardDescription>Featured and high-interest vehicles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {featuredCars.slice(0, 4).map((car) => (
                      <div key={car.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{car.make} {car.model}</p>
                          <p className="text-xs text-muted-foreground">{car.year} • {car.condition}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">₦{car.price?.toLocaleString()}</p>
                          <Badge variant="secondary">Featured</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="mt-6">
            <InventoryManagement />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <MarketAnalysisDisplay 
              marketAnalysis={marketAnalysis}
              inventoryReview={inventoryReview}
              onGenerateAnalysis={handleMarketAnalysis}
              onGenerateReview={handleInventoryReview}
              loading={loading}
            />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement />
          </TabsContent>

          <TabsContent value="logs" className="mt-6">
            <AdminLogs />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  System Settings
                </CardTitle>
                <CardDescription>Configure system preferences and security</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Auto-generate market reports</h3>
                      <p className="text-xs text-muted-foreground">Weekly automated market analysis</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Security Settings</h3>
                      <p className="text-xs text-muted-foreground">Manage admin access and permissions</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Shield className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Data Backup</h3>
                      <p className="text-xs text-muted-foreground">Automatic daily backups enabled</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;