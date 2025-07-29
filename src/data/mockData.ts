import { Car } from '@/stores/useCarStore';

export const mockCars: Car[] = [
  {
    id: 'car_001',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    price: 15500000,
    originalPrice: 16000000,
    mileage: 15000,
    vin: 'JT2SK12E5M0123456',
    productionDate: '2023-01-15',
    engineType: '2.5L 4-Cylinder',
    transmission: 'Automatic',
    color: 'Pearl White',
    trim: 'XLE',
    condition: 'Foreign Used',
    conditionDescription: 'Excellent condition with full service history',
    features: {
      standard: ['Power Windows', 'Air Conditioning', 'ABS Brakes', 'Airbags', 'Cruise Control'],
      optional: ['Sunroof', 'Leather Seats', 'Navigation System'],
      safety: ['Blind Spot Monitoring', 'Lane Departure Warning', 'Automatic Emergency Braking']
    },
    priceType: 'Negotiable',
    financingAvailable: true,
    media: {
      photos: [
        'https://i.ibb.co/VpzYnQz/toyota-camry-1.jpg',
        'https://i.ibb.co/yqxGKH9/toyota-camry-2.jpg',
        'https://i.ibb.co/kDrPtYh/toyota-camry-3.jpg'
      ],
      videos: [],
      view360: 'https://example.com/360-view-camry'
    },
    history: 'One previous owner, all services performed at authorized dealers',
    location: 'Lagos Showroom',
    contactInfo: {
      phone: '08147319668',
      email: 'jeffrey.okereafor@yahoo.com'
    },
    isFeatured: true,
    status: 'Active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    description: 'Experience luxury and reliability with this pristine 2023 Toyota Camry XLE.',
    tags: ['Luxury', 'FamilyFriendly', 'FuelEfficient']
  },
  {
    id: 'car_002',
    make: 'Honda',
    model: 'Accord',
    year: 2022,
    price: 13800000,
    mileage: 25000,
    vin: 'JH4TB2H26CC123456',
    productionDate: '2022-03-10',
    engineType: '1.5L Turbo',
    transmission: 'CVT',
    color: 'Metallic Black',
    trim: 'Sport',
    condition: 'Foreign Used',
    conditionDescription: 'Well maintained with minor wear',
    features: {
      standard: ['Push Start', 'Dual Climate Control', 'LED Headlights', 'Bluetooth'],
      optional: ['Premium Audio', 'Wireless Charging'],
      safety: ['Honda Sensing Suite', 'Collision Mitigation', 'Traffic Sign Recognition']
    },
    priceType: 'Fixed',
    financingAvailable: true,
    media: {
      photos: [
        'https://i.ibb.co/2cPR8Kx/honda-accord-1.jpg',
        'https://i.ibb.co/8N7gH3x/honda-accord-2.jpg'
      ],
      videos: [],
    },
    history: 'Corporate fleet vehicle with complete maintenance records',
    location: 'Ibadan Showroom',
    contactInfo: {
      phone: '08147319668',
      email: 'jeffrey.okereafor@yahoo.com'
    },
    isFeatured: false,
    status: 'Active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:15:00Z',
    description: 'Sporty and efficient Honda Accord with advanced safety features.',
    tags: ['Sport', 'FuelEfficient', 'Technology']
  },
  {
    id: 'car_003',
    make: 'Mercedes-Benz',
    model: 'C-Class',
    year: 2021,
    price: 22500000,
    originalPrice: 25000000,
    mileage: 35000,
    vin: 'WDDGF8AB5CA123456',
    productionDate: '2021-08-20',
    engineType: '2.0L Turbo',
    transmission: '9G-TRONIC',
    color: 'Obsidian Black',
    trim: 'C300',
    condition: 'Foreign Used',
    conditionDescription: 'Premium condition with luxury appointments',
    features: {
      standard: ['AMG Styling', 'MBUX Infotainment', 'LED Ambient Lighting', '64-Color Lighting'],
      optional: ['Panoramic Sunroof', 'Burmester Audio', 'Memory Seats'],
      safety: ['Mercedes-Benz Intelligent Drive', 'Active Brake Assist', 'Attention Assist']
    },
    priceType: 'Negotiable',
    financingAvailable: true,
    media: {
      photos: [
        'https://i.ibb.co/9WxP2Hj/mercedes-c-class-1.jpg',
        'https://i.ibb.co/VWq8P3x/mercedes-c-class-2.jpg',
        'https://i.ibb.co/HNzQp4K/mercedes-c-class-3.jpg'
      ],
      videos: [],
    },
    history: 'Single owner executive vehicle, garage kept',
    location: 'Lagos Showroom',
    contactInfo: {
      phone: '08147319668',
      email: 'jeffrey.okereafor@yahoo.com'
    },
    isFeatured: true,
    status: 'Active',
    createdAt: '2024-01-08T14:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    description: 'Luxury redefined with this stunning Mercedes-Benz C300.',
    tags: ['Luxury', 'Premium', 'Executive']
  },
  {
    id: 'car_004',
    make: 'BMW',
    model: 'X5',
    year: 2020,
    price: 28000000,
    mileage: 45000,
    vin: '5UXCR6C0XL9123456',
    productionDate: '2020-11-15',
    engineType: '3.0L Inline-6 Turbo',
    transmission: '8-Speed Automatic',
    color: 'Alpine White',
    trim: 'xDrive40i',
    condition: 'Foreign Used',
    conditionDescription: 'Excellent SUV with premium features',
    features: {
      standard: ['All-Wheel Drive', 'Heated Seats', 'Panoramic Sunroof', 'iDrive 7.0'],
      optional: ['Third Row Seating', 'Harman Kardon Audio', 'Head-Up Display'],
      safety: ['BMW Driving Assistant', 'Parking Assistant', 'Surround View Camera']
    },
    priceType: 'Fixed',
    financingAvailable: true,
    media: {
      photos: [
        'https://i.ibb.co/dGPqx8w/bmw-x5-1.jpg',
        'https://i.ibb.co/2YzpR4K/bmw-x5-2.jpg'
      ],
      videos: [],
    },
    history: 'Well maintained family vehicle with service records',
    location: 'Port Harcourt Showroom',
    contactInfo: {
      phone: '08147319668',
      email: 'jeffrey.okereafor@yahoo.com'
    },
    isFeatured: false,
    status: 'Active',
    createdAt: '2024-01-05T11:30:00Z',
    updatedAt: '2024-01-19T13:20:00Z',
    description: 'Versatile luxury SUV perfect for Nigerian roads.',
    tags: ['SUV', 'Luxury', 'FamilyFriendly', 'OffRoad']
  },
  {
    id: 'car_005',
    make: 'Lexus',
    model: 'ES 350',
    year: 2023,
    price: 32000000,
    mileage: 8000,
    vin: '58ABK1GG0NU123456',
    productionDate: '2023-05-10',
    engineType: '3.5L V6',
    transmission: '8-Speed Automatic',
    color: 'Caviar',
    trim: 'Luxury',
    condition: 'Brand New',
    conditionDescription: 'Brand new with full manufacturer warranty',
    features: {
      standard: ['Premium Audio', 'Heated & Ventilated Seats', 'Wireless Charging', 'Mark Levinson Audio'],
      optional: ['Ultra Luxury Package', 'Semi-Aniline Leather'],
      safety: ['Lexus Safety System+ 2.5', 'Pre-Collision System', 'Dynamic Radar Cruise Control']
    },
    priceType: 'Fixed',
    financingAvailable: true,
    media: {
      photos: [
        'https://i.ibb.co/5FnPH3K/lexus-es-1.jpg',
        'https://i.ibb.co/TqDR4Kx/lexus-es-2.jpg',
        'https://i.ibb.co/sJQ2rKT/lexus-es-3.jpg'
      ],
      videos: [],
    },
    history: 'Brand new vehicle with zero mileage',
    location: 'Lagos Showroom',
    contactInfo: {
      phone: '08147319668',
      email: 'jeffrey.okereafor@yahoo.com'
    },
    isFeatured: true,
    status: 'Active',
    createdAt: '2024-01-25T08:00:00Z',
    updatedAt: '2024-01-25T08:00:00Z',
    description: 'Ultimate luxury sedan with cutting-edge technology.',
    tags: ['Luxury', 'BrandNew', 'Premium', 'Executive']
  },
  {
    id: 'car_006',
    make: 'Ford',
    model: 'Explorer',
    year: 2019,
    price: 18500000,
    mileage: 55000,
    vin: '1FM5K8D84KGA12345',
    productionDate: '2019-02-28',
    engineType: '3.5L V6',
    transmission: '10-Speed Automatic',
    color: 'Magnetic Metallic',
    trim: 'Limited',
    condition: 'Foreign Used',
    conditionDescription: 'Reliable SUV with proven performance',
    features: {
      standard: ['Third Row Seating', 'SYNC 3', 'Dual-Zone Climate', 'Power Liftgate'],
      optional: ['Navigation System', 'Premium Audio'],
      safety: ['Ford Co-Pilot360', 'Blind Spot Information System', 'Rear Cross-Traffic Alert']
    },
    priceType: 'Negotiable',
    financingAvailable: true,
    media: {
      photos: [
        'https://i.ibb.co/QDW7x3K/ford-explorer-1.jpg',
        'https://i.ibb.co/8Y3Qp9w/ford-explorer-2.jpg'
      ],
      videos: [],
    },
    history: 'Family owned with regular maintenance',
    location: 'Ibadan Showroom',
    contactInfo: {
      phone: '08147319668',
      email: 'jeffrey.okereafor@yahoo.com'
    },
    isFeatured: false,
    status: 'Active',
    createdAt: '2024-01-12T15:45:00Z',
    updatedAt: '2024-01-21T10:30:00Z',
    description: 'Spacious and dependable SUV for large families.',
    tags: ['SUV', 'FamilyFriendly', 'SevenSeater', 'Reliable']
  }
];

export const carBrands = [
  'Toyota', 'Honda', 'Mercedes-Benz', 'BMW', 'Lexus', 'Ford', 'Hyundai', 'Kia',
  'Nissan', 'Mazda', 'Subaru', 'Audi', 'Volkswagen', 'Infiniti', 'Acura',
  'Jeep', 'Chevrolet', 'Buick', 'Cadillac', 'Genesis'
];

export const carConditions = ['Brand New', 'Foreign Used', 'Nigerian Used'];

export const transmissionTypes = ['Automatic', 'Manual', 'CVT'];

export const fuelTypes = ['Gasoline', 'Hybrid', 'Electric', 'Diesel'];

export const carTags = [
  'Luxury', 'Sport', 'FamilyFriendly', 'FuelEfficient', 'OffRoad', 
  'Executive', 'Compact', 'SUV', 'Sedan', 'Coupe', 'Convertible',
  'Hybrid', 'Electric', 'Turbo', 'AWD', 'BrandNew', 'LowMileage',
  'Reliable', 'Premium', 'Technology', 'SevenSeater'
];

export const testimonials = [
  {
    id: 'test_001',
    name: 'Adaora Okafor',
    location: 'Lagos',
    rating: 5,
    comment: 'Excellent service! Got my dream Toyota Camry with easy financing. The team was professional and transparent throughout.',
    carPurchased: 'Toyota Camry 2022',
    date: '2024-01-15',
    verified: true
  },
  {
    id: 'test_002',
    name: 'Ibrahim Hassan',
    location: 'Abuja',
    rating: 5,
    comment: 'Jeffworldwide made car buying stress-free. The 6-month warranty gave me peace of mind. Highly recommended!',
    carPurchased: 'Honda Accord 2021',
    date: '2024-01-08',
    verified: true
  },
  {
    id: 'test_003',
    name: 'Grace Okonkwo',
    location: 'Port Harcourt',
    rating: 5,
    comment: 'Amazing experience from start to finish. The car was exactly as described and the financing options were flexible.',
    carPurchased: 'Mercedes-Benz C300 2020',
    date: '2023-12-22',
    verified: true
  }
];

export const teamMembers = [
  {
    id: 'team_001',
    name: 'Jeffrey Okereafor Chinedu',
    position: 'Founder & CEO',
    bio: 'Visionary leader transforming Nigeria\'s automobile industry with innovative digital solutions and customer-focused approach.',
    image: 'https://cdn.pmnewsnigeria.com/wp-content/uploads/2024/10/4afa0da8-b1ad-4ab2-bcf0-6b5386b52b31.jpeg',
    email: 'jeffrey.okereafor@yahoo.com',
    phone: '08147319668',
    linkedin: '',
    experience: '11+ years in automotive industry',
    specialization: 'Digital transformation, Customer experience, Strategic planning'
  },
  {
    id: 'team_002',
    name: 'Nwanyanwu Okereafor Angela',
    position: 'Director',
    bio: 'Strategic leader overseeing operations and driving company growth across multiple showroom locations.',
    image: '/placeholder-woman.jpg',
    email: 'angela@jeffworldwide.com',
    phone: '08147319669',
    linkedin: '',
    experience: '8+ years in operations management',
    specialization: 'Operations management, Logistics, Strategic partnerships'
  },
  {
    id: 'team_003',
    name: 'Company Secretary',
    position: 'Secretary',
    bio: 'Managing CRM, documentation, and ensuring exceptional customer service delivery across all touchpoints.',
    image: '/placeholder-person.jpg',
    email: 'secretary@jeffworldwide.com',
    phone: '08147319670',
    linkedin: '',
    experience: '5+ years in customer relations',
    specialization: 'Customer relationship management, Documentation, Service delivery'
  }
];