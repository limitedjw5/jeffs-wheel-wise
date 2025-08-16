import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Instagram, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/stores/useThemeStore';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();
    const { isDark } = useThemeStore();
  

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    
    try {
      // In a real app, this would save to Firebase
      // For now, we'll simulate the subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscribed!",
        description: "Thank you for joining our customer circle. You'll receive the latest updates and exclusive offers.",
        variant: "default",
      });
      
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/founder' },
      { name: 'Our Team', href: '/team' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#contact' },
    ],
    services: [
      { name: 'Buy Cars', href: '/inventory' },
      { name: 'Car Financing', href: '/loan-calculator' },
      { name: 'AI Recommendations', href: '/ai-recommend' },
      { name: 'Car Import', href: '#' },
    ],
    support: [
      { name: 'Customer Service', href: '#' },
      { name: 'Warranty', href: '#' },
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
    ],
  };

  return (
    <footer className="bg-secondary mt-5 text-secondary-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Join Our Customer Circle</h3>
            <p className="text-muted-foreground mb-6">
              Get exclusive access to new arrivals, special deals, and automotive insights
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="hover-lift"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2">
               <div className="w-80 mb-3 flex items-center justify-center">
                {isDark ? <img src="/dark.png" alt="logo" className="w-50 h-15 text-white" /> :
                <img src="/light.png" alt="logo" className="w-50 h-15 text-white" /> }
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Nigeria's premier digital car dealership, revolutionizing car ownership 
              with innovative technology, transparent pricing, and exceptional customer service 
              for over 11 years.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-accent" />
                <span className="text-sm">Plot 5, Lateef Jakande Road, Ikeja, Lagos</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-sm">08147319668</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="text-sm">jeffrey.okereafor@yahoo.com</span>
              </div>
            </div>

            {/* RC Number */}
            <div className="mt-6 rounded-lg">
              <p className="text-sm font-medium">RC Number: 1555217</p>
              <p className="text-xs text-muted-foreground">Registered: 23 Jan 2019</p>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-semibold mb-4">Our Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent smooth-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent smooth-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-accent smooth-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-medium mb-3">Follow Us</h4>
              <div className="flex space-x-2">
                <a 
                  href="https://instagram.com/jeffworldwide_" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2  rounded-lg smooth-transition hover-lift"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="#" 
                  className="p-2 rounded-lg smooth-transition hover-lift"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Jeff Business Concept Worldwide Limited. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">
                6-Month Warranty • 40% Down Payment • Flexible Financing
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;