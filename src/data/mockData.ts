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
        'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2023/camry/white/1.png',
        'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2023/camry/white/2.png',
        'https://www.toyota.com/imgix/responsive/images/mlp/colorizer/2023/camry/white/3.png'
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
        'https://automobiles.honda.com/-/media/Honda-Automobiles/Vehicles/2023/Accord/Sport/Exterior/01-Exterior/2023-accord-sport-exterior-01-1600x900.png',
        'https://automobiles.honda.com/-/media/Honda-Automobiles/Vehicles/2023/Accord/Sport/Exterior/02-Exterior/2023-accord-sport-exterior-02-1600x900.png'
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
        'https://www.mbusa.com/content/dam/mb-nafta/us/myco/my23/c-class/sedan/class-page/2023-C-CLASS-SEDAN-CLASS-NAV-D.png',
        'https://www.mbusa.com/content/dam/mb-nafta/us/myco/my23/c-class/sedan/class-page/2023-C-CLASS-SEDAN-CLASS-NAV-A.png',
        'https://www.mbusa.com/content/dam/mb-nafta/us/myco/my23/c-class/sedan/class-page/2023-C-CLASS-SEDAN-CLASS-NAV-B.png'
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
        'https://www.bmwusa.com/content/dam/bmw/common/all-models/x-series/x5/2023/highlights/bmw-x5-highlights-desktop-01.jpg',
        'https://www.bmwusa.com/content/dam/bmw/common/all-models/x-series/x5/2023/highlights/bmw-x5-highlights-desktop-02.jpg'
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
        'https://www.lexus.com/content/dam/lexus/vdp/ES/23ZR/1.png',
        'https://www.lexus.com/content/dam/lexus/vdp/ES/23ZR/2.png',
        'https://www.lexus.com/content/dam/lexus/vdp/ES/23ZR/3.png'
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
        'https://www.ford.com/cmslibs/content/dam/vdm_ford/live/en_us/ford/nameplate/explorer/2023/collections/3-2/23_FRD_EXP_100122_42778.jpg',
        'https://www.ford.com/cmslibs/content/dam/vdm_ford/live/en_us/ford/nameplate/explorer/2023/collections/3-2/23_FRD_EXP_100122_42780.jpg'
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
  {
    name: 'Toyota',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_172161_1.png'
 },
  {
    name: 'Tesla',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_010090_1.png'
 },
  {
    name: 'Ferrari',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_335913_1.png'
 },
  {
    name: 'GMC',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_952055_1.png'
 },
  {
    name: 'Honda',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_203043_1.png'
  },
  {
    name: 'Mercedes-Benz',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_835479_1.png'
  },
  {
    name: 'BMW',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_980189_1.png'
  },
  {
    name: 'Lexus',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_982523_1.png'
  },
  {
    name: 'Ford',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_734802_1.png'
  },
  {
    name: 'Hyundai',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_464983_1.png'
  },
  {
    name: 'Kia',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_424187_1.png'
  },
  {
    name: 'Nissan',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_331550_1.png'
  },
  {
    name: 'Mazda',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_756270_1.png'
  },
  {
    name: 'Subaru',
    logo: 'https://example.com/path/to/subaru-logo.png'
  },
  {
    name: 'Audi',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_413135_1.png'
  },
  {
    name: 'Volkswagen',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_862755_1.png'
  },
  {
    name: 'Infiniti',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_357986_1.png'
  },
  {
    name: 'Acura',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_420973_1.png'
  },
  {
    name: 'Jeep',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_428381_1.png'
  },
  {
    name: 'Chevrolet',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_852978_1.png'
  },
  {
    name: 'Cadillac',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_177894_1.png'
  },
  {
    name: 'Genesis',
    logo: 'https://api.sellbase.im/images/cars-ng/categorie_255041_1.png'
  }
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