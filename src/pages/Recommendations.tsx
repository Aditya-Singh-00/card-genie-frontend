
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { TrendingUp, CreditCard, Gift, Shield, Plane, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CardBenefitsModal from '@/components/CardBenefitsModal';

interface UserFormData {
  expenses: Record<string, number>;
  selectedBrands: Record<string, string[]>;
  incomeRange: string;
  hasCreditCard: boolean | null;
  creditLimit: string;
}

const Recommendations = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [userFormData, setUserFormData] = useState<UserFormData | null>(null);

  // Retrieve user form data from localStorage when component mounts
  useEffect(() => {
    const storedData = localStorage.getItem('userFormData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserFormData(parsedData);
      } catch (error) {
        console.error('Error parsing user form data:', error);
      }
    }
  }, []);

  // Helper function to get human-readable values
  const getReadableValue = (key: string, value: string): string => {
    switch (key) {
      case 'incomeRange':
        return value === 'below-50k' ? 'Below ₹50,000' :
               value === '50k-2l' ? '₹50,000 - ₹2 Lakh' :
               value === 'above-2l' ? 'Above ₹2 Lakh' : value;
      case 'creditLimit':
        return value === 'below-1l' ? 'Below ₹1 Lakh' :
               value === '1l-2.5l' ? '₹1 Lakh - ₹2.5 Lakh' :
               value === '2.5l-5l' ? '₹2.5 Lakh - ₹5 Lakh' :
               value === '5l-8l' ? '₹5 Lakh - ₹8 Lakh' :
               value === 'above-8l' ? 'Above ₹8 Lakh' : value;
      default:
        return value;
    }
  };

  // Mock data - in real app this would come from API
  const expenseData = [
    { name: 'Shopping', value: 15000, color: '#8B5CF6' },
    { name: 'Food & Dining', value: 12000, color: '#06B6D4' },
    { name: 'Travel', value: 8000, color: '#10B981' },
    { name: 'Fuel', value: 6000, color: '#F59E0B' },
    { name: 'Bills', value: 5000, color: '#EF4444' },
    { name: 'Others', value: 4000, color: '#6B7280' },
  ];

  const recommendedCards = [
    {
      id: 1,
      name: 'HDFC Diners Club Black',
      image: '/placeholder.svg',
      returnPercentage: 8.5,
      currentCardReturn: 2.1,
      isTopRecommended: true,
      keyBenefits: [
        'Unlimited domestic lounge access',
        '10X rewards on dining & hotels',
        'Golf privileges worldwide',
        'Priority Pass membership'
      ],
      returnBreakup: [
        { category: 'Dining', percentage: 10, amount: 1200 },
        { category: 'Travel', percentage: 8, amount: 640 },
        { category: 'Shopping', percentage: 5, amount: 750 },
        { category: 'Others', percentage: 1, amount: 350 },
      ],
      theme: {
        primary: '#1a1a1a',
        secondary: '#FFD700',
        gradient: 'from-gray-900 to-black'
      }
    },
    {
      id: 2,
      name: 'SBI Card PRIME',
      image: '/placeholder.svg',
      returnPercentage: 7.2,
      currentCardReturn: 2.1,
      isTopRecommended: false,
      keyBenefits: [
        '5X rewards on online shopping',
        'Fuel surcharge waiver',
        '4 complimentary lounge access',
        'Movie ticket offers'
      ],
      returnBreakup: [
        { category: 'Shopping', percentage: 5, amount: 750 },
        { category: 'Fuel', percentage: 2.5, amount: 150 },
        { category: 'Others', percentage: 1, amount: 350 },
      ],
      theme: {
        primary: '#1e40af',
        secondary: '#3b82f6',
        gradient: 'from-blue-900 to-blue-600'
      }
    },
    {
      id: 3,
      name: 'ICICI Amazon Pay',
      image: '/placeholder.svg',
      returnPercentage: 6.8,
      currentCardReturn: 2.1,
      isTopRecommended: false,
      keyBenefits: [
        '5% cashback on Amazon',
        '2% on bill payments',
        'No annual fee',
        'Amazon Prime membership'
      ],
      returnBreakup: [
        { category: 'Shopping', percentage: 5, amount: 750 },
        { category: 'Bills', percentage: 2, amount: 100 },
        { category: 'Others', percentage: 1, amount: 350 },
      ],
      theme: {
        primary: '#ff9900',
        secondary: '#232f3e',
        gradient: 'from-orange-600 to-gray-800'
      }
    },
  ];

  const totalExpense = expenseData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-blue-600 hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Your Personalized Recommendations
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Expense Analysis */}
        <section className="mb-12">
          <Card className="border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800 flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Your Spending Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row items-start">
                {/* Pie Chart - Left Aligned */}
                <div className="flex justify-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Expense Breakdown</h3>
                    <ResponsiveContainer width={280} height={280}>
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                          labelLine={false}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                            return (
                              <text
                                x={x}
                                y={y}
                                fill="#fff"
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontWeight="bold"
                              >
                                {`${(percent * 100).toFixed(0)}%`}
                              </text>
                            );
                          }}
                        >
                          {expenseData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Values - Left Aligned with AI Insights Below */}
                <div className="flex flex-col justify-start">
                  {/* Values */}
                  <div className="flex flex-col justify-start mt-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Expense Values</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-[2px] md:gap-x-4">
                      {expenseData.map((item, index) => (
                          <div key={index} className="flex items-center gap-1">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-gray-600 font-medium">
        {item.name}: ₹{item.value.toLocaleString()}
      </span>
                          </div>
                      ))}
                    </div>

                  </div>

                  {/* AI Insights - Below Values */}
                  <div className="mt-[30px] p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">AI Insights</h4>
                    <p className="text-blue-700 mb-3">
                      Based on your spending pattern of ₹{totalExpense.toLocaleString()}/month, you spend most on shopping ({((expenseData[0].value/totalExpense)*100).toFixed(1)}%)
                      and food & dining ({((expenseData[1].value/totalExpense)*100).toFixed(1)}%).
                      Our recommendations focus on maximizing rewards in these categories.
                    </p>

                    {/* User Financial Information */}
                    {userFormData && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-1">Your Financial Profile</h5>
                        <ul className="text-blue-700 space-y-1">
                          <li>
                            <span className="font-medium">Income Range:</span> {getReadableValue('incomeRange', userFormData.incomeRange)}
                          </li>
                          <li>
                            <span className="font-medium">Credit Card Status:</span> {userFormData.hasCreditCard ? 'Currently have a credit card' : 'No credit card'}
                          </li>
                          {userFormData.hasCreditCard && userFormData.creditLimit && (
                            <li>
                              <span className="font-medium">Credit Limit:</span> {getReadableValue('creditLimit', userFormData.creditLimit)}
                            </li>
                          )}
                        </ul>
                        <p className="text-blue-700 mt-2 text-sm italic">
                          {userFormData.incomeRange === 'above-1l' ?
                            'Your high income qualifies you for premium credit cards with exclusive benefits.' :
                            'We\'ve selected cards that match your income profile and spending habits.'}
                          {userFormData.hasCreditCard && userFormData.creditLimit === 'above-8l' &&
                            ' Your high credit limit indicates excellent credit history, making you eligible for the best card offers.'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Recommended Cards */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Top 3 Credit Card Recommendations
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {recommendedCards.map((card, index) => (
              <Card
                key={card.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  card.isTopRecommended 
                    ? 'border-2 border-yellow-400 shadow-xl' 
                    : 'border border-gray-200 shadow-md'
                }`}
                style={{
                  background: `linear-gradient(135deg, white 0%, white 60%, ${card.theme.secondary}20 100%)`,
                }}
              >
                {card.isTopRecommended ? (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-center py-1.5">
                    <Badge className="bg-yellow-600 text-white font-bold text-sm">
                      🏆 BEST CHOICE
                    </Badge>
                  </div>
                ) : (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-center py-1.5 opacity-0">
                    <Badge className="bg-yellow-600 text-white font-bold text-sm">
                      🏆 BEST CHOICE
                    </Badge>
                  </div>
                )}

                <CardContent className="p-6 mt-8">
                  <div className="flex flex-col gap-6">
                    {/* Card Image - Made rectangular like a credit card */}
                    <div
                      className={`h-48 w-full rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br ${card.theme.gradient}`}
                    >
                      <CreditCard className="h-12 w-12 text-white" />
                    </div>

                    {/* Card Details */}
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-gray-800">{card.name}</h3>

                      {/* Return Percentage */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="text-4xl font-bold text-green-600">
                          {card.returnPercentage}%
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Total Return</div>
                          {card.currentCardReturn && (
                            <div className="text-red-500">
                              vs {card.currentCardReturn}% (current)
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Return Breakup */}
                      <div className="mb-5">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">RETURN BREAKUP</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {card.returnBreakup.slice(0, 4).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-1 h-1 bg-green-500 rounded-full" />
                              <span className="text-gray-700">{item.category}: </span>
                              <span className="font-medium">{item.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Key Benefits */}
                  <div className="mt-5 mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">KEY BENEFITS</h4>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                      {card.keyBenefits.map((benefit, idx) => (
                        <div key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-sm"
                      onClick={() => setSelectedCard(card)}
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      All Benefits
                    </Button>

                    <Button
                      className={`flex-1 text-sm ${
                        card.isTopRecommended 
                          ? 'bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-700 hover:to-orange-600' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <Plane className="h-3 w-3 mr-1" />
                      Apply Now
                    </Button>
                  </div>
                </CardContent>

                {/* Subtle highlight for top card */}
                {card.isTopRecommended && (
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-yellow-100/10 to-yellow-200/20 pointer-events-none" />
                )}
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Card Benefits Modal */}
      {selectedCard && (
        <CardBenefitsModal
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
};

export default Recommendations;
