import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Calculator, Star, Users, TrendingUp, CreditCard, Lock, Zap, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ExpenseForm from '@/components/ExpenseForm';
import FileUpload from '@/components/FileUpload';

const Index = () => {
  const [activeAction, setActiveAction] = useState<'upload' | 'manual' | null>(null);
  const navigate = useNavigate();

  const promotionStats = [
    { icon: Users, value: '50k+', label: 'Customers Served' },
    { icon: TrendingUp, value: '4.7%', label: 'Extra Returns Provided' },
    { icon: CreditCard, value: '₹20k', label: 'Average Annual Savings' },
  ];

  const features = [
    {
      icon: Lock,
      title: 'Secure & Private',
      description: 'Your data is encrypted and never shared',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Zap,
      title: 'Instant Analysis',
      description: 'Get results in seconds, not days',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: DollarSign,
      title: 'Save Money',
      description: 'Find cards with better rewards and rates',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Card Genie
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Find Your Perfect Credit Card
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get personalized credit card recommendations based on your spending patterns
            and maximize your returns with AI-powered insights.
          </p>

          {/* Promotion Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {promotionStats.map((stat, index) => (
              <Card key={index} className="border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-blue-700 mb-1">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Section */}
        <div className="max-w-4xl mx-auto">
          {activeAction !== 'manual' ? (
            <>
              <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">
                Get Started in 2 Simple Ways
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Upload Statements */}
                <Card className={`transition-all duration-300 hover:shadow-xl border-2 ${
                  activeAction === 'upload' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                }`}>
                  <CardContent className="p-8 text-center">
                    <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-3 text-gray-800">Upload Previous Statements</h4>
                    <p className="text-gray-600 mb-4">
                      Upload your credit card statements for accurate analysis. We recommend at least 3 months of data.
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf"
                      className="hidden"
                      id="direct-file-upload"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          // Handle file selection directly
                          // You would typically process the files here
                          // For now, we'll just navigate to recommendations
                          navigate('/recommendations');
                        }
                      }}
                    />
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        document.getElementById('direct-file-upload')?.click();
                      }}
                    >
                      Choose Files
                    </Button>
                  </CardContent>
                </Card>

                {/* Manual Entry */}
                <Card className={`transition-all duration-300 hover:shadow-xl border-2 ${
                  activeAction === 'manual' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}>
                  <CardContent className="p-8 text-center">
                    <Calculator className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold mb-3 text-gray-800">Tell Us Your Expenses</h4>
                    <p className="text-gray-600 mb-4">
                      Manually enter your monthly spending across different categories for personalized recommendations.
                    </p>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => setActiveAction('manual')}
                    >
                      Start Manual Entry
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="p-6">
                <div className="mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveAction(null)}
                    className="flex items-center gap-2"
                  >
                    ← Back
                  </Button>
                </div>
                <ExpenseForm onComplete={(data) => {
                  if (data) {
                    // Store the form data in localStorage to be accessed by the recommendations page
                    localStorage.setItem('userFormData', JSON.stringify(data));
                  }
                  navigate('/recommendations');
                }} />
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white/50 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <feature.icon className={`h-10 w-10 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
        </div>
      </footer>
    </div>
  );
};

export default Index;
