import React, { useState } from 'react';
import { DonorPageConfig } from './DonorPageBuilder';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  ArrowLeft,
  Heart,
  CreditCard,
  Calendar,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

interface DonorPagePreviewProps {
  config: DonorPageConfig;
  onBack: () => void;
}

export const DonorPagePreview: React.FC<DonorPagePreviewProps> = ({ config, onBack }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form states
  const [donorInfo, setDonorInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const currentAmount = selectedAmount || (customAmount ? parseFloat(customAmount) : 0);
  const currentProgress = 33; // Mock progress
  const raisedAmount = Math.floor(config.goalAmount * (currentProgress / 100));

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleDonate = () => {
    if (!currentAmount || currentAmount <= 0) {
      toast.error('Please select or enter a donation amount');
      return;
    }

    if (!donorInfo.firstName || !donorInfo.lastName || !donorInfo.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Show success message
    setShowSuccess(true);
    toast.success(`Thank you for your ${isRecurring ? 'monthly' : ''} donation of $${currentAmount}!`);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D]">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-8 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2>Thank You for Your Donation!</h2>
              <p className="text-gray-600 dark:text-gray-400">{config.thankYouMessage}</p>
              <div className="pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  A receipt has been sent to your email.
                </p>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p>
                    Donation Amount: ${currentAmount}
                    {isRecurring && ' / month'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    To: {config.entityName}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-center pt-4">
                <Button onClick={onBack} variant="outline">
                  Return to Dashboard
                </Button>
                <Button onClick={() => setShowSuccess(false)}>Make Another Donation</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0D0D0D]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1A1A] border-b dark:border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-lg">{config.entityName}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Donation Page</p>
            </div>
          </div>
          <Badge variant="outline" className="gap-1">
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            Secure Donation
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Campaign Info */}
          <div className="space-y-6">
            {/* Hero Image */}
            <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
              <img
                src={config.heroImage}
                alt={config.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Campaign Details */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <h1>{config.title}</h1>
                <p className="text-gray-600 dark:text-gray-400">{config.description}</p>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <p className="text-2xl">${raisedAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        raised of ${config.goalAmount.toLocaleString()} goal
                      </p>
                    </div>
                    <Badge variant="outline">{currentProgress}% funded</Badge>
                  </div>
                  <Progress value={currentProgress} className="h-3" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-2xl">247</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Donors</p>
                  </div>
                  <div>
                    <p className="text-2xl">15</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Days left</p>
                  </div>
                  <div>
                    <p className="text-2xl">${Math.floor(raisedAmount / 247)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Avg donation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3>About This Campaign</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    Every donation makes a direct impact on our community. Your support helps us:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>Provide essential services to those in need</li>
                    <li>Expand our programs and reach more people</li>
                    <li>Create sustainable solutions for lasting change</li>
                    <li>Build a stronger, more connected community</li>
                  </ul>
                  <p className="pt-2">
                    All donations are tax-deductible to the extent allowed by law.
                    Tax ID: 12-3456789
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Donation Form */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h3>Make a Donation</h3>

                {/* Donation Amounts */}
                <div className="space-y-3">
                  <Label>Select Amount</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {config.suggestedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        variant={selectedAmount === amount ? 'default' : 'outline'}
                        onClick={() => handleAmountSelect(amount)}
                        className="h-12"
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  {config.allowCustomAmount && (
                    <div className="space-y-2">
                      <Label htmlFor="custom">Custom Amount</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <Input
                          id="custom"
                          type="number"
                          placeholder="Enter amount"
                          value={customAmount}
                          onChange={(e) => handleCustomAmountChange(e.target.value)}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Recurring Option */}
                {config.allowRecurring && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={isRecurring}
                      onChange={(e) => setIsRecurring(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="recurring" className="flex items-center gap-2 font-normal cursor-pointer">
                      <Calendar className="h-4 w-4" />
                      Make this a monthly recurring donation
                    </Label>
                  </div>
                )}

                {/* Payment Form - Credit Card */}
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={donorInfo.firstName}
                          onChange={(e) =>
                            setDonorInfo({ ...donorInfo, firstName: e.target.value })
                          }
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={donorInfo.lastName}
                          onChange={(e) =>
                            setDonorInfo({ ...donorInfo, lastName: e.target.value })
                          }
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={donorInfo.email}
                        onChange={(e) => setDonorInfo({ ...donorInfo, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        value={donorInfo.cardNumber}
                        onChange={(e) =>
                          setDonorInfo({ ...donorInfo, cardNumber: e.target.value })
                        }
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Expiry</Label>
                        <Input
                          id="expiry"
                          value={donorInfo.expiry}
                          onChange={(e) => setDonorInfo({ ...donorInfo, expiry: e.target.value })}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          value={donorInfo.cvv}
                          onChange={(e) => setDonorInfo({ ...donorInfo, cvv: e.target.value })}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>

                {/* Donate Button */}
                <Button
                  onClick={handleDonate}
                  className="w-full h-12 gap-2"
                  disabled={!currentAmount || currentAmount <= 0}
                >
                  <Heart className="h-4 w-4" />
                  Donate {currentAmount > 0 && `$${currentAmount}`}
                  {isRecurring && '/mo'}
                </Button>

                <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                  Your donation is secure and encrypted. We never store your payment information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
