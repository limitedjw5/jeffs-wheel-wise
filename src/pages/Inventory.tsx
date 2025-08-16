import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  ShoppingCart, 
  Eye,
  Phone,
  MessageCircle,
  Star,
  ChevronDown,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCarStore } from '@/stores/useCarStore';
import { mockCars, carBrands, carConditions, transmissionTypes, carTags } from '@/data/mockData';

const Inventory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';
  
  const {
    setCars,
    filteredCars,
    filters,
    setFilters,
    setSorting,
    setSearchQuery,
    searchQuery,
    sortBy,
    sortOrder,
    comparison,
    favorites,
    addToComparison,
    removeFromComparison,
    toggleFavorite
  } = useCarStore();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 50000000]);
  const [yearRange, setYearRange] = useState([2010, 2024]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setCars(mockCars);
  }, [setCars]);

  useEffect(() => {
    // Apply price and year range filters
    setFilters({
      ...filters,
      priceRange: { min: priceRange[0], max: priceRange[1] },
      year: { min: yearRange[0], max: yearRange[1] }
    });
  }, [priceRange, yearRange]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    setSorting(sortBy, sortOrder as 'asc' | 'desc');
  };

  const handleConditionFilter = (condition: string, checked: boolean) => {
    const currentConditions = filters.condition || [];
    const newConditions = checked
      ? [...currentConditions, condition]
      : currentConditions.filter(c => c !== condition);
    
    setFilters({ ...filters, condition: newConditions });
  };

  const handleTransmissionFilter = (transmission: string, checked: boolean) => {
    const currentTransmissions = filters.transmission || [];
    const newTransmissions = checked
      ? [...currentTransmissions, transmission]
      : currentTransmissions.filter(t => t !== transmission);
    
    setFilters({ ...filters, transmission: newTransmissions });
  };

  const handleTagFilter = (tag: string, checked: boolean) => {
    const currentTags = filters.tags || [];
    const newTags = checked
      ? [...currentTags, tag]
      : currentTags.filter(t => t !== tag);
    
    setFilters({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    setFilters({});
    setPriceRange([0, 50000000]);
    setYearRange([2010, 2024]);
    setSearchQuery('');
  };

  const getDisplayedCars = () => {
    switch (activeTab) {
      case 'favorites':
        return filteredCars.filter(car => favorites.includes(car.id));
      case 'compare':
        return comparison.cars;
      default:
        return filteredCars;
    }
  };

  const displayedCars = getDisplayedCars();

  const openWhatsApp = (car: any) => {
    const message = `Hi! I'm interested in the ${car.year} ${car.make} ${car.model} listed for ₦${car.price.toLocaleString()}. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/2348147319668?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const FilterSidebar = ({ isMobile = false }) => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={50000000}
            step={500000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₦{priceRange[0].toLocaleString()}</span>
            <span>₦{priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Year Range</h3>
        <div className="space-y-3">
          <Slider
            value={yearRange}
            onValueChange={setYearRange}
            min={2010}
            max={2024}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Make</h3>
      <Select value={filters.make || 'any'} onValueChange={(value) => {
        setFilters({ ...filters, make: value === 'any' ? undefined : value });
      }}>
        <SelectTrigger>
          <SelectValue placeholder="Any Make" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Make</SelectItem>
          {carBrands.map((brand, index) => (
            <SelectItem key={brand.name + index} value={brand.name}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Condition</h3>
        <div className="space-y-2">
          {carConditions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={filters.condition?.includes(condition) || false}
                onCheckedChange={(checked) => handleConditionFilter(condition, checked as boolean)}
              />
              <label htmlFor={condition} className="text-sm">{condition}</label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Transmission</h3>
        <div className="space-y-2">
          {transmissionTypes.map((transmission) => (
            <div key={transmission} className="flex items-center space-x-2">
              <Checkbox
                id={transmission}
                checked={filters.transmission?.includes(transmission) || false}
                onCheckedChange={(checked) => handleTransmissionFilter(transmission, checked as boolean)}
              />
              <label htmlFor={transmission} className="text-sm">{transmission}</label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-3">Tags</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {carTags.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={tag}
                checked={filters.tags?.includes(tag) || false}
                onCheckedChange={(checked) => handleTagFilter(tag, checked as boolean)}
              />
              <label htmlFor={tag} className="text-sm">{tag}</label>
            </div>
          ))}
        </div>
      </div>

      <Button 
        variant="outline" 
        onClick={clearFilters}
        className="w-full"
      >
        Clear All Filters
      </Button>
    </div>
  );

  const CarCard = ({ car, index }: { car: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="hover-lift"
    >
      <Card className="overflow-hidden card-shadow">
        <div className="relative aspect-video">
          <img 
            src={car.media.photos[0]} 
            alt={`${car.make} ${car.model}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            {car.isFeatured && (
              <Badge className="bg-destructive text-destructive-foreground text-xs">
                Featured
              </Badge>
            )}
            {car.status === 'Sold' && (
              <Badge className="bg-muted text-muted-foreground text-xs">
                Sold
              </Badge>
            )}
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => toggleFavorite(car.id)}
              className="w-8 h-8 p-0"
            >
              <Heart className={`w-4 h-4 ${favorites.includes(car.id) ? 'fill-current text-destructive' : ''}`} />
            </Button>
            {comparison.cars.length < 3 && !comparison.cars.find(c => c.id === car.id) && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => addToComparison(car)}
                className="w-8 h-8 p-0"
              >
                <ShoppingCart className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-bold mb-2">
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {car.description}
          </p>
          
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-lg font-bold text-primary">
                ₦{car.price.toLocaleString()}
              </p>
              {car.originalPrice && car.originalPrice > car.price && (
                <p className="text-xs text-muted-foreground line-through">
                  ₦{car.originalPrice.toLocaleString()}
                </p>
              )}
            </div>
            <Badge variant="outline">{car.condition}</Badge>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            <Badge variant="secondary" className="text-xs">
              {car.mileage.toLocaleString()} km
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {car.transmission}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {car.engineType}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Button size="sm" className="flex-1 hover-lift" asChild>
              <Link to={`/inventory/${car.id}`}>
                <Eye className="w-4 h-4 mr-1" />
                View
              </Link>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => openWhatsApp(car)}
              className="hover-lift"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Car Inventory</h1>
        <p className="text-muted-foreground">
          Find your perfect car from our extensive collection
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          onClick={() => setSearchParams({ tab: 'all' })}
        >
          All Cars ({filteredCars.length})
        </Button>
        <Button
          variant={activeTab === 'favorites' ? 'default' : 'outline'}
          onClick={() => setSearchParams({ tab: 'favorites' })}
        >
          <Heart className="w-4 h-4 mr-2" />
          Favorites ({favorites.length})
        </Button>
        <Button
          variant={activeTab === 'compare' ? 'default' : 'outline'}
          onClick={() => setSearchParams({ tab: 'compare' })}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Compare ({comparison.cars.length}/3)
        </Button>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by make, model, year..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={`${sortBy}-${sortOrder}`} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest-desc">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="year-desc">Year: Newest</SelectItem>
              <SelectItem value="year-asc">Year: Oldest</SelectItem>
              <SelectItem value="mileage-asc">Mileage: Low to High</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Filter Trigger */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar isMobile />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-80 shrink-0">
          <Card className="p-6 sticky top-24">
            <h2 className="font-semibold mb-4">Filters</h2>
            <FilterSidebar />
          </Card>
        </aside>

        {/* Car Grid/List */}
        <div className="flex-1">
          {displayedCars.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No cars found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {displayedCars.map((car, index) => (
                <CarCard key={car.id} car={car} index={index} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Bar */}
      <AnimatePresence>
        {comparison.cars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-40"
          >
            <Card className="p-4 bg-background border shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold">Compare Cars ({comparison.cars.length}/3)</h3>
                  <div className="flex gap-2">
                    {comparison.cars.map(car => (
                      <div key={car.id} className="flex items-center gap-2 bg-muted px-3 py-1 rounded-md">
                        <span className="text-sm">{car.make} {car.model}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFromComparison(car.id)}
                          className="w-4 h-4 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                <Button className="hover-lift">
                  Compare Now
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
