import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Calculator,
  MessageCircle, 
  Phone, 
  Car, 
  Fuel, 
  Calendar, 
  Gauge, 
  Settings, 
  Shield, 
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Copy,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCarStore } from '@/stores/useCarStore';
import { useToast } from '@/hooks/use-toast';
import { geminiModel } from '@/lib/gemini';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const CarDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { cars, favorites, toggleFavorite, filteredCars } = useCarStore();
  
  const [car, setCar] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<Array<{role: 'user' | 'ai', content: string}>>([]);
  const [userMessage, setUserMessage] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [similarCars, setSimilarCars] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    // Try to find car in store first
    const foundCar = cars.find(c => c.id === id);
    if (foundCar) {
      setCar(foundCar);
      findSimilarCars(foundCar);
      return;
    }

    // If not in store, fetch from Firestore
    const unsubscribe = onSnapshot(doc(db, 'cars', id), (doc) => {
      if (doc.exists()) {
        const carData = { id: doc.id, ...doc.data() };
        setCar(carData);
        findSimilarCars(carData);
      } else {
        setCar(null);
      }
    });

    return () => unsubscribe();
  }, [id, cars]);

  const findSimilarCars = (currentCar: any) => {
    const similar = cars
      .filter(c => 
        c.id !== currentCar.id && 
        c.status === 'Active' &&
        (c.make === currentCar.make || c.condition === currentCar.condition)
      )
      .slice(0, 6);
    setSimilarCars(similar);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Car link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Could not copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleWhatsApp = () => {
    const message = `Hi! I'm interested in the ${car?.year} ${car?.make} ${car?.model} (₦${car?.price?.toLocaleString()}) from Jeffworldwide. Can you provide more details?`;
    const whatsappUrl = `https://wa.me/2348147319668?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAiChat = async () => {
    if (!userMessage.trim() || !car) return;

    const newMessage = { role: 'user' as const, content: userMessage };
    setAiChatMessages(prev => [...prev, newMessage]);
    setUserMessage('');
    setIsAiLoading(true);

    try {
      const prompt = `
        You are a helpful AI assistant for Jeffworldwide Automotive. Answer questions about this specific car:
        
        Car Details:
        - Make: ${car.make}
        - Model: ${car.model}
        - Year: ${car.year}
        - Price: ₦${car.price?.toLocaleString()}
        - Condition: ${car.condition}
        - Mileage: ${car.mileage} km
        - Engine: ${car.engineType}
        - Transmission: ${car.transmission}
        - Color: ${car.color}
        - Features: ${car.features?.standard?.join(', ') || 'Standard features'}
        - Description: ${car.description || 'No additional description'}
        
        User Question: ${userMessage}
        
        Provide helpful, accurate information about this car. If asked about financing, mention our 40% down payment option with 6-24 month payment plans.
      `;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();

      setAiChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    } catch (error) {
      setAiChatMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'Sorry, I encountered an error. Please try again or contact our team directly.' 
      }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const nextImage = () => {
    if (car?.media?.photos?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % car.media.photos.length);
    }
  };

  const prevImage = () => {
    if (car?.media?.photos?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + car.media.photos.length) % car.media.photos.length);
    }
  };

  if (!car) {
    return (
      <div className="min-h-screen pt-20 bg-background">
        <div className="container mx-auto px-4 py-8">
          {car === null ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Car Not Available</h2>
              <p className="text-muted-foreground mb-6">
                This car is no longer available, but we have great alternatives for you!
              </p>
              
              {similarCars.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Similar Cars You Might Like</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {similarCars.map((similarCar) => (
                      <Card key={similarCar.id} className="hover-lift">
                        <CardContent className="p-4">
                          <img
                            src={similarCar.media?.photos?.[0] || '/placeholder.svg'}
                            alt={`${similarCar.make} ${similarCar.model}`}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                          />
                          <h4 className="font-semibold">{similarCar.year} {similarCar.make} {similarCar.model}</h4>
                          <p className="text-xl font-bold text-primary">₦{similarCar.price?.toLocaleString()}</p>
                          <Link to={`/inventory/${similarCar.id}`}>
                            <Button className="w-full mt-3">View Details</Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              <Link to="/inventory">
                <Button className="mt-6">Browse All Cars</Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (car.status !== 'Active') {
    return (
      <div className="min-h-screen pt-20 bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Car Not Available</h2>
            <p className="text-muted-foreground mb-6">
              This car is {car.status.toLowerCase()}, but we have great alternatives!
            </p>
            
            {similarCars.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Similar Cars Available</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {similarCars.map((similarCar) => (
                    <Card key={similarCar.id} className="hover-lift">
                      <CardContent className="p-4">
                        <img
                          src={similarCar.media?.photos?.[0] || '/placeholder.svg'}
                          alt={`${similarCar.make} ${similarCar.model}`}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h4 className="font-semibold">{similarCar.year} {similarCar.make} {similarCar.model}</h4>
                        <p className="text-xl font-bold text-primary">₦{similarCar.price?.toLocaleString()}</p>
                        <Link to={`/inventory/${similarCar.id}`}>
                          <Button className="w-full mt-3">View Details</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-6 hover-lift"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Inventory
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={car.media?.photos?.[currentImageIndex] || '/placeholder.svg'}
                alt={`${car.make} ${car.model}`}
                className="w-full h-[400px] object-cover rounded-lg cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              />
              
              {car.media?.photos?.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                onClick={() => setIsImageModalOpen(true)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Thumbnail Gallery */}
            {car.media?.photos?.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {car.media.photos.map((photo: string, index: number) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${car.make} ${car.model} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer flex-shrink-0 ${
                      index === currentImageIndex ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Car Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant={car.condition === 'Brand New' ? 'default' : 'secondary'}>
                  {car.condition}
                </Badge>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleFavorite(car.id)}
                    className={favorites.includes(car.id) ? 'text-red-500' : ''}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold mb-2">
                {car.year} {car.make} {car.model}
              </h1>
              
              <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{car.location || 'Lagos, Nigeria'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(car.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="text-3xl font-bold text-primary">
                  ₦{car.price?.toLocaleString()}
                </div>
                {car.originalPrice && car.originalPrice > car.price && (
                  <div className="text-lg text-muted-foreground line-through">
                    ₦{car.originalPrice.toLocaleString()}
                  </div>
                )}
                <Badge variant={car.priceType === 'Fixed' ? 'outline' : 'secondary'}>
                  {car.priceType}
                </Badge>
              </div>
            </div>

            {/* Key Specs */}
            <Card>
              <CardHeader>
                <CardTitle>Key Specifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Mileage:</span>
                    <span>{car.mileage?.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Fuel className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Engine:</span>
                    <span>{car.engineType}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Transmission:</span>
                    <span>{car.transmission}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Car className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Color:</span>
                    <span>{car.color}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleWhatsApp} className="hover-lift">
                <Phone className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
              <Link 
                to={`/loan-calculator?carId=${car.id}&price=${car.price}&make=${car.make}&model=${car.model}&year=${car.year}`}
              >
                <Button variant="outline" className="w-full hover-lift">
                  <Calculator className="w-4 h-4 mr-2" />
                  Loan Calculator
                </Button>
              </Link>
            </div>

            {/* AI Chat Button */}
            <Dialog open={aiChatOpen} onOpenChange={setAiChatOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full hover-lift">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Ask AI About This Car
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl h-[600px] flex flex-col">
                <DialogHeader>
                  <DialogTitle>AI Assistant - {car.year} {car.make} {car.model}</DialogTitle>
                  <DialogDescription>
                    Ask me anything about this car's specifications, features, or value.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-muted/50 rounded-lg">
                  {aiChatMessages.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      <MessageCircle className="w-12 h-12 mx-auto mb-4" />
                      <p>Start a conversation about this {car.make} {car.model}!</p>
                    </div>
                  )}
                  
                  {aiChatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-background border'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  ))}
                  
                  {isAiLoading && (
                    <div className="flex justify-start">
                      <div className="bg-background border p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100"></div>
                          <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Input
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Ask about features, price, specifications..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAiChat()}
                    disabled={isAiLoading}
                  />
                  <Button 
                    onClick={handleAiChat} 
                    disabled={!userMessage.trim() || isAiLoading}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="description">
                <AccordionTrigger className="text-lg font-semibold">
                  Description & Overview
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {car.description || `Experience the perfect blend of performance and style with this ${car.year} ${car.make} ${car.model}. This ${car.condition.toLowerCase()} vehicle represents exceptional value in today's market.`}
                  </p>
                  {car.conditionDescription && (
                    <div>
                      <h4 className="font-medium mb-2">Condition Details:</h4>
                      <p className="text-muted-foreground">{car.conditionDescription}</p>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="features">
                <AccordionTrigger className="text-lg font-semibold">
                  Features & Equipment
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {car.features?.standard?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                          Standard Features
                        </h4>
                        <ul className="space-y-1">
                          {car.features.standard.map((feature: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {car.features?.optional?.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-3 flex items-center">
                          <Settings className="w-4 h-4 mr-2 text-blue-600" />
                          Optional Features
                        </h4>
                        <ul className="space-y-1">
                          {car.features.optional.map((feature: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {car.features?.safety?.length > 0 && (
                      <div className="md:col-span-2">
                        <h4 className="font-medium mb-3 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-green-600" />
                          Safety Features
                        </h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-1">
                          {car.features.safety.map((feature: string, index: number) => (
                            <li key={index} className="text-sm text-muted-foreground flex items-center">
                              <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="technical">
                <AccordionTrigger className="text-lg font-semibold">
                  Technical Specifications
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">VIN:</span>
                        <span className="font-mono text-sm">{car.vin || 'Available on request'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Production Date:</span>
                        <span>{car.productionDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trim Level:</span>
                        <span>{car.trim || 'Standard'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Engine Type:</span>
                        <span>{car.engineType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transmission:</span>
                        <span>{car.transmission}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exterior Color:</span>
                        <span>{car.color}</span>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {car.history && (
                <AccordionItem value="history">
                  <AccordionTrigger className="text-lg font-semibold">
                    Vehicle History
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">{car.history}</p>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="w-5 h-5 mr-2" />
                  Financing Available
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ₦{Math.round(car.price * 0.4).toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Down payment (40%)</p>
                </div>
                
                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Loan Amount:</span>
                    <span>₦{Math.round(car.price * 0.6).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>6-24 months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Interest Rate:</span>
                    <span>Competitive</span>
                  </div>
                </div>
                
                <Link 
                  to={`/loan-calculator?carId=${car.id}&price=${car.price}&make=${car.make}&model=${car.model}&year=${car.year}`}
                >
                  <Button className="w-full">
                    Calculate Monthly Payment
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Dealer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="font-medium">Jeffworldwide Automotive</p>
                  <p className="text-sm text-muted-foreground">
                    Plot 5, Lateef Jakande Road, Ikeja, Lagos
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Phone: {car.contactInfo?.phone || '+234 814 731 9668'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {car.contactInfo?.email || 'jeffrey.okereafor@yahoo.com'}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleWhatsApp}>
                    <Phone className="w-4 h-4 mr-1" />
                    WhatsApp
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = `tel:${car.contactInfo?.phone || '+2348147319668'}`}
                  >
                    Call Now
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Warranty Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  6-Month Warranty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Every vehicle comes with our comprehensive 6-month warranty for your peace of mind.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Similar Cars */}
        {similarCars.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Cars You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCars.map((similarCar) => (
                <Card key={similarCar.id} className="hover-lift">
                  <CardContent className="p-4">
                    <img
                      src={similarCar.media?.photos?.[0] || '/placeholder.svg'}
                      alt={`${similarCar.make} ${similarCar.model}`}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <Badge className="mb-2">{similarCar.condition}</Badge>
                    <h3 className="font-semibold mb-1">
                      {similarCar.year} {similarCar.make} {similarCar.model}
                    </h3>
                    <p className="text-xl font-bold text-primary mb-3">
                      ₦{similarCar.price?.toLocaleString()}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <Link to={`/inventory/${similarCar.id}`}>
                        <Button size="sm" className="w-full">View Details</Button>
                      </Link>
                      <Link 
                        to={`/loan-calculator?carId=${similarCar.id}&price=${similarCar.price}&make=${similarCar.make}&model=${similarCar.model}&year=${similarCar.year}`}
                      >
                        <Button variant="outline" size="sm" className="w-full">
                          <Calculator className="w-3 h-3 mr-1" />
                          Loan
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <div className="relative w-full h-full">
            <img
              src={car.media?.photos?.[currentImageIndex] || '/placeholder.svg'}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-contain"
            />
            
            {car.media?.photos?.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {car.media.photos.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CarDetails;