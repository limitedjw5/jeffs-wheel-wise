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
    logo: 'data:image/jpeg;base64,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'
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