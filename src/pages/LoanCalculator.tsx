import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calculator, 
  DollarSign, 
  Calendar, 
  Car,
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const LoanCalculator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Form State
  const [carPrice, setCarPrice] = useState<number>(0);
  const [downPayment, setDownPayment] = useState<number>(40);
  const [loanTerm, setLoanTerm] = useState<number>(12);
  const [carMake, setCarMake] = useState<string>('');
  const [carModel, setCarModel] = useState<string>('');
  const [carYear, setCarYear] = useState<string>('');

  // Calculated Values
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [paymentSchedule, setPaymentSchedule] = useState<any[]>([]);

  useEffect(() => {
    // Pre-fill from URL params if available
    const price = searchParams.get('price');
    const make = searchParams.get('make');
    const model = searchParams.get('model');
    const year = searchParams.get('year');

    if (price) setCarPrice(parseInt(price));
    if (make) setCarMake(make);
    if (model) setCarModel(model);
    if (year) setCarYear(year);
  }, [searchParams]);

  useEffect(() => {
    calculateLoan();
  }, [carPrice, downPayment, loanTerm]);

  const calculateLoan = () => {
    if (carPrice <= 0) {
      setMonthlyPayment(0);
      setTotalAmount(0);
      setPaymentSchedule([]);
      return;
    }

    const principal = carPrice * (1 - downPayment / 100);
    const payment = principal / loanTerm;
    
    setMonthlyPayment(payment);
    setTotalAmount(principal);

    // Generate payment schedule
    const schedule = [];
    let remainingBalance = principal;
    
    for (let i = 1; i <= loanTerm; i++) {
      remainingBalance -= payment;
      
      schedule.push({
        month: i,
        payment: payment,
        principal: payment,
        interest: 0,
        balance: Math.max(0, remainingBalance),
        cumulative: payment * i
      });
    }
    
    setPaymentSchedule(schedule);
  };

  const handleWhatsAppApplication = () => {
    const downPaymentAmount = carPrice * (downPayment / 100);
    const loanAmount = carPrice - downPaymentAmount;
    
    const message = `Hi! I'd like to apply for car financing:

Car: ${carYear} ${carMake} ${carModel}
Price: ₦${carPrice.toLocaleString()}
Down Payment (${downPayment}%): ₦${downPaymentAmount.toLocaleString()}
Loan Amount: ₦${loanAmount.toLocaleString()}
Term: ${loanTerm} months
Monthly Payment: ₦${monthlyPayment.toLocaleString()}

Please process my application. Thank you!`;

    const whatsappUrl = `https://wa.me/2348147319668?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Application Sent!",
      description: "Your loan application has been sent via WhatsApp.",
    });
  };

  const loanTermOptions = [6, 12, 18, 24];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
            Our Loan Calculator
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Calculate your monthly payments with our financing aid
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          {/* Calculator Form */}
          <Card className="hover-lift h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Loan Details
              </CardTitle>
              <CardDescription>
                Enter your car and financing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="carPrice">Car Price (₦)</Label>
                  <Input
                    id="carPrice"
                    value={carPrice.toLocaleString('en-US')}
                    onChange={(e) => {
                      const value = e.target.value;
                      const unformattedValue = value.replace(/,/g, '');
                      if (!isNaN(Number(unformattedValue))) {
                        setCarPrice(Number(unformattedValue));
                      }
                    }}
                    placeholder="Enter car price"
                  />
                </div>

                <div className="space-y-2 ">
                  <Label htmlFor="downPayment">Down Payment ({downPayment}%)</Label>
                  <Slider
                    id="downPayment"
                    defaultValue={[downPayment]}
                    min={40}
                    max={80}
                    step={5}
                    onValueChange={(value) => setDownPayment(value[0])}
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>40%</span>
                    <span>80%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Loan Term (months)</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {loanTermOptions.map((term) => (
                      <Button
                        key={term}
                        variant={loanTerm === term ? 'default' : 'outline'}
                        onClick={() => setLoanTerm(term)}
                        className="py-1 h-auto"
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="hidden grid-cols-1 md:grid-cols-2 gap-4">
                {carMake && <div className="space-y-2">
                  <Label htmlFor="carMake">Make</Label>
                  <Input
                    id="carMake"
                    value={carMake}
                    onChange={(e) => setCarMake(e.target.value)}
                    placeholder="e.g. Toyota" disabled
                  />
                </div>}
                 {carModel && <div className="space-y-2">
                    <Label htmlFor="carModel">Model</Label>
                    <Input
                      id="carModel"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      placeholder="e.g. Camry" disabled
                    />
                  </div>}
                </div>

               {carYear && <div className="hidden space-y-2">
                  <Label htmlFor="carYear">Year</Label>
                  <Input
                    id="carYear"
                    value={carYear}
                    onChange={(e) => setCarYear(e.target.value)}
                    placeholder="e.g. 2023" disabled
                  />
                </div>}
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="hover-lift h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Payment Summary
              </CardTitle>
              <CardDescription>
                Your estimated monthly payment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 md:space-y-6">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-3xl font-bold text-primary">
                    ₦{monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Car Price</p>
                    <p>₦{carPrice.toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Down Payment ({downPayment}%)</p>
                    <p>₦{(carPrice * (downPayment / 100)).toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Loan Amount</p>
                    <p>₦{(carPrice * (1 - downPayment / 100)).toLocaleString()}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-muted-foreground">Loan Term</p>
                    <p>{loanTerm} months</p>
                  </div>
                  <div className="flex justify-between font-medium">
                    <p>Total Amount</p>
                    <p>₦{totalAmount.toLocaleString()}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="h-48 md:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={paymentSchedule}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`₦${value.toLocaleString()}`, 'Balance']}
                          labelFormatter={(month) => `Month ${month}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="balance"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                          activeDot={{ r: 5 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    Remaining balance over time
                  </p>
                </div>

                <Button
                  className="w-full mt-2"
                  size="lg"
                  onClick={handleWhatsAppApplication}
                  disabled={!carPrice || !carMake || !carModel || !carYear}
                >
                  Apply Now <Phone className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Schedule */}
        <Card className="hover-lift h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Payment Schedule
            </CardTitle>
            <CardDescription>
              Detailed breakdown of your monthly payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium">Month</th>
                    <th className="text-right py-3 px-4 text-sm font-medium">Payment</th>
                    <th className="text-right py-3 px-4 text-sm font-medium">Principal</th>
                    <th className="text-right py-3 px-4 text-sm font-medium">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentSchedule.map((payment) => (
                    <tr key={payment.month} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{payment.month}</td>
                      <td className="text-right py-3 px-4">
                        ₦{payment.payment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-right py-3 px-4">
                        ₦{payment.principal.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                      <td className="text-right py-3 px-4">
                        ₦{payment.balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoanCalculator;