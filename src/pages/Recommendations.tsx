
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Label } from 'recharts';
import { TrendingUp, CreditCard, Gift, Shield, Plane, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CardBenefitsModal from '@/components/CardBenefitsModal';
import Lottie from 'lottie-react';
import loaderAnimation from '@/loader_anim.json';

interface UserFormData {
  expenses: Record<string, number>;
  selectedBrands: Record<string, string[]>;
  hasCreditCard: boolean | null;
  creditLimit: string;
}

interface CategoryData {
  amount: number;
  percentage: number;
  count: number;
}

interface ApiResponseData {
  category_breakdown: Record<string, CategoryData>;
}

interface RewardStructure {
  valueForCalculation: string;
  notes: string;
}

interface RewardCategory {
  rewardCategory: string;
  rewardStructures: RewardStructure[];
}

interface Benefit {
  title: string;
}

interface ReturnBreakup {
  [key: string]: string;
}

interface EligibilityCriteria {
  age: string;
  income_trv: string;
  others: string;
}

interface CardRecommendation {
  rank: number;
  cardName: string;
  totalReturn: string;
  currentReturn: string;
  returnBreakup: ReturnBreakup;
  eligibilityCriteria: EligibilityCriteria;
  rewardSummary: RewardCategory[];
  benefits: Benefit[];
}

const Recommendations = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [userFormData, setUserFormData] = useState<UserFormData | null>(null);
  const [apiResponseData, setApiResponseData] = useState<ApiResponseData | null>(null);
  const [cardRecommendations, setCardRecommendations] = useState<CardRecommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Retrieve user form data and API response data from sessionStorage when component mounts
  useEffect(() => {
    // Get user form data
    const storedData = sessionStorage.getItem('userFormData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserFormData(parsedData);
      } catch (error) {
        console.error('Error parsing user form data:', error);
      }
    }

    // Get API response data
    const storedApiData = sessionStorage.getItem('apiResponseData');
    if (storedApiData) {
      try {
        const parsedApiData = JSON.parse(storedApiData);
        setApiResponseData(parsedApiData);
        console.log('Retrieved API response data:', parsedApiData);
      } catch (error) {
        console.error('Error parsing API response data:', error);
      }
    }

    // Get card recommendations data
    const storedCardRecommendations = sessionStorage.getItem('cardRecommendations');
    if (storedCardRecommendations) {
      try {
        const parsedCardRecommendations = JSON.parse(storedCardRecommendations);
        console.log("cardREcommendataion", parsedCardRecommendations);
        setCardRecommendations(parsedCardRecommendations);
        console.log('Retrieved card recommendations data:', parsedCardRecommendations);
      } catch (error) {
        console.error('Error parsing card recommendations data:', error);
      }
    }

    // Call the get-recommendation API when the component mounts
    const apiUrl = 'http://localhost:3003/credit.genie.in/get-recommendations';
    console.log('Making API call to:', apiUrl);

    // Get customerId from sessionStorage
    const customerId = sessionStorage.getItem('customerId');
    if (customerId) {
      // Set loading state to true before making the API call
      setLoading(true);

      // Retrieve card names from sessionStorage
      let cardNames: string[] = [];
      const storedCardNames = sessionStorage.getItem('selectedCardNames');
      if (storedCardNames) {
        try {
          cardNames = JSON.parse(storedCardNames);
          console.log('Retrieved card names from sessionStorage:', cardNames);
        } catch (error) {
          console.error('Error parsing card names from sessionStorage:', error);
        }
      }

      // Create request body
      const requestBody = {
        customerId: customerId,
        cardName: cardNames.length > 0 ? cardNames : undefined
      };

      console.log('Request body for get-recommendations in Recommendations.tsx:', requestBody);

      // Make the API call
      fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API response data:', data);
        // Store the recommendations data in sessionStorage
        sessionStorage.setItem('cardRecommendations', JSON.stringify(data));
        // Update the state with the new recommendations
        setCardRecommendations(data);
        // Set loading state to false after successful API call
        setLoading(false);
      })
      .catch(error => {
        console.error('Error getting recommendations:', error);
        // Set loading state to false in case of error
        setLoading(false);
      });
    } else {
      console.error('No customerId found in sessionStorage');
    }
  }, []);

  // Helper function to get human-readable values
  const getReadableValue = (key: string, value: string): string => {
    switch (key) {
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

  // Define colors for different categories
  const categoryColors: Record<string, string> = {
    'FUEL': '#F59E0B',
    'DINING': '#06B6D4',
    'HEALTH': '#10B981',
    'SHOPPING': '#8B5CF6',
    'BILLS': '#EF4444',
    'OTHERS': '#6B7280',
    'TRAVEL': '#3B82F6',
    'ENTERTAINMENT': '#EC4899',
    'GROCERIES': '#84CC16',
    'UTILITIES': '#14B8A6'
  };

  // Transform API response data into the format expected by the pie chart
  const getExpenseDataFromApi = () => {
    if (!apiResponseData || !apiResponseData.category_breakdown) {
      // Return mock data if API data is not available
      return [
        { name: 'Shopping', value: 15000, color: '#8B5CF6' },
        { name: 'Food & Dining', value: 12000, color: '#06B6D4' },
        { name: 'Travel', value: 8000, color: '#10B981' },
        { name: 'Fuel', value: 6000, color: '#F59E0B' },
        { name: 'Bills', value: 5000, color: '#EF4444' },
        { name: 'Others', value: 4000, color: '#6B7280' },
      ];
    }

    // Transform category_breakdown data into the format expected by the pie chart
    return Object.entries(apiResponseData.category_breakdown).map(([category, data]) => ({
      name: (() => {
        const categoryWithSpaces = category.replace(/_/g, ' ');
        return categoryWithSpaces.charAt(0) + categoryWithSpaces.slice(1).toLowerCase();
      })(), // Replace underscores with spaces, capitalize first letter, lowercase rest
      value: data.amount,
      color: categoryColors[category] || '#6B7280', // Use default color if category color is not defined
      percentage: data.percentage,
      count: data.count
    }));
  };

  // Get expense data from API or use mock data
  const expenseData = getExpenseDataFromApi();

  // Function to map API response data to the format expected by the component
  const mapApiDataToCardFormat = (apiData: CardRecommendation[]) => {
    console.log("apiData", apiData);
    if (!apiData || apiData.length === 0) {
      return [];
    }

    return apiData.map((card, index) => {
      // Keep the totalReturn as a string without converting to number
      // Check if totalReturn is a string before calling replace
      const totalReturnValue = typeof card.totalReturn === 'string'
        ? card.totalReturn
        : String(card.totalReturn || '0');

      // Get top 4 return categories
      const returnBreakupEntries = Object.entries(card.returnBreakup)
        .filter(([_, value]) => value !== '₹0.00' && value !== '₹0')
        .map(([category, value]) => ({
          category,
          value: value
        }))
        // Sort by numeric value for display purposes only
        .sort((a, b) => parseFloat(b.value) - parseFloat(a.value))
        .slice(0, 4);

      // Get top 4 benefits
      const topBenefits = card.benefits ? card.benefits.slice(0, 4).map(benefit => benefit.title) : [];

      // Determine card theme based on rank
      let theme;
      if (index === 0) {
        theme = {
          primary: '#1a1a1a',
          secondary: '#FFD700',
          gradient: 'from-gray-900 to-black'
        };
      } else if (index === 1) {
        theme = {
          primary: '#1e40af',
          secondary: '#3b82f6',
          gradient: 'from-blue-900 to-blue-600'
        };
      } else {
        theme = {
          primary: '#ff9900',
          secondary: '#232f3e',
          gradient: 'from-orange-600 to-gray-800'
        };
      }

      return {
        id: card.rank,
        name: card.cardName,
        image: '/placeholder.svg',
        totalReturn: typeof card.totalReturn === 'string' ? card.totalReturn : String(card.totalReturn || '₹0'), // Keep the original string format with ₹ symbol
        currentReturn: typeof card.currentReturn === 'string' ? card.currentReturn : String(card.currentReturn || '₹0'), // Keep the original string format with ₹ symbol
        returnValue: totalReturnValue, // Keep as string
        isTopRecommended: index === 0, // First card is top recommended
        keyBenefits: topBenefits && topBenefits.length > 0 ? topBenefits : ['No specific benefits listed'],
        returnBreakup: returnBreakupEntries.map(entry => ({
          category: entry.category,
          percentage: Math.round((parseFloat(entry.value) / parseFloat(totalReturnValue)) * 100).toString(), // Convert to string
          amount: entry.value // Keep as string
        })),
        theme,
        // Include original API data for use in the modal
        originalData: card
      };
    });
  };

  // Fallback data in case the API call fails or returns no data
  const fallbackCards = [
    {
      id: 1,
      name: 'HDFC Diners Club Black',
      image: '/placeholder.svg',
      totalReturn: '₹3,500',
      currentReturn: '₹1,200',
      returnValue: '3500', // Changed to string
      isTopRecommended: true,
      keyBenefits: [
        'Unlimited domestic lounge access',
        '10X rewards on dining & hotels',
        'Golf privileges worldwide',
        'Priority Pass membership'
      ],
      returnBreakup: [
        { category: 'Dining', percentage: '10', amount: '1200' }, // Changed to strings
        { category: 'Travel', percentage: '8', amount: '640' }, // Changed to strings
        { category: 'Shopping', percentage: '5', amount: '750' }, // Changed to strings
        { category: 'Others', percentage: '1', amount: '350' }, // Changed to strings
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
      totalReturn: '₹2,800',
      currentReturn: '₹1,000',
      returnValue: '2800', // Changed to string
      isTopRecommended: false,
      keyBenefits: [
        '5X rewards on online shopping',
        'Fuel surcharge waiver',
        '4 complimentary lounge access',
        'Movie ticket offers'
      ],
      returnBreakup: [
        { category: 'Shopping', percentage: '5', amount: '750' }, // Changed to strings
        { category: 'Fuel', percentage: '2.5', amount: '150' }, // Changed to strings
        { category: 'Others', percentage: '1', amount: '350' }, // Changed to strings
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
      totalReturn: '₹2,500',
      currentReturn: '₹900',
      returnValue: '2500', // Changed to string
      isTopRecommended: false,
      keyBenefits: [
        '5% cashback on Amazon',
        '2% on bill payments',
        'No annual fee',
        'Amazon Prime membership'
      ],
      returnBreakup: [
        { category: 'Shopping', percentage: '5', amount: '750' }, // Changed to strings
        { category: 'Bills', percentage: '2', amount: '100' }, // Changed to strings
        { category: 'Others', percentage: '1', amount: '350' }, // Changed to strings
      ],
      theme: {
        primary: '#ff9900',
        secondary: '#232f3e',
        gradient: 'from-orange-600 to-gray-800'
      }
    },
  ];

  // Use API data if available, otherwise use fallback data (but only if not loading)
  const recommendedCards = cardRecommendations.length > 0
    ? mapApiDataToCardFormat(cardRecommendations)
    : fallbackCards;

  // Calculate total expense from the expense data
  const totalExpense = ""//expenseData.reduce((sum, item) => sum + item.value, 0);

  // Find the top two expense categories
  const sortedExpenses = [...expenseData].sort((a, b) => b.value - a.value);
  const topCategory = sortedExpenses.length > 0 ? sortedExpenses[0] : null;
  const secondCategory = sortedExpenses.length > 1 ? sortedExpenses[1] : null;

  // If loading, show loading animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex justify-center items-center">
        <div className="w-64 h-64">
          <Lottie animationData={loaderAnimation} loop={true} />
        </div>
      </div>
    );
  }

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
                    <ResponsiveContainer width={350} height={350}>
                      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <Pie
                          data={expenseData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={120}
                          paddingAngle={0}
                          dataKey="value"
                          labelLine={true}
                          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                            // Calculate position outside the pie chart
                            const radius = outerRadius * 1.2;
                            const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
                            const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
                            return (
                              <text
                                x={x}
                                y={y}
                                fill="#333"
                                textAnchor={x > cx ? 'start' : 'end'}
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
                      Based on your spending pattern of ₹{totalExpense.toLocaleString()}/month,
                      {topCategory && secondCategory ? (
                        <>
                          </>
                      ) : (
                        <>
                          your spending is distributed across various categories.
                        </>
                      )}
                      Our recommendations focus on maximizing rewards in these categories.
                    </p>

                    {/* User Financial Information */}
                    {userFormData && (
                      <div className="mt-2 pt-2 border-t border-blue-200">
                        <h5 className="font-semibold text-blue-800 mb-1">Your Financial Profile</h5>
                        <ul className="text-blue-700 space-y-1">
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
                          We've selected cards that match your spending habits.
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

                      {/* Total Return */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="text-4xl font-bold text-green-600">
                          {typeof card.totalReturn === 'string' ? card.totalReturn : String(card.totalReturn || '₹0')}
                        </div>
                        <div className="text-sm text-gray-600">
                          <div>Total Return</div>
                          {card.currentReturn && (
                            <div className="text-red-500">
                              vs {typeof card.currentReturn === 'string' ? card.currentReturn : String(card.currentReturn || '₹0')} (current)
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
