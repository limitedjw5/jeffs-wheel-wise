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
      image: "https://i.ibb.co/VpzYnQz/toyota-camry-1.jpg",
      cta: "Browse Inventory"
    },
    {
      title: "AI-Powered Recommendations",
      subtitle: "Let our AI find the ideal car for you",
      image: "https://i.ibb.co/9WxP2Hj/mercedes-c-class-1.jpg",
      cta: "Get AI Recommendation"
    },
    {
      title: "Flexible Car Financing",
      subtitle: "Pay 40% down, spread the rest over 6-24 months",
      image: "https://i.ibb.co/dGPqx8w/bmw-x5-1.jpg",
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
      <section className="relative h-screen overflow-hidden">
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
                <div className="absolute inset-0 hero-gradient opacity-80" />
                
                <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
                  <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-bold mb-6"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl mb-8 opacity-90"
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
                      className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4 h-auto hover-lift"
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
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-20">
          <Card className="card-shadow bg-white/95 backdrop-blur-md">
            <CardContent className="p-6">
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

      {/* Brand Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Brand</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose from premium brands we trust and our customers love
            </p>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
            {carBrands.slice(0, 20).map((brand) => (
              <motion.button
                key={brand}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBrand(brand)}
                className={`p-4 rounded-lg border-2 smooth-transition hover-lift ${
                  selectedBrand === brand 
                    ? 'border-primary bg-primary text-primary-foreground' 
                    : 'border-border hover:border-primary'
                }`}
              >
                <span className="font-medium text-sm">{brand}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Cars */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
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

      {/* Deal of the Day */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Deal of the Day</h2>
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
                    Deal of the Day
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