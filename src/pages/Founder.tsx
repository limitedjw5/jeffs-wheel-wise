import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, MapPin, Users, Target, Lightbulb, TrendingUp, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Founder: React.FC = () => {
  const achievements = [
    {
      icon: Calendar,
      title: "11+ Years Experience",
      description: "Over a decade of excellence in the Nigerian automotive industry"
    },
    {
      icon: MapPin,
      title: "Multi-City Presence",
      description: "Showrooms across Lagos, Ibadan, and Port Harcourt"
    },
    {
      icon: Users,
      title: "Thousands of Customers",
      description: "Successfully served customers across Nigeria"
    },
    {
      icon: Lightbulb,
      title: "Innovation Leader",
      description: "Pioneer of computerized automotive showrooms in Nigeria"
    }
  ];

  const timeline = [
    {
      year: "2013",
      title: "The Beginning",
      description: "Started with posting car sales online for dealers, bridging the gap between buyers and sellers using digital tools."
    },
    {
      year: "2015",
      title: "First Inventory",
      description: "Acquired first few cars and transitioned from online sales to direct ownership, gaining control over the buying process."
    },
    {
      year: "2018",
      title: "Showroom Innovation",
      description: "Opened first showroom with interactive digital features, setting new industry standards."
    },
    {
      year: "2019",
      title: "Company Registration",
      description: "Officially registered Jeff Business Concept Worldwide Limited (RC: 1555217) with headquarters in Lagos."
    },
    {
      year: "2021",
      title: "Expansion Phase",
      description: "Expanded operations to Ibadan and Port Harcourt, bringing accessible automotive solutions across Nigeria."
    },
    {
      year: "2024",
      title: "Digital Transformation",
      description: "Leading the industry with AI-powered recommendations and fully digital car-buying experiences."
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "Building trust through transparency and honest business practices"
    },
    {
      icon: Target,
      title: "Customer Focus",
      description: "Putting customer satisfaction at the heart of everything we do"
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Continuously advancing technology to improve the car-buying experience"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Maintaining the highest standards in automotive sales and service"
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="relative inline-block mb-8">
            <img
              src="https://cdn.pmnewsnigeria.com/wp-content/uploads/2024/10/4afa0da8-b1ad-4ab2-bcf0-6b5386b52b31.jpeg"
              alt="Jeffrey Okereafor Chinedu - Founder & Director"
              className="w-48 h-48 mx-auto rounded-full object-cover shadow-2xl ring-4 ring-primary/20"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-3">
              <Award className="w-6 h-6" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Jeffrey Okereafor Chinedu
          </h1>
          
          <div className="flex justify-center space-x-2 mb-6">
            <Badge variant="default" className="text-sm">Founder & Director</Badge>
            <Badge variant="secondary" className="text-sm">Automotive Innovator</Badge>
            <Badge variant="outline" className="text-sm">Industry Pioneer</Badge>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A dynamic entrepreneur and innovator leading the transformation of Nigeria's automotive industry
            through technology, integrity, and exceptional service.
          </p>
        </motion.div>

        {/* Achievement Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {achievements.map((achievement, index) => (
            <Card key={index} className="hover-lift bg-gradient-to-br from-background to-muted/50">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <achievement.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground">{achievement.description}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl mb-4">The Visionary's Journey</CardTitle>
                <CardDescription className="text-base">
                  From humble beginnings to industry leadership
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Jeffrey Okereafor Chinedu is the Founder and Director of Jeff Business Concept Worldwide Limited (Jeffworldwide). 
                    With over 11 years of experience in the business, his leadership has been instrumental in shaping a brand known 
                    for integrity, technology, and exceptional service.
                  </p>
                  
                  <p>
                    Jeffrey began with a simple but powerful mission: to transform the car buying experience in Nigeria by making 
                    it more transparent and accessible. What started with a small inventory of personally 
                    acquired vehicles has grown into a nationwide enterprise.
                  </p>
                  
                  <p>
                    His forward-thinking approach led to the development of computerized showrooms equipped spaces that 
                    allow customers to explore car options, view specifications, and make informed decisions in a seamless, 
                    interactive environment.
                  </p>
                  
                  <p>
                    Today, customers enjoy flexible car financing options, with as little as 40% required upfront and the balance 
                    spread across 6 to 24 months. In addition to sales, Jeffworldwide offers car importation and sourcing services, 
                    backed by a six-month warranty on every vehicle.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Company Values */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-2xl mb-4">Core Values & Philosophy</CardTitle>
                <CardDescription className="text-base">
                  The principles that drive our success
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {values.map((value, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{value.title}</h4>
                      <p className="text-sm text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">Journey to Excellence</CardTitle>
              <CardDescription className="text-lg">
                Key milestones in building Nigeria's premier automotive company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-accent hidden md:block"></div>
                
                <div className="space-y-8">
                  {timeline.map((milestone, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      className="relative flex items-start space-x-6"
                    >
                      {/* Timeline Dot */}
                      <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 relative z-10">
                        {milestone.year}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pb-8">
                        <div className="bg-gradient-to-br from-background to-muted/30 rounded-lg p-6 border">
                          <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                          <p className="text-muted-foreground leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20">
            <CardContent className="p-12">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-gradient">Vision for the Future</h2>
                
                <blockquote className="text-2xl font-medium italic text-muted-foreground mb-8 leading-relaxed">
                  "To revolutionize car ownership across Nigeria and Africa by combining digital innovation 
                  with human-centered service, setting new standards in the industry and delivering value 
                  to every customer."
                </blockquote>
                
                <div className="flex items-center justify-center space-x-4">
                  <Separator className="flex-1 max-w-24" />
                  <div className="text-sm font-medium text-muted-foreground">Jeffrey Okereafor Chinedu</div>
                  <Separator className="flex-1 max-w-24" />
                </div>
                
                <p className="text-lg text-muted-foreground mt-6">
                  His passion, experience, and leadership continue to drive Jeffworldwide forward—setting new 
                  standards in the industry and delivering exceptional value to every customer.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Company Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Headquarters</h3>
              <p className="text-sm text-muted-foreground">
                Plot 5, Lateef Jakande Road<br />
                Ikeja, Lagos, Nigeria
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Established</h3>
              <p className="text-sm text-muted-foreground">
                Incorporated: January 23, 2019<br />
                RC Number: 1555217
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Commitment</h3>
              <p className="text-sm text-muted-foreground">
                6-Month Warranty<br />
                Flexible Financing Options
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Founder;