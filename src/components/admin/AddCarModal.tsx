import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  Upload, 
  X, 
  Star, 
  Crown, 
  Save, 
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Car } from '@/stores/useCarStore';
import { toast } from 'sonner';
import { firebaseAdminService } from '@/lib/firebaseServices';

interface AddCarModalProps {
  onCarAdded: (car: Car) => void;
}

const AddCarModal: React.FC<AddCarModalProps> = ({ onCarAdded }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: 0,
    originalPrice: 0,
    mileage: 0,
    vin: '',
    productionDate: '',
    engineType: '',
    transmission: '',
    color: '',
    trim: '',
    condition: 'Brand New' as const,
    conditionDescription: '',
    features: {
      standard: [] as string[],
      optional: [] as string[],
      safety: [] as string[]
    },
    priceType: 'Fixed' as const,
    financingAvailable: false,
    media: {
      photos: [] as string[],
      videos: [] as string[],
      view360: ''
    },
    history: '',
    location: '',
    contactInfo: {
      phone: '',
      email: ''
    },
    isFeatured: false,
    isDealOfTheWeek: false,
    status: 'Active' as const,
    description: '',
    tags: [] as string[]
  });

  const [newFeature, setNewFeature] = useState('');
  const [featureType, setFeatureType] = useState<'standard' | 'optional' | 'safety'>('standard');
  const [newTag, setNewTag] = useState('');

  const carMakes = [
    'Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Audi', 'Lexus', 'Nissan', 
    'Ford', 'Chevrolet', 'Hyundai', 'Kia', 'Volkswagen', 'Mazda', 'Subaru',
    'Infiniti', 'Acura', 'Cadillac', 'Jeep', 'Land Rover', 'Porsche'
  ];

  const transmissionTypes = ['Automatic', 'Manual', 'CVT', 'Semi-Automatic'];
  const engineTypes = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid'];

    const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
        const [parent, child] = field.split('.');

        setFormData(prev => ({
        ...prev,
        [parent]: {
            ...(prev[parent as keyof typeof prev] as Record<string, any>),
            [child]: value,
        },
        }));
    } else {
        setFormData(prev => ({ ...prev, [field]: value }));
    }
    };


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    setImageUploading(true);
    try {
      const imageUrls = await firebaseAdminService.uploadCarImages(files, user.uid, user.email || 'Unknown');
      handleInputChange('media.photos', [...formData.media.photos, ...imageUrls]);
      toast.success(`${imageUrls.length} images uploaded successfully`);
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload images');
    } finally {
      setImageUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedPhotos = formData.media.photos.filter((_, i) => i !== index);
    handleInputChange('media.photos', updatedPhotos);
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    
    const updatedFeatures = {
      ...formData.features,
      [featureType]: [...formData.features[featureType], newFeature.trim()]
    };
    
    handleInputChange('features', updatedFeatures);
    setNewFeature('');
  };

  const removeFeature = (type: 'standard' | 'optional' | 'safety', index: number) => {
    const updatedFeatures = {
      ...formData.features,
      [type]: formData.features[type].filter((_, i) => i !== index)
    };
    handleInputChange('features', updatedFeatures);
  };

  const addTag = () => {
    if (!newTag.trim() || formData.tags.includes(newTag.trim())) return;
    
    handleInputChange('tags', [...formData.tags, newTag.trim()]);
    setNewTag('');
  };

  const removeTag = (index: number) => {
    const updatedTags = formData.tags.filter((_, i) => i !== index);
    handleInputChange('tags', updatedTags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validation
    if (!formData.make || !formData.model || !formData.year || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.media.photos.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsLoading(true);
    try {
      // Generate VIN if not provided
      const vin = formData.vin || `JW${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      const carData = {
        ...formData,
        vin,
        contactInfo: {
          phone: formData.contactInfo.phone || '+234-XXX-XXXX',
          email: formData.contactInfo.email || 'info@jeffworldwide.com'
        }
      };

      // Handle deal of the week logic
      if (formData.isDealOfTheWeek) {
        await firebaseAdminService.setDealOfTheWeek('temp', user.uid, user.email || 'Unknown');
      }

      const carId = await firebaseAdminService.addCar(carData, user.uid, user.email || 'Unknown');
      
      // Update deal of the week with actual car ID
      if (formData.isDealOfTheWeek) {
        await firebaseAdminService.setDealOfTheWeek(carId, user.uid, user.email || 'Unknown');
      }

      const newCar: Car = { 
        id: carId, 
        ...carData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      onCarAdded(newCar);
      toast.success('Car added successfully!');
      setIsOpen(false);
      
      // Reset form
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        price: 0,
        originalPrice: 0,
        mileage: 0,
        vin: '',
        productionDate: '',
        engineType: '',
        transmission: '',
        color: '',
        trim: '',
        condition: 'Brand New',
        conditionDescription: '',
        features: { standard: [], optional: [], safety: [] },
        priceType: 'Fixed',
        financingAvailable: false,
        media: { photos: [], videos: [], view360: '' },
        history: '',
        location: '',
        contactInfo: { phone: '', email: '' },
        isFeatured: false,
        isDealOfTheWeek: false,
        status: 'Active',
        description: '',
        tags: []
      });
    } catch (error) {
      console.error('Failed to add car:', error);
      toast.error('Failed to add car');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="hover-lift">
          <Plus className="w-4 h-4 mr-2" />
          Add New Car
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Car to Inventory</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new car to your inventory
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="make">Make *</Label>
                  <Select value={formData.make} onValueChange={(value) => handleInputChange('make', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      {carMakes.map(make => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="model">Model *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleInputChange('model', e.target.value)}
                    placeholder="e.g., Camry"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (₦) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value))}
                    placeholder="5000000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="originalPrice">Original Price (₦)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', parseInt(e.target.value))}
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <Label htmlFor="mileage">Mileage (km)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    value={formData.mileage}
                    onChange={(e) => handleInputChange('mileage', parseInt(e.target.value))}
                    placeholder="50000"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Details */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="transmission">Transmission</Label>
                  <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      {transmissionTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="engineType">Engine Type</Label>
                  <Select value={formData.engineType} onValueChange={(value) => handleInputChange('engineType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select engine type" />
                    </SelectTrigger>
                    <SelectContent>
                      {engineTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">Condition</Label>
                  <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brand New">Brand New</SelectItem>
                      <SelectItem value="Foreign Used">Foreign Used</SelectItem>
                      <SelectItem value="Nigerian Used">Nigerian Used</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    value={formData.color}
                    onChange={(e) => handleInputChange('color', e.target.value)}
                    placeholder="e.g., Black"
                  />
                </div>

                <div>
                  <Label htmlFor="trim">Trim</Label>
                  <Input
                    id="trim"
                    value={formData.trim}
                    onChange={(e) => handleInputChange('trim', e.target.value)}
                    placeholder="e.g., Limited"
                  />
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Lagos, Nigeria"
                  />
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of the vehicle..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Images *</h3>
              
              <div className="mb-4">
                <Label htmlFor="images">Upload Images</Label>
                <div className="mt-2">
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('images')?.click()}
                    disabled={imageUploading}
                    className="w-full"
                  >
                    {imageUploading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</>
                    ) : (
                      <><Upload className="w-4 h-4 mr-2" /> Upload Images</>
                    )}
                  </Button>
                </div>
              </div>

              {formData.media.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.media.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={photo}
                        alt={`Car ${index + 1}`}
                        className="w-full h-24 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 w-6 h-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              
              <div className="flex gap-2 mb-4">
                <Select value={featureType} onValueChange={(value: any) => setFeatureType(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature}>Add</Button>
              </div>

              <div className="space-y-4">
                {Object.entries(formData.features).map(([type, features]) => (
                  <div key={type}>
                    <h4 className="font-medium capitalize mb-2">{type} Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="cursor-pointer">
                          {feature}
                          <X 
                            className="w-3 h-3 ml-1" 
                            onClick={() => removeFeature(type as any, index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              
              <div className="flex gap-2 mb-4">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag}>Add Tag</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="cursor-pointer">
                    {tag}
                    <X 
                      className="w-3 h-3 ml-1" 
                      onClick={() => removeTag(index)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Special Options */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Special Options</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => handleInputChange('isFeatured', checked)}
                  />
                  <Label htmlFor="featured" className="flex items-center">
                    <Star className="w-4 h-4 mr-2 text-yellow-500" />
                    Mark as Featured
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="dealOfWeek"
                    checked={formData.isDealOfTheWeek}
                    onCheckedChange={(checked) => handleInputChange('isDealOfTheWeek', checked)}
                  />
                  <Label htmlFor="dealOfWeek" className="flex items-center">
                    <Crown className="w-4 h-4 mr-2 text-purple-500" />
                    Set as Deal of the Week
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="financing"
                    checked={formData.financingAvailable}
                    onCheckedChange={(checked) => handleInputChange('financingAvailable', checked)}
                  />
                  <Label htmlFor="financing">
                    Financing Available
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding Car...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Add Car</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCarModal;