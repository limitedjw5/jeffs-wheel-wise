import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { 
  Search, 
  Mic, 
  Star, 
  ArrowRight, 
  Timer, 
  Shield, 
  CreditCard,
  Quote,
  ChevronRight,
  Car,
  Users,
  Award,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCarStore } from '@/stores/useCarStore';
import { mockCars, carBrands, testimonials } from '@/data/mockData';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Index: React.FC = () => {
  const { setCars, filteredCars } = useCarStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    // Initialize with mock data
    setCars(mockCars);
  }, [setCars]);

  // Voice search functionality
  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };

      recognition.start();
    }
  };

  const featuredCars = filteredCars.filter(car => car.isFeatured);
  const newArrivals = filteredCars
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const heroSlides = [
    {
      title: "Find Your Perfect Car",
      subtitle: "Premium vehicles with transparent pricing",
      image: "data:image/jpeg;base64,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",
      cta: "Browse Inventory"
    },
    {
      title: "AI-Powered Recommendations",
      subtitle: "Let our AI find the ideal car for you",
      image: "data:image/jpeg;base64,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",
      cta: "Get AI Recommendation"
    },
    {
      title: "Flexible Car Financing",
      subtitle: "Pay 40% down, spread the rest over 6-24 months",
      image: "data:image/jpeg;base64,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",
      cta: "Calculate Loan"
    }
  ];

  const stats = [
    { icon: Car, value: "500+", label: "Cars Sold" },
    { icon: Users, value: "1000+", label: "Happy Customers" },
    { icon: Award, value: "11+", label: "Years Experience" },
    { icon: TrendingUp, value: "98%", label: "Customer Satisfaction" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] lg:h-[45vh]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop={true}
          className="h-full w-full"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-0 bg-black/70 opacity-90" />
                
                <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:text-7xl text-5xl font-bold mb-6"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl mb-20 opacity-90"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Button 
                      size="lg" 
                      className="bg-white hidden text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto hover-lift"
                      asChild
                    >
                      <Link to="/inventory">{slide.cta}</Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Search Bar Overlay */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-5 z-30">
          <Card className="card-shadow bg-white/95 backdrop-blur-md mb-[-100px]">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    placeholder="Search by make, model, year..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-12 h-12"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={startVoiceSearch}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 ${
                      isListening ? 'bg-destructive text-destructive-foreground animate-pulse' : ''
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                </div>
                <Button 
                  size="lg" 
                  className="h-12 px-8 hover-lift"
                  asChild
                >
                  <Link to="/inventory">Find My Car</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="h-12 px-8 hover-lift"
                  asChild
                >
                  <Link to="/ai-recommend">AI Recommendation</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>


     {/* Brand Section */}
    <section className="py-16 mt-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Browse by Brand</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto hidden">
            Choose from premium brands we trust and our customers love
          </p>
        </div>
        
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
          {carBrands.slice(0, 20).map((brand) => (
            <motion.button
              key={brand.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedBrand(brand.name)}
              className={`p-2 rounded-lg border-2 smooth-transition hover-lift flex flex-col items-center justify-center aspect-square ${
                selectedBrand === brand.name 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary'
              }`}
            >
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="w-28 h-28 object-contain mb-2"
                onError={(e) => {
                  // Fallback if logo fails to load
                  (e.target as HTMLImageElement).src = '/path-to-fallback-image.png';
                }}
              />
              <span className="font-medium text-xs text-center">{brand.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>

      {/* Featured Cars */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col p-3 gap-3 justify-between text-center items-center mb-12">
            <div className='text-center w-full'>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Vehicles</h2>
              <p className="text-muted-foreground text-lg">
                Hand-picked premium cars with the best value
              </p>
            </div>
            <Button variant="outline" className="hover-lift" asChild>
              <Link to="/inventory">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.slice(0, 3).map((car) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="hover-lift"
              >
                <Card className="overflow-hidden card-shadow">
                  <div className="relative aspect-video">
                    <img 
                      src={car.media.photos[0]} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                      Featured
                    </Badge>
                    {car.originalPrice && car.originalPrice > car.price && (
                      <Badge className="absolute top-4 right-4 bg-success text-success-foreground">
                        ₦{(car.originalPrice - car.price).toLocaleString()} Off
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {car.description}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          ₦{car.price.toLocaleString()}
                        </p>
                        {car.originalPrice && car.originalPrice > car.price && (
                          <p className="text-sm text-muted-foreground line-through">
                            ₦{car.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline">{car.condition}</Badge>
                    </div>
                    <div className="flex gap-2 mb-4">
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
                    <Button className="w-full hover-lift" asChild>
                      <Link to={`/inventory/${car.id}`}>
                        View Details <ChevronRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the Week */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Deal of the Week</h2>
            <p className="text-muted-foreground text-lg">
              Limited time offer - don't miss out!
            </p>
          </div>

          {featuredCars.length > 0 && (
            <Card className="max-w-4xl mx-auto overflow-hidden card-shadow">
              <div className="grid md:grid-cols-2">
                <div className="relative">
                  <img 
                    src={featuredCars[0].media.photos[0]} 
                    alt={`${featuredCars[0].make} ${featuredCars[0].model}`}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground animate-pulse">
                    Deal of the Week
                  </Badge>
                </div>
                <CardContent className="p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-4">
                    {featuredCars[0].year} {featuredCars[0].make} {featuredCars[0].model}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {featuredCars[0].description}
                  </p>
                  <div className="mb-6">
                    <p className="text-3xl font-bold text-primary">
                      ₦{featuredCars[0].price.toLocaleString()}
                    </p>
                    {featuredCars[0].originalPrice && (
                      <p className="text-lg text-muted-foreground line-through">
                        ₦{featuredCars[0].originalPrice.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <Timer className="w-5 h-5 text-destructive" />
                    <span className="text-destructive font-medium">
                      Limited time offer!
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1 hover-lift" asChild>
                      <Link to={`/inventory/${featuredCars[0].id}`}>View Details</Link>
                    </Button>
                    <Button variant="outline" className="flex-1 hover-lift" asChild>
                      <Link to="/loan-calculator">Calculate Loan</Link>
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">New Arrivals</h2>
            <p className="text-muted-foreground text-lg">
              Fresh inventory just added to our showroom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="hover-lift"
              >
                <Card className="overflow-hidden card-shadow">
                  <div className="relative aspect-video">
                    <img 
                      src={car.media.photos[0]} 
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-success text-success-foreground text-xs">
                      New Arrival
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-bold mb-2 text-sm">
                      {car.year} {car.make} {car.model}
                    </h3>
                    <p className="text-lg font-bold text-primary mb-2">
                      ₦{car.price.toLocaleString()}
                    </p>
                    <Button size="sm" className="w-full hover-lift" asChild>
                      <Link to={`/inventory/${car.id}`}>View Details</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Founder Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto overflow-hidden card-shadow">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto">
                <img 
                  src="https://cdn.pmnewsnigeria.com/wp-content/uploads/2024/10/4afa0da8-b1ad-4ab2-bcf0-6b5386b52b31.jpeg" 
                  alt="Jeffrey Okereafor Chinedu"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">Meet Our Founder</h3>
                <blockquote className="text-lg text-muted-foreground mb-6 italic">
                  "Our aim is to revolutionize car ownership in Nigeria, and eventually across Africa. 
                  We want to create a network of computerized showrooms that bring car buying into the 
                  digital age while keeping customer service at the heart of it all."
                </blockquote>
                <div className="mb-6">
                  <h4 className="font-bold">Jeffrey Okereafor Chinedu</h4>
                  <p className="text-muted-foreground">Founder & CEO</p>
                </div>
                <Button className="w-fit hover-lift" asChild>
                  <Link to="/founder">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Jeffworldwide?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Over 11 years of excellence in the Nigerian automotive industry
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">6-Month Warranty</h3>
              <p className="text-muted-foreground">
                Every car comes with our comprehensive 6-month warranty for your peace of mind.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Flexible Financing</h3>
              <p className="text-muted-foreground">
                Pay just 40% down payment and spread the balance over 6-24 months.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-4">Premium Quality</h3>
              <p className="text-muted-foreground">
                Carefully inspected vehicles with transparent history and condition reports.
              </p>
            </motion.div>
          </div>
        </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground text-lg">
              Real experiences from real customers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="card-shadow h-full">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-accent mb-4" />
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "{testimonial.comment}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        <p className="text-xs text-muted-foreground">
                          Purchased: {testimonial.carPurchased}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 hero-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of satisfied customers who found their dream cars with us. 
            Start your journey today with our AI-powered recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto hover-lift"
              asChild
            >
              <Link to="/inventory">Browse Inventory</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary text-lg px-8 py-4 h-auto hover-lift"
              asChild
            >
              <Link to="/ai-recommend">Get AI Recommendation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;