import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Send, 
  RotateCcw, 
  Car, 
  DollarSign, 
  Filter, 
  Sparkles, 
  MessageCircle,
  TrendingUp,
  Target,
  Star,
  ArrowRight,
  Calculator,
  Heart,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useCarStore } from '@/stores/useCarStore';
import { useToast } from '@/hooks/use-toast';
import { getCarRecommendations, CarRecommendation } from '@/lib/gemini';
import { Link } from 'react-router-dom';

const AIRecommend: React.FC = () => {
  const { toast } = useToast();
  const { cars, toggleFavorite, favorites } = useCarStore();
  
  const [budget, setBudget] = useState([5000000]);
  const [carType, setCarType] = useState('');
  const [requirements, setRequirements] = useState('');
  const [recommendations, setRecommendations] = useState<CarRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{
    type: 'user' | 'ai';
    budget: number;
    carType: string;
    requirements: string;
    recommendations?: CarRecommendation[];
    timestamp: Date;
  }>>([]);

  const carTypes = [
    'Sedan',
    'SUV',
    'Hatchback',
    'Convertible',
    'Pickup Truck',
    'Minivan',
    'Luxury Car',
    'Sports Car',
    'Crossover',
    'Wagon'
  ];

  const popularRequirements = [
    'Family-friendly with good safety features',
    'Fuel efficient for daily commuting',
    'Luxury features and comfort',
    'Good for long distance travel',
    'Low maintenance and reliable',
    'Sporty and performance-oriented',
    'Spacious cargo area',
    'Good resale value',
    'Latest technology features',
    'Off-road capable'
  ];

  useEffect(() => {
    // Load chat history from localStorage
    const savedHistory = localStorage.getItem('ai-recommend-history');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setChatHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    }
  }, []);

  const saveToHistory = (entry: any) => {
    const newHistory = [entry, ...chatHistory].slice(0, 10); // Keep last 10 searches
    setChatHistory(newHistory);
    localStorage.setItem('ai-recommend-history', JSON.stringify(newHistory));
  };

  const handleGetRecommendations = async () => {
    if (!carType || !requirements.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a car type and describe your requirements.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const userEntry = {
        type: 'user' as const,
        budget: budget[0],
        carType,
        requirements,
        timestamp: new Date()
      };

      const aiRecommendations = await getCarRecommendations(
        budget[0],
        carType,
        requirements,
        cars.filter(car => car.status === 'Active')
      );

      if (aiRecommendations.length === 0) {
        toast({
          title: "No Matches Found",
          description: "No cars match your criteria. Try adjusting your budget or requirements.",
          variant: "destructive",
        });
        return;
      }

      setRecommendations(aiRecommendations);
      
      const aiEntry = {
        type: 'ai' as const,
        budget: budget[0],
        carType,
        requirements,
        recommendations: aiRecommendations,
        timestamp: new Date()
      };

      saveToHistory(aiEntry);

      toast({
        title: "Recommendations Ready!",
        description: `Found ${aiRecommendations.length} perfect matches for you.`,
      });

    } catch (error) {
      console.error('AI Recommendation Error:', error);
      toast({
        title: "Error",
        description: "Failed to get AI recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBudget([5000000]);
    setCarType('');
    setRequirements('');
    setRecommendations([]);
  };

  const clearHistory = () => {
    setChatHistory([]);
    localStorage.removeItem('ai-recommend-history');
    toast({
      title: "History Cleared",
      description: "Your search history has been cleared.",
    });
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (score: number) => {
    if (score >= 80) return { variant: 'default' as const, text: 'Excellent Match' };
    if (score >= 60) return { variant: 'secondary' as const, text: 'Good Match' };
    return { variant: 'outline' as const, text: 'Consider' };
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            AI Car Recommendations
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Let our advanced AI help you find the perfect car based on your budget, preferences, and requirements.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2" />
                  Your Preferences
                </CardTitle>
                <CardDescription>
                  Tell us what you're looking for and we'll find the perfect match
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Budget Slider */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Budget: ₦{budget[0].toLocaleString()}
                  </label>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    max={50000000}
                    min={1000000}
                    step={500000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₦1M</span>
                    <span>₦50M</span>
                  </div>
                </div>

                {/* Car Type */}
                <div>
                  <label className="text-sm font-medium mb-3 block">Car Type</label>
                  <Select value={carType} onValueChange={setCarType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select car type" />
                    </SelectTrigger>
                    <SelectContent>
                      {carTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Requirements */}
                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Your Requirements
                  </label>
                  <Textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Describe what you're looking for..."
                    className="min-h-[100px]"
                  />
                  
                  {/* Popular Requirements */}
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-2">Popular requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {popularRequirements.slice(0, 6).map((req, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer text-xs hover:bg-muted"
                          onClick={() => setRequirements(req)}
                        >
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleGetRecommendations}
                    disabled={isLoading || !carType || !requirements.trim()}
                    className="w-full hover-lift"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Getting Recommendations...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get AI Recommendations
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Form
                  </Button>
                </div>

                {/* Quick Stats */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Quick Facts</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Available Cars:</span>
                      <span>{cars.filter(c => c.status === 'Active').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Accuracy:</span>
                      <span>95%+</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Response Time:</span>
                      <span>&lt; 5 seconds</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            {recommendations.length > 0 ? (
              <div className="space-y-6">
                {/* Results Header */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Perfect Matches Found!
                        </h2>
                        <p className="text-muted-foreground">
                          Based on your budget of ₦{budget[0].toLocaleString()} for a {carType}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">
                          {recommendations.length}
                        </div>
                        <p className="text-sm text-muted-foreground">recommendations</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations Grid */}
                <div className="space-y-6">
                  {recommendations.map((rec, index) => {
                    const car = cars.find(c => c.id === rec.id);
                    if (!car) return null;

                    const confidenceBadge = getConfidenceBadge(rec.confidenceScore);

                    return (
                      <motion.div
                        key={rec.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                      >
                        <Card className="overflow-hidden hover-lift">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                            {/* Image */}
                            <div className="relative">
                              <img
                                src={car.media?.photos?.[0] || '/placeholder.svg'}
                                alt={`${car.make} ${car.model}`}
                                className="w-full h-64 md:h-full object-cover"
                              />
                              <div className="absolute top-4 left-4">
                                <Badge variant={confidenceBadge.variant}>
                                  {confidenceBadge.text}
                                </Badge>
                              </div>
                              <div className="absolute top-4 right-4">
                                <div className={`text-sm font-bold ${getConfidenceColor(rec.confidenceScore)}`}>
                                  {rec.confidenceScore}% match
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="md:col-span-2 p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <Badge className="mb-2">{car.condition}</Badge>
                                  <h3 className="text-xl font-bold mb-1">
                                    {car.year} {car.make} {car.model}
                                  </h3>
                                  <div className="text-2xl font-bold text-primary">
                                    ₦{car.price?.toLocaleString()}
                                  </div>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => toggleFavorite(car.id)}
                                    className={favorites.includes(car.id) ? 'text-red-500' : ''}
                                  >
                                    <Heart className={`w-4 h-4 ${favorites.includes(car.id) ? 'fill-current' : ''}`} />
                                  </Button>
                                  <Button variant="outline" size="icon">
                                    <Share2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>

                              {/* AI Reasoning */}
                              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                                <h4 className="font-medium mb-2 flex items-center">
                                  <Brain className="w-4 h-4 mr-2 text-primary" />
                                  Why this car matches you:
                                </h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {rec.reasoning}
                                </p>
                              </div>

                              {/* Key Specs */}
                              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Mileage:</span>
                                  <span>{car.mileage?.toLocaleString()} km</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Engine:</span>
                                  <span>{car.engineType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Transmission:</span>
                                  <span>{car.transmission}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Color:</span>
                                  <span>{car.color}</span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex space-x-2">
                                <Link to={`/inventory/${car.id}`} className="flex-1">
                                  <Button className="w-full">
                                    View Details
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                  </Button>
                                </Link>
                                <Link 
                                  to={`/loan-calculator?carId=${car.id}&price=${car.price}&make=${car.make}&model=${car.model}&year=${car.year}`}
                                >
                                  <Button variant="outline">
                                    <Calculator className="w-4 h-4 mr-1" />
                                    Loan Calc
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Card className="h-[400px] flex items-center justify-center">
                <CardContent className="text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Ready to Find Your Perfect Car?</h3>
                  <p className="text-muted-foreground mb-6">
                    Fill out the form on the left to get personalized AI recommendations.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="font-semibold text-primary">1</div>
                      <div className="text-muted-foreground">Set Budget</div>
                    </div>
                    <div>
                      <div className="font-semibold text-primary">2</div>
                      <div className="text-muted-foreground">Choose Type</div>
                    </div>
                    <div>
                      <div className="font-semibold text-primary">3</div>
                      <div className="text-muted-foreground">Get Matches</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search History */}
            {chatHistory.length > 0 && (
              <Card className="mt-8">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Recent Searches
                    </CardTitle>
                    <CardDescription>Your previous AI recommendations</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={clearHistory}>
                    Clear History
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {chatHistory.slice(0, 5).map((entry, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{entry.carType}</Badge>
                            <span className="text-sm text-muted-foreground">
                              ₦{entry.budget.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {entry.timestamp.toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-2">{entry.requirements}</p>
                        {entry.recommendations && (
                          <p className="text-xs text-muted-foreground">
                            Found {entry.recommendations.length} recommendations
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommend;