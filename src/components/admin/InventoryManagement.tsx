import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useCarStore } from '@/stores/useCarStore';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseAdminService } from '@/lib/firebaseServices';
import AddCarModal from './AddCarModal';

const InventoryManagement: React.FC = () => {
  const { cars, updateCar, deleteCar, addCar } = useCarStore();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCars, setSelectedCars] = useState<string[]>([]);

  const filteredCars = cars.filter(car => {
    const matchesSearch = car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         car.year.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || car.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (carId: string, newStatus: 'Active' | 'Sold' | 'Inactive') => {
    if (!user) return;
    
    try {
      updateCar(carId, { status: newStatus });
      toast.success(`Car status updated to ${newStatus}`);
      
      // Log the action
      await firebaseAdminService.logAdminAction(
        user.uid,
        user.email || 'Unknown',
        `Changed car status to ${newStatus}`,
        { carId, newStatus }
      );
    } catch (error) {
      toast.error('Failed to update car status');
    }
  };

  const handleDelete = async (carId: string) => {
    if (!user) return;
    
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        deleteCar(carId);
        toast.success('Car deleted successfully');
        
        // Log the action
        await firebaseAdminService.logAdminAction(
          user.uid,
          user.email || 'Unknown',
          'Deleted car from inventory',
          { carId }
        );
      } catch (error) {
        toast.error('Failed to delete car');
      }
    }
  };

  const handleBulkStatusChange = async (newStatus: 'Active' | 'Sold' | 'Inactive') => {
    if (!user || selectedCars.length === 0) return;
    
    try {
      selectedCars.forEach(carId => {
        updateCar(carId, { status: newStatus });
      });
      
      toast.success(`${selectedCars.length} cars updated to ${newStatus}`);
      setSelectedCars([]);
      
      // Log the action
      await firebaseAdminService.logAdminAction(
        user.uid,
        user.email || 'Unknown',
        `Bulk status change to ${newStatus}`,
        { carIds: selectedCars, newStatus, count: selectedCars.length }
      );
    } catch (error) {
      toast.error('Failed to update cars');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Sold':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'Inactive':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'Sold':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Inactive':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Inventory Management</h2>
          <p className="text-muted-foreground">Manage your car inventory and track status</p>
        </div>
        <AddCarModal onCarAdded={addCar} />
      </div>

      {/* Filters and Search */}
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
                  placeholder="Search by make, model, or year..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Sold">Sold</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCars.length > 0 && (
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedCars.length} car(s) selected
              </span>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkStatusChange('Active')}
                >
                  Mark Active
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkStatusChange('Sold')}
                >
                  Mark Sold
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleBulkStatusChange('Inactive')}
                >
                  Mark Inactive
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedCars([])}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory ({filteredCars.length} cars)</CardTitle>
          <CardDescription>
            Active: {filteredCars.filter(c => c.status === 'Active').length} | 
            Sold: {filteredCars.filter(c => c.status === 'Sold').length} | 
            Inactive: {filteredCars.filter(c => c.status === 'Inactive').length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={selectedCars.length === filteredCars.length && filteredCars.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCars(filteredCars.map(car => car.id));
                        } else {
                          setSelectedCars([]);
                        }
                      }}
                      className="rounded"
                    />
                  </TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Deal of Week</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedCars.includes(car.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCars([...selectedCars, car.id]);
                          } else {
                            setSelectedCars(selectedCars.filter(id => id !== car.id));
                          }
                        }}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{car.make} {car.model}</div>
                        <div className="text-xs text-muted-foreground">{car.vin}</div>
                      </div>
                    </TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell>₦{car.price?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{car.condition}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(car.status)}
                        <Badge className={getStatusColor(car.status)}>
                          {car.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {car.isFeatured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {(car as any).isDealOfTheWeek && (
                        <Badge variant="default" className="bg-purple-500">Deal of Week</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs">
                      {new Date(car.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <select
                          value={car.status}
                          onChange={(e) => handleStatusChange(car.id, e.target.value as any)}
                          className="text-xs px-2 py-1 border rounded"
                        >
                          <option value="Active">Active</option>
                          <option value="Sold">Sold</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(car.id)}
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredCars.filter(c => c.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">Active Listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              ₦{(filteredCars.filter(c => c.status === 'Active').reduce((sum, car) => sum + (car.price || 0), 0) / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">Total Active Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{filteredCars.filter(c => c.status === 'Sold').length}</div>
            <p className="text-xs text-muted-foreground">Cars Sold</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryManagement;