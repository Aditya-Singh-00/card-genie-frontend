import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Calculator, Check, CreditCard, DollarSign, IndianRupee, Loader2, Lock, TrendingUp, Upload, Users, Zap} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import ExpenseForm from '@/components/ExpenseForm';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import FileUpload from '@/components/FileUpload';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import SpendingAnalysis from '@/components/SpendingAnalysis';
import Lottie from 'lottie-react';
import loaderAnimation from '../loader_anim.json';

// Define the FileWithPassword interface to match the one in FileUpload.tsx
interface FileWithPassword {
    file: File;
}

interface CategoryData {
    amount: number;
    percentage: number;
    count: number;
}

const Index = () => {
    const [activeAction, setActiveAction] = useState<'upload' | 'manual' | null>('upload');
    const [selectedFiles, setSelectedFiles] = useState<FileWithPassword[]>([]);
    const [uploadComplete, setUploadComplete] = useState<boolean>(false);
    const [categoryBreakdown, setCategoryBreakdown] = useState<Record<string, CategoryData> | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

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

    // Check for customerId in sessionStorage when component mounts
    useEffect(() => {
        const checkCustomerId = async () => {
            // Check if customerId exists in sessionStorage
            const customerId = sessionStorage.getItem('customerId');
            console.log("customerId", customerId);

            if (!customerId) {
                try {
                    // Make API call to authenticate endpoint
                    const response = await fetch('http://localhost:3003/credit.genie.in/authenticate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            token: "swipe_right.cc"
                        }),
                    });

                    if (!response.ok) {
                        throw new Error(`Authentication failed: ${response.status}`);
                    }
                    const data = await response.json();
                    console.log('Authentication response:', data);

                    if (data.customerId) {
                        sessionStorage.setItem('customerId', data.customerId);
                        console.log('CustomerId saved to sessionStorage:', data.customerId);
                    }
                } catch (error) {
                    console.error('Error during authentication:', error);
                }
            } else {
                console.log('Using existing customerId from sessionStorage:', customerId);
            }
        };
        checkCustomerId();
    }, []);

    const promotionStats = [
        {icon: Users, value: '50k+', label: 'Customers Served'},
        {icon: TrendingUp, value: '4.7%', label: 'Extra Returns Provided'},
        {icon: CreditCard, value: '₹20k', label: 'Average Annual Savings'},
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
            icon: IndianRupee,
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
                            Credit Card Genie
                        </h1>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
                        Discover the Best Credit Card for You
                    </h2>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        Get personalized credit card recommendations based on your spending patterns
                        and maximize your returns with AI-powered insights.
                    </p>

                    {/* Promotion Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {promotionStats.map((stat, index) => (
                            <Card key={index}
                                  className="border-blue-100 hover:shadow-lg transition-all duration-300 hover:scale-105">
                                <CardContent className="p-6 text-center">
                                    <stat.icon className="h-10 w-10 text-blue-600 mx-auto mb-3"/>
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
                                Start in 2 Easy Ways
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Upload Statements */}
                                <Card className={`transition-all duration-300 hover:shadow-xl border-2 ${
                                    activeAction === 'upload' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                }`}>
                                    <CardContent className="p-8 text-center">
                                        {!categoryBreakdown ? (
                                            <FileUpload
                                                onComplete={(filesWithPasswords) => {
                                                    // Update selectedFiles state
                                                    setSelectedFiles(filesWithPasswords);
                                                    setUploadComplete(true);
                                                    console.log('Files selected:', filesWithPasswords.map(f => f.file.name));

                                                    // Make API call to upload files directly
                                                    const apiUrl = 'http://localhost:3003/credit.genie.in/recommendation';
                                                    console.log('Making API call to:', apiUrl);

                                                    // Create FormData object
                                                    const formData = new FormData();

                                                    // Get customerId from sessionStorage
                                                    const customerId = sessionStorage.getItem('customerId');
                                                    if (customerId) {
                                                        formData.append('customerId', customerId);
                                                    }

                                                    // Add files to FormData
                                                    filesWithPasswords.forEach((fileWithPassword, index) => {
                                                        formData.append(`files`, fileWithPassword.file);
                                                    });

                                                    // Extract card names from filesWithPasswords
                                                    const cardNames = filesWithPasswords
                                                        .filter(file => file.cardName) // Filter out files without card names
                                                        .map(file => file.cardName);   // Extract card names

                                                    // Store card names in sessionStorage for use in Recommendations.tsx
                                                    if (cardNames.length > 0) {
                                                        sessionStorage.setItem('selectedCardNames', JSON.stringify(cardNames));
                                                    }

                                                    // Note: cardName is not passed to the /recommendation API, only to /get-recommendation

                                                    // Create a timeout promise to abort the fetch if it takes too long
                                                    const timeoutPromise = new Promise((_, reject) => {
                                                        setTimeout(() => reject(new Error('Request timeout after 60 seconds')), 60000);
                                                    });

                                                    // Use Promise.race to implement a timeout
                                                    Promise.race([
                                                        fetch(apiUrl, {
                                                            method: 'POST',
                                                            // Don't set Content-Type header when sending FormData
                                                            // The browser will set it automatically with the correct boundary
                                                            headers: {
                                                                'Accept': 'application/json',
                                                                // Add additional CORS headers
                                                                'Access-Control-Allow-Origin': '*',
                                                                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                                                                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                                                                'Authorization': 'authToken',
                                                            },
                                                            body: formData,
                                                        }),
                                                        timeoutPromise
                                                    ])
                                                    .then((response: any) => {
                                                        console.log('API response status:', response.status);
                                                        if (!response.ok) {
                                                            throw new Error(`Network response was not ok: ${response.status}`);
                                                        }
                                                        return response.json();
                                                    })
                                                    .then(data => {
                                                        console.log('API response data:', data);
                                                        // Store the API response data in sessionStorage
                                                        sessionStorage.setItem('apiResponseData', JSON.stringify(data));

                                                        // Set state to show the category breakdown
                                                        setCategoryBreakdown(data.category_breakdown);

                                                        // Navigate to recommendations page after API response
                                                        navigate('/recommendations');
                                                    })
                                                    .catch(error => {
                                                        console.error('Error uploading files:', error);

                                                        // Log more detailed error information
                                                        if (error.message.includes('timeout')) {
                                                            console.error('Timeout error: The API server took too long to respond.');
                                                        } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                                                            console.error('Network error: The API server might be down or unreachable.');
                                                        } else if (error.message.includes('Network response was not ok')) {
                                                            console.error('Server error: The API server returned an error response.');
                                                        }

                                                        // Try to get stored API response data from sessionStorage
                                                        const storedData = sessionStorage.getItem('apiResponseData');
                                                        if (storedData) {
                                                            try {
                                                                const parsedData = JSON.parse(storedData);
                                                                if (parsedData.category_breakdown) {
                                                                    console.log('Using stored category breakdown data');
                                                                    setCategoryBreakdown(parsedData.category_breakdown);
                                                                    // Navigate to recommendations page
                                                                    navigate('/recommendations');
                                                                } else {
                                                                    console.error('No category_breakdown in stored data');
                                                                    // Create default data and navigate
                                                                    const defaultApiData = {
                                                                        category_breakdown: {
                                                                            "SHOPPING": { amount: 15000, percentage: 30, count: 10 },
                                                                            "DINING": { amount: 12000, percentage: 24, count: 8 },
                                                                            "TRAVEL": { amount: 8000, percentage: 16, count: 5 },
                                                                            "FUEL": { amount: 6000, percentage: 12, count: 4 },
                                                                            "BILLS": { amount: 5000, percentage: 10, count: 3 },
                                                                            "OTHERS": { amount: 4000, percentage: 8, count: 2 }
                                                                        }
                                                                    };
                                                                    sessionStorage.setItem('apiResponseData', JSON.stringify(defaultApiData));
                                                                    navigate('/recommendations');
                                                                }
                                                            } catch (parseError) {
                                                                console.error('Error parsing stored data:', parseError);
                                                                // Create default data and navigate
                                                                const defaultApiData = {
                                                                    category_breakdown: {
                                                                        "SHOPPING": { amount: 15000, percentage: 30, count: 10 },
                                                                        "DINING": { amount: 12000, percentage: 24, count: 8 },
                                                                        "TRAVEL": { amount: 8000, percentage: 16, count: 5 },
                                                                        "FUEL": { amount: 6000, percentage: 12, count: 4 },
                                                                        "BILLS": { amount: 5000, percentage: 10, count: 3 },
                                                                        "OTHERS": { amount: 4000, percentage: 8, count: 2 }
                                                                    }
                                                                };
                                                                sessionStorage.setItem('apiResponseData', JSON.stringify(defaultApiData));
                                                                navigate('/recommendations');
                                                            }
                                                        } else {
                                                            console.error('No stored API response data');
                                                            // Create default data and navigate
                                                            const defaultApiData = {
                                                                category_breakdown: {
                                                                    "SHOPPING": { amount: 15000, percentage: 30, count: 10 },
                                                                    "DINING": { amount: 12000, percentage: 24, count: 8 },
                                                                    "TRAVEL": { amount: 8000, percentage: 16, count: 5 },
                                                                    "FUEL": { amount: 6000, percentage: 12, count: 4 },
                                                                    "BILLS": { amount: 5000, percentage: 10, count: 3 },
                                                                    "OTHERS": { amount: 4000, percentage: 8, count: 2 }
                                                                }
                                                            };
                                                            sessionStorage.setItem('apiResponseData', JSON.stringify(defaultApiData));
                                                            navigate('/recommendations');
                                                        }
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
                                                    <Check className="h-6 w-6 text-green-600 mx-auto mb-2" />
                                                    <p className="text-green-700 font-medium">Files analyzed successfully!</p>
                                                    <p className="text-green-600 text-sm">View your spending analysis below</p>
                                                </div>

                                                <Button
                                                    variant="outline"
                                                    className="w-full"
                                                    onClick={() => {
                                                        setSelectedFiles([]);
                                                        setUploadComplete(false);
                                                        setCategoryBreakdown(null);
                                                    }}
                                                >
                                                    Upload Different Files
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Manual Entry */}
                                <Card className={`transition-all duration-300 hover:shadow-xl border-2 ${
                                    activeAction === 'manual' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
                                }`}>
                                    <CardContent className="p-8 text-center">
                                        <Calculator className="h-16 w-16 text-green-600 mx-auto mb-4"/>
                                        <h4 className="text-xl font-semibold mb-3 text-gray-800">Enter Your Expenses Manually</h4>
                                        <p className="text-gray-600 mb-4">
                                            Manually input your monthly spending by category to receive tailored recommendations.
                                        </p>
                                        <Button
                                            className="w-full bg-green-600 hover:bg-green-700"
                                            onClick={() => setActiveAction('manual')}
                                        >
                                            Begin Manual Entry
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
                                    console.log("data", data);
                                    if (data) {
                                        // Store the form data in sessionStorage to be accessed by the recommendations page
                                        sessionStorage.setItem('userFormData', JSON.stringify(data));

                                        // Set loading state to true
                                        setIsLoading(true);

                                        // Format data for the get-recommendation API call
                                        const category_breakdown = {};

                                        // Calculate total expenses for percentage calculation
                                        const totalExpenses = Object.values(data.expenses).reduce((sum, val) => sum + val, 0);

                                        // Process each expense category
                                        Object.entries(data.expenses)
                                            .filter(([_, amount]) => amount > 0)
                                            .forEach(([category, amount]) => {
                                                // Calculate percentage
                                                const percentage = (amount / totalExpenses) * 100;

                                                // Get brands for this category
                                                const brands = data.selectedBrands[category] ?
                                                    data.selectedBrands[category].join(', ') :
                                                    category.charAt(0).toUpperCase() + category.slice(1);

                                                // Format category name to uppercase
                                                const categoryKey = category.toUpperCase();

                                                // Add to category_breakdown
                                                category_breakdown[categoryKey] = {
                                                    amount: amount,
                                                    percentage: parseFloat(percentage.toFixed(2)),
                                                    count: 1, // Set count to 1 as per requirement
                                                    brands: brands
                                                };
                                            });

                                        // Store the categoryBreakdown data in sessionStorage
                                        sessionStorage.setItem('categoryBreakdown', JSON.stringify(category_breakdown));
                                            const defaultApiData = {
                                                category_breakdown: category_breakdown
                                            };
                                            sessionStorage.setItem('apiResponseData', JSON.stringify(defaultApiData));


                                        // Navigate to recommendations page after API response
                                        navigate('/recommendations');
                                    } else {
                                        // Create default data if no data is available
                                        if (!sessionStorage.getItem('apiResponseData')) {
                                            const defaultApiData = {
                                                category_breakdown: {
                                                    "SHOPPING": { amount: 15000, percentage: 30, count: 10 },
                                                    "DINING": { amount: 12000, percentage: 24, count: 8 },
                                                    "TRAVEL": { amount: 8000, percentage: 16, count: 5 },
                                                    "FUEL": { amount: 6000, percentage: 12, count: 4 },
                                                    "BILLS": { amount: 5000, percentage: 10, count: 3 },
                                                    "OTHERS": { amount: 4000, percentage: 8, count: 2 }
                                                }
                                            };
                                            sessionStorage.setItem('apiResponseData', JSON.stringify(defaultApiData));
                                        }

                                        // Navigate to recommendations page after API response
                                        navigate('/recommendations');
                                    }
                                }}/>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </section>

            {/* Spending Analysis Section */}
            {categoryBreakdown && (
                <section className="container mx-auto px-4 py-8">
                    <SpendingAnalysis
                        categoryBreakdown={categoryBreakdown}
                        categoryColors={categoryColors}
                    />
                    <div className="max-w-4xl mx-auto mt-6">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center p-6">
                                <Lottie
                                    animationData={loaderAnimation}
                                    style={{ height: 100, width: 100 }}
                                    loop={true}
                                />
                                <span className="mt-2 text-green-700 font-medium">Getting Recommendations...</span>
                            </div>
                        ) : (
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => {
                                    // Set loading state to true
                                    setIsLoading(true);

                                    // Make API call to get recommendations
                                    const apiUrl = 'http://localhost:3003/credit.genie.in/get-recommendations';
                                    console.log('Making API call to:', apiUrl);

                                    // Get customerId from sessionStorage
                                    const customerId = sessionStorage.getItem('customerId');

                                    // Format the data according to the required structure
                                    const formattedData = {
                                        category_breakdown: {}
                                    };

                                    // Convert the categoryBreakdown to the required format
                                    if (categoryBreakdown) {
                                        Object.entries(categoryBreakdown).forEach(([category, data]) => {
                                            // Get brands for this category if available
                                            const brands = selectedFiles
                                                .filter(file => file.cardName)
                                                .map(file => file.cardName)
                                                .join(', ');

                                            formattedData.category_breakdown[category] = {
                                                amount: data.amount,
                                                percentage: data.percentage,
                                                count: 1, // Set count to 1 as per requirement
                                                brands: brands || category // Use category name as fallback if no brands
                                            };
                                        });
                                    }

                                    console.log('Request body for get-recommendation:', formattedData);

                                    // Store the categoryBreakdown data in sessionStorage
                                    sessionStorage.setItem('categoryBreakdown', JSON.stringify(formattedData.category_breakdown));

                                    // Make the API call
                                    fetch(apiUrl, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Accept': 'application/json',
                                        },
                                        body: JSON.stringify(formattedData),
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
                                        sessionStorage.setItem('cardRecommendations', JSON.stringify(data?.topRecommendations));
                                        sessionStorage.setItem('aiInsights', data?.ai_insights);
                                        // Set loading state to false
                                        setIsLoading(false);
                                        // Navigate to recommendations page
                                        navigate('/recommendations');
                                    })
                                    .catch(error => {
                                        console.error('Error getting recommendations:', error);
                                        // Set loading state to false
                                        setIsLoading(false);
                                        // Navigate to recommendations page anyway for demo purposes
                                        navigate('/recommendations');
                                    });
                                }}
                            >
                                Get Recommendations
                            </Button>
                        )}
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section className="bg-white/50 backdrop-blur-sm py-16">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {features.map((feature, index) => (
                            <div key={index} className="text-center">
                                <div
                                    className={`w-20 h-20 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <feature.icon className={`h-10 w-10 ${feature.iconColor}`}/>
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
