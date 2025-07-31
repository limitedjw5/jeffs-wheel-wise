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
        const updated = [...get().cars, car];
        set({ cars: updated });
        get().applyFiltersAndSort();
      },

      updateCar: (id, updates) => {
        const updated = get().cars.map(car =>
          car.id === id ? { ...car, ...updates, updatedAt: new Date().toISOString() } : car
        );
        set({ cars: updated });
        get().applyFiltersAndSort();
      },

      deleteCar: (id) => {
        const updated = get().cars.filter(car => car.id !== id);
        set({ cars: updated });
        get().applyFiltersAndSort();
      },

      setFilters: (newFilters) => {
        const merged = { ...get().filters, ...newFilters };
        set({ filters: merged });
        get().applyFiltersAndSort();
      },

      setSorting: (sortBy, sortOrder) => {
        set({ sortBy: sortBy as any, sortOrder });
        get().applyFiltersAndSort();
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
        get().applyFiltersAndSort();
      },

      addToComparison: (car) => {
        const current = get().comparison.cars;
        if (current.length < 3 && !current.some(c => c.id === car.id)) {
          set({ comparison: { cars: [...current, car] } });
        }
      },

      removeFromComparison: (carId) => {
        const current = get().comparison.cars.filter(c => c.id !== carId);
        set({ comparison: { cars: current } });
      },

      clearComparison: () => {
        set({ comparison: { cars: [] } });
      },

      toggleFavorite: (carId) => {
        const current = get().favorites;
        const updated = current.includes(carId)
          ? current.filter(id => id !== carId)
          : [...current, carId];
        set({ favorites: updated });
      },

      applyFiltersAndSort: () => {
        const { cars, filters, sortBy, sortOrder, searchQuery } = get();
        let filtered = [...cars];

        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(car =>
            car.make.toLowerCase().includes(q) ||
            car.model.toLowerCase().includes(q) ||
            car.year.toString().includes(q) ||
            car.condition.toLowerCase().includes(q)
          );
        }

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

        filtered.sort((a, b) => {
          let result = 0;
          switch (sortBy) {
            case 'price':
              result = a.price - b.price;
              break;
            case 'year':
              result = a.year - b.year;
              break;
            case 'mileage':
              result = a.mileage - b.mileage;
              break;
            case 'newest':
              result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
            default:
              result = 0;
          }
          return sortOrder === 'desc' ? -result : result;
        });

        set({ filteredCars: filtered });
      },
    }),
    {
      name: 'jeffworldwide-car-store',
      partialize: (state) => ({
        cars: state.cars,
        favorites: state.favorites,
        comparison: state.comparison,
      }),
    }
  )
);
