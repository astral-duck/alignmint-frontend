import React, { useState } from 'react';
import { Heart, CreditCard, DollarSign, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface VideoBombLandingPageProps {
  videoBombId: string;
  videoUrl: string;
  title: string;
  nonprofitName: string;
}

// Mock nonprofit data
const getNonprofitData = (name: string) => {
  const defaultData = {
    mission: "We're dedicated to making a positive impact in our community through compassionate service and sustainable programs.",
    impact: [
      "500+ families served this year",
      "100+ volunteers engaged monthly",
      "15 community programs active",
    ],
    imageUrl: "https://images.unsplash.com/photo-1697665387559-253e7a645e96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub25wcm9maXQlMjBjb21tdW5pdHklMjBoZWxwfGVufDF8fHx8MTc2MDY2NDYyNnww&ixlib=rb-4.1.0&q=80&w=1080",
  };

  return defaultData;
};

export const VideoBombLandingPage: React.FC<VideoBombLandingPageProps> = ({
  videoBombId,
  videoUrl,
  title,
  nonprofitName,
}) => {
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
  const [cryptoEnabled, setCryptoEnabled] = useState(false);
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: '',
    message: '',
  });

  const nonprofitData = getNonprofitData(nonprofitName);
  const presetAmounts = ['25', '50', '100', '250', '500'];

  const handleDonate = () => {
    const finalAmount = amount === 'custom' ? customAmount : amount;
    
    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      toast.error('Please select or enter a valid amount');
      return;
    }

    if (!donorInfo.name || !donorInfo.email) {
      toast.error('Please fill in your contact information');
      return;
    }

    // Mock donation processing
    toast.success(`Thank you for your ${donationType === 'monthly' ? 'monthly' : ''} donation of $${finalAmount}!`);
    
    // Reset form
    setAmount('');
    setCustomAmount('');
    setDonorInfo({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D]">
      {/* Header */}
      <header className="bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h2 className="text-gray-900 dark:text-gray-100">{nonprofitName}</h2>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Hero Image */}
          <div className="rounded-lg overflow-hidden">
            <ImageWithFallback
              src={nonprofitData.imageUrl}
              alt={nonprofitName}
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Title and Mission */}
          <div className="text-center space-y-4">
            <h1 className="text-gray-900 dark:text-gray-100">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {nonprofitData.mission}
            </p>
          </div>

          {/* Video */}
          <Card>
            <CardContent className="p-6">
              <div className="aspect-video bg-gray-100 dark:bg-[#1F1F1F] rounded-lg overflow-hidden">
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full"
                  poster={nonprofitData.imageUrl}
                />
              </div>
            </CardContent>
          </Card>

          {/* Impact Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Our Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {nonprofitData.impact.map((stat, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700 dark:text-gray-300">{stat}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Donation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Make a Donation
              </CardTitle>
              <CardDescription>
                Your support helps us continue our mission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Donation Type */}
              <div>
                <Label>Donation Type</Label>
                <RadioGroup
                  value={donationType}
                  onValueChange={(value: 'one-time' | 'monthly') => setDonationType(value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="one-time" id="one-time" />
                    <Label htmlFor="one-time" className="cursor-pointer">One-time</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer">Monthly</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Preset Amounts */}
              <div>
                <Label>Select Amount</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                  {presetAmounts.map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant={amount === preset ? 'default' : 'outline'}
                      onClick={() => {
                        setAmount(preset);
                        setCustomAmount('');
                      }}
                      className="w-full"
                    >
                      ${preset}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <Label htmlFor="custom-amount">Custom Amount</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount('custom');
                    }}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Cryptocurrency Option */}
              <div className="flex items-center space-x-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <Checkbox
                  id="crypto"
                  checked={cryptoEnabled}
                  onCheckedChange={(checked) => setCryptoEnabled(checked as boolean)}
                />
                <div className="flex-1">
                  <Label
                    htmlFor="crypto"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <CreditCard className="h-4 w-4" />
                    Accept Cryptocurrency Donations
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Bitcoin, Ethereum, and other cryptocurrencies
                  </p>
                </div>
              </div>

              {/* Donor Information */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <Label htmlFor="donor-name">Full Name</Label>
                  <Input
                    id="donor-name"
                    placeholder="John Doe"
                    value={donorInfo.name}
                    onChange={(e) => setDonorInfo({ ...donorInfo, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="donor-email">Email</Label>
                  <Input
                    id="donor-email"
                    type="email"
                    placeholder="john@example.com"
                    value={donorInfo.email}
                    onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="donor-message">Message (Optional)</Label>
                  <Input
                    id="donor-message"
                    placeholder="Leave a message of support"
                    value={donorInfo.message}
                    onChange={(e) => setDonorInfo({ ...donorInfo, message: e.target.value })}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button onClick={handleDonate} className="w-full" size="lg">
                <Heart className="h-4 w-4 mr-2" />
                Complete Donation
                {(amount || customAmount) && (
                  <span className="ml-2">
                    ${amount === 'custom' ? customAmount : amount}
                    {donationType === 'monthly' && '/month'}
                  </span>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 pb-8">
            <p>Your donation is tax-deductible to the extent allowed by law.</p>
            <p className="mt-2">© 2025 {nonprofitName}. All rights reserved.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
