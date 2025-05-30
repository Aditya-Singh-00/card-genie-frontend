import {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Calculator, CreditCard, DollarSign, Lock, TrendingUp, Upload, Users, Zap} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import ExpenseForm from '@/components/ExpenseForm';

const Index = () => {
    const [activeAction, setActiveAction] = useState<'upload' | 'manual' | null>('upload');
    const navigate = useNavigate();

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
                                Get Started in 2 Simple Ways
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Upload Statements */}
                                <Card className={`transition-all duration-300 hover:shadow-xl border-2 ${
                                    activeAction === 'upload' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                                }`}>
                                    <CardContent className="p-8 text-center">
                                        <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4"/>
                                        <h4 className="text-xl font-semibold mb-3 text-gray-800">Upload Previous
                                            Statements</h4>
                                        <p className="text-gray-600 mb-4">
                                            Upload your credit card statements for accurate analysis. We recommend at
                                            least 3 months of data.
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
                                        <Calculator className="h-16 w-16 text-green-600 mx-auto mb-4"/>
                                        <h4 className="text-xl font-semibold mb-3 text-gray-800">Tell Us Your
                                            Expenses</h4>
                                        <p className="text-gray-600 mb-4">
                                            Manually enter your monthly spending across different categories for
                                            personalized recommendations.
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
                                    console.log("data", data);
                                    if (data) {
                                        // Store the form data in localStorage to be accessed by the recommendations page
                                        localStorage.setItem('userFormData', JSON.stringify(data));

                                        // Format data for API call
                                        const spendCategory = Object.entries(data.expenses)
                                            .filter(([_, amount]) => amount > 0)
                                            .map(([category, amount]) => ({
                                                categoryName: category.charAt(0).toUpperCase() + category.slice(1),
                                                categoryAmount: amount,
                                                subCategory: data.selectedBrands[category] || []
                                            }));

                                        // Map income range values to the required format
                                        let formattedIncomeRange;
                                        switch (data.incomeRange) {
                                            case 'below-50k':
                                                formattedIncomeRange = 'Below 50 Thousand';
                                                break;
                                            case '50k-2l':
                                                formattedIncomeRange = '50 Thousand to 1 Lakh';
                                                break;
                                            case 'above-2l':
                                                formattedIncomeRange = 'Above 1 Lakh';
                                                break;
                                            default:
                                                formattedIncomeRange = data.incomeRange;
                                        }

                                        // Map credit limit values to the required format
                                        let formattedCreditLimit;
                                        switch (data.creditLimit) {
                                            case 'below-1l':
                                                formattedCreditLimit = 'below 1 lakh';
                                                break;
                                            case '1l-2.5l':
                                                formattedCreditLimit = '1 to 2.5 lakh';
                                                break;
                                            case '2.5l-5l':
                                                formattedCreditLimit = '2.5 to 5 lakh';
                                                break;
                                            case '5l-8l':
                                                formattedCreditLimit = '5 to 8 lakh';
                                                break;
                                            case 'above-8l':
                                                formattedCreditLimit = 'above 8 lakh';
                                                break;
                                            default:
                                                formattedCreditLimit = data.creditLimit;
                                        }

                                        // Get customerId from sessionStorage
                                        const customerId = sessionStorage.getItem('customerId');

                                        // Prepare the payload for the API
                                        const payload = {
                                            spendCategory,
                                            incomeRange: formattedIncomeRange,
                                            hasCreditCard: data.hasCreditCard,
                                            creditLimit: formattedCreditLimit,
                                            customerId: customerId || '' // Include customerId in the payload
                                        };

                                        // Make the API call
                                        console.log('Making API call with payload:', payload);

                                        // Create a timeout promise to abort the fetch if it takes too long
                                        const timeoutPromise = new Promise((_, reject) => {
                                            setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000);
                                        });

                                        // Updated API endpoint as per requirements
                                        const apiUrl = 'http://localhost:3003/credit.genie.in/recommendation';
                                        console.log('API URL:', apiUrl);

                                        // Use Promise.race to implement a timeout
                                        Promise.race([
                                            fetch(apiUrl, {
                                                method: 'POST',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Accept': 'application/json',
                                                    // Add additional CORS headers
                                                    'Access-Control-Allow-Origin': '*',
                                                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                                                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                                                },
                                                // Add credentials to include cookies in the request
                                                credentials: 'include',
                                                body: JSON.stringify(payload),
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
                                                // Continue with navigation after successful API call
                                                navigate('/recommendations');
                                            })
                                            .catch(error => {
                                                console.error('Error submitting questionnaire:', error);

                                                // Log more detailed error information
                                                if (error.message.includes('timeout')) {
                                                    console.error('Timeout error: The API server took too long to respond.');
                                                    console.error('Please check if the API server is running and responsive.');
                                                } else if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                                                    console.error('Network error: The API server might be down or unreachable.');
                                                    console.error('Please check if the API server is running at the correct host and port.');
                                                } else if (error.message.includes('Network response was not ok')) {
                                                    console.error('Server error: The API server returned an error response.');
                                                    console.error('Please check the server logs for more information.');
                                                }
                                                // Use the original URL format with the updated endpoint
                                                const originalApiUrl = 'http://localhost:3003/credit.genie.in/recommendation';
                                                console.log('Fallback API URL:', originalApiUrl);

                                                // Make a new API call with the original URL
                                                fetch(originalApiUrl, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Accept': 'application/json'
                                                    },
                                                    body: JSON.stringify(payload), // payload already includes customerId
                                                })
                                                    .then(response => {
                                                        console.log('Fallback API response status:', response.status);
                                                        if (!response.ok) {
                                                            throw new Error(`Fallback network response was not ok: ${response.status}`);
                                                        }
                                                        return response.json();
                                                    })
                                                    .then(data => {
                                                        console.log('Fallback API response data:', data);
                                                        navigate('/recommendations');
                                                    })
                                                    .catch(fallbackError => {
                                                        console.error('Error with fallback API call:', fallbackError);
                                                        navigate('/recommendations');
                                                    });
                                            });
                                    } else {
                                        navigate('/recommendations');
                                    }
                                }}/>
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
