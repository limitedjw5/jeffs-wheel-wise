import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  originalPrice?: number;
  mileage: number;
  vin: string;
  productionDate: string;
  engineType: string;
  transmission: string;
  color: string;
  trim: string;
  condition: 'Brand New' | 'Foreign Used' | 'Nigerian Used';
  conditionDescription: string;
  features: {
    standard: string[];
    optional: string[];
    safety: string[];
  };
  priceType: 'Fixed' | 'Negotiable';
  financingAvailable: boolean;
  media: {
    photos: string[];
    videos: string[];
    view360?: string;
  };
  history: string;
  location: string;
  contactInfo: {
    phone: string;
    email: string;
  };
  isFeatured: boolean;
  status: 'Active' | 'Sold' | 'Inactive';
  createdAt: string;
  updatedAt: string;
  description?: string;
  tags?: string[];
}

export interface CarFilters {
  make?: string;
  year?: { min: number; max: number };
  condition?: string[];
  transmission?: string[];
  fuelType?: string[];
  tags?: string[];
  priceRange?: { min: number; max: number };
}

export interface CarComparison {
  cars: Car[];
}

interface CarStore {
  cars: Car[];
  filteredCars: Car[];
  filters: CarFilters;
  sortBy: 'price' | 'year' | 'mileage' | 'newest';
  sortOrder: 'asc' | 'desc';
  comparison: CarComparison;
  searchQuery: string;
  favorites: string[];
  
  // Actions
  setCars: (cars: Car[]) => void;
  addCar: (car: Car) => void;
  updateCar: (id: string, updates: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  setFilters: (filters: Partial<CarFilters>) => void;
  setSorting: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setSearchQuery: (query: string) => void;
  addToComparison: (car: Car) => void;
  removeFromComparison: (carId: string) => void;
  clearComparison: () => void;
  toggleFavorite: (carId: string) => void;
  applyFiltersAndSort: () => void;
}

export const useCarStore = create<CarStore>()(
  persist(
    (set, get) => ({
      cars: [],
      filteredCars: [],
      filters: {},
      sortBy: 'newest',
      sortOrder: 'desc',
      comparison: { cars: [] },
      searchQuery: '',
      favorites: [],

      setCars: (cars) => {
        set({ cars });
        get().applyFiltersAndSort();
      },

      addCar: (car) => {
        const cars = [...get().cars, car];
        set({ cars });
        get().applyFiltersAndSort();
      },

      updateCar: (id, updates) => {
        const cars = get().cars.map(car => 
          car.id === id ? { ...car, ...updates, updatedAt: new Date().toISOString() } : car
        );
        set({ cars });
        get().applyFiltersAndSort();
      },

      deleteCar: (id) => {
        const cars = get().cars.filter(car => car.id !== id);
        set({ cars });
        get().applyFiltersAndSort();
      },

      setFilters: (newFilters) => {
        const filters = { ...get().filters, ...newFilters };
        set({ filters });
        get().applyFiltersAndSort();
      },

      setSorting: (sortBy, sortOrder) => {
        set({ sortBy: sortBy as any, sortOrder });
        get().applyFiltersAndSort();
      },

      setSearchQuery: (searchQuery) => {
        set({ searchQuery });
        get().applyFiltersAndSort();
      },

      addToComparison: (car) => {
        const { comparison } = get();
        if (comparison.cars.length < 3 && !comparison.cars.find(c => c.id === car.id)) {
          set({
            comparison: {
              cars: [...comparison.cars, car]
            }
          });
        }
      },

      removeFromComparison: (carId) => {
        const { comparison } = get();
        set({
          comparison: {
            cars: comparison.cars.filter(car => car.id !== carId)
          }
        });
      },

      clearComparison: () => {
        set({ comparison: { cars: [] } });
      },

      toggleFavorite: (carId) => {
        const { favorites } = get();
        const newFavorites = favorites.includes(carId)
          ? favorites.filter(id => id !== carId)
          : [...favorites, carId];
        set({ favorites: newFavorites });
      },

      applyFiltersAndSort: () => {
        const { cars, filters, sortBy, sortOrder, searchQuery } = get();
        let filtered = [...cars];

        // Apply search query
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(car =>
            car.make.toLowerCase().includes(query) ||
            car.model.toLowerCase().includes(query) ||
            car.year.toString().includes(query) ||
            car.condition.toLowerCase().includes(query)
          );
        }

        // Apply filters
        if (filters.make) {
          filtered = filtered.filter(car => car.make === filters.make);
        }

        if (filters.condition?.length) {
          filtered = filtered.filter(car => filters.condition!.includes(car.condition));
        }

        if (filters.transmission?.length) {
          filtered = filtered.filter(car => filters.transmission!.includes(car.transmission));
        }

        if (filters.year) {
          filtered = filtered.filter(car => 
            car.year >= filters.year!.min && car.year <= filters.year!.max
          );
        }

        if (filters.priceRange) {
          filtered = filtered.filter(car => 
            car.price >= filters.priceRange!.min && car.price <= filters.priceRange!.max
          );
        }

        if (filters.tags?.length) {
          filtered = filtered.filter(car =>
            car.tags?.some(tag => filters.tags!.includes(tag))
          );
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;
          
          switch (sortBy) {
            case 'price':
              comparison = a.price - b.price;
              break;
            case 'year':
              comparison = a.year - b.year;
              break;
            case 'mileage':
              comparison = a.mileage - b.mileage;
              break;
            case 'newest':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
            default:
              comparison = 0;
          }

          return sortOrder === 'desc' ? -comparison : comparison;
        });

        set({ filteredCars: filtered });
      },
    }),
    {
      name: 'jeffworldwide-cars',
      partialize: (state) => ({
        favorites: state.favorites,
        comparison: state.comparison,
      }),
    }
  )
);