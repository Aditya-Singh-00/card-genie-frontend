import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Loader2} from 'lucide-react';

interface ExpenseFormProps {
    onComplete: (data?: {
        expenses: Record<string, number>;
        selectedBrands: Record<string, string[]>;
        hasCreditCard: boolean | null;
        creditLimit: string;
    }) => void;
}

const ExpenseForm = ({onComplete}: ExpenseFormProps) => {
    const [expenses, setExpenses] = useState({
        travel: 0,
        hotel: 0,
        shopping: 0,
        food: 0,
        dining: 0,
        movie: 0,
        fuel: 0,
        health: 0,
        bills: 0,
        others: 0,
    });

    const [selectedBrands, setSelectedBrands] = useState<Record<string, string[]>>({});
    const [hasCreditCard, setHasCreditCard] = useState<boolean | null>(null);
    const [creditLimit, setCreditLimit] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const categoryBrands = {
        travel: ['Uber', 'Ola', 'MakeMyTrip', 'Rapido', 'Cleartrip', 'IRCTC', 'RedBus', 'Paytm'],
        hotel: ['OYO', 'Airbnb', 'Taj', 'ITC', 'Marriott'],
        shopping: ['Amazon', 'Flipkart', 'Myntra', 'Nykaa', 'Meesho', 'Tata Neu', 'Reliance', 'Vijay Sales'],
        food: ['Swiggy', 'Zomato', 'Instamart', 'Blinkit', 'Zepto', 'BigBasket'],
        dining: ['Dineout', 'District', 'Paytm', 'EazyDiner'],
        movie: ['PVR', 'BookMyShow', 'Paytm'],
        fuel: ['Indian Oil', 'HPCL', 'Reliance'],
    };

    const handleExpenseChange = (category: string, value: string) => {
        const numValue = parseFloat(value) || 0;
        setExpenses(prev => ({...prev, [category]: numValue}));

        if (numValue === 0) {
            setSelectedBrands(prev => ({...prev, [category]: []}));
        }
    };

    const toggleBrand = (category: string, brand: string) => {
        setSelectedBrands(prev => ({
            ...prev,
            [category]: prev[category]?.includes(brand)
                ? prev[category].filter(b => b !== brand)
                : [...(prev[category] || []), brand]
        }));
    };

    const categories = [
        {key: 'travel', label: 'Travel', icon: '✈️'},
        {key: 'hotel', label: 'Hotel', icon: '🏨'},
        {key: 'shopping', label: 'Shopping', icon: '🛍️'},
        {key: 'food', label: 'Food Delivery', icon: '🍔'},
        {key: 'dining', label: 'Dining', icon: '🍽️'},
        {key: 'movie', label: 'Movies', icon: '🎬'},
        {key: 'fuel', label: 'Fuel', icon: '⛽'},
        {key: 'health', label: 'Healthcare', icon: '🏥'},
        {key: 'bills', label: 'Bills & Utilities', icon: '💡'},
        {key: 'others', label: 'Others', icon: '📦'},
    ];

    const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Tell Us About Your Monthly Expenses</h3>
                <p className="text-gray-600">Enter your average monthly spending in each category</p>
            </div>

            {/* Personal Financial Information */}
            <Card className="border-blue-200 bg-blue-50/50 mb-6">
                <CardHeader>
                    <CardTitle className="text-blue-800">Personal Financial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* Credit Card Ownership */}
                    <div className="space-y-2">
                        <Label className="text-lg font-medium">
                            Do you currently have a credit card?
                        </Label>
                        <RadioGroup value={hasCreditCard ? "yes" : hasCreditCard === false ? "no" : ""}
                                    onValueChange={(value) => setHasCreditCard(value === "yes")}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="yes" id="has-card-yes"/>
                                <Label htmlFor="has-card-yes">Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="no" id="has-card-no"/>
                                <Label htmlFor="has-card-no">No</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Credit Limit - Only show if user has a credit card */}
                    {hasCreditCard && (
                        <div className="space-y-2">
                            <Label htmlFor="credit-limit" className="text-lg font-medium">
                                Current Credit Limit
                            </Label>
                            <Select value={creditLimit} onValueChange={setCreditLimit}>
                                <SelectTrigger id="credit-limit" className="w-full">
                                    <SelectValue placeholder="Select your credit limit"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="below-1l">Below ₹1 Lakh</SelectItem>
                                    <SelectItem value="1l-2.5l">₹1 Lakh - ₹2.5 Lakh</SelectItem>
                                    <SelectItem value="2.5l-5l">₹2.5 Lakh - ₹5 Lakh</SelectItem>
                                    <SelectItem value="5l-8l">₹5 Lakh - ₹8 Lakh</SelectItem>
                                    <SelectItem value="above-8l">Above ₹8 Lakh</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                    <Card key={category.key} className="border-gray-200">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{category.icon}</span>
                                <Label htmlFor={category.key} className="text-lg font-medium">
                                    {category.label}
                                </Label>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg font-medium">₹</span>
                                <Input
                                    id={category.key}
                                    type="number"
                                    placeholder="0"
                                    value={expenses[category.key] || ''}
                                    onChange={(e) => handleExpenseChange(category.key, e.target.value)}
                                    className="text-lg"
                                />
                            </div>

                            {expenses[category.key] > 0 && categoryBrands[category.key] && (
                                <div className="space-y-2">
                                    <Label className="text-sm text-gray-600">Select brands you use:</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {categoryBrands[category.key].map((brand) => (
                                            <Badge
                                                key={brand}
                                                variant={selectedBrands[category.key]?.includes(brand) ? "default" : "outline"}
                                                className="cursor-pointer hover:bg-blue-100 transition-colors"
                                                onClick={() => toggleBrand(category.key, brand)}
                                            >
                                                {brand}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {totalExpenses > 0 && (
                <Card className="border-green-200 bg-green-50">
                    <CardHeader>
                        <CardTitle className="text-green-800">Expense Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-700 mb-4">
                            Total Monthly Expenses: ₹{totalExpenses.toLocaleString()}
                        </div>
                        <Button
                            onClick={() => {
                                setIsLoading(true);
                                onComplete({
                                    expenses,
                                    selectedBrands,
                                    hasCreditCard,
                                    creditLimit
                                });
                                // Note: The loading state will remain true until the parent component
                                // completes its processing and re-renders this component
                            }}
                            className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                            disabled={totalExpenses === 0 || hasCreditCard === null || (hasCreditCard && !creditLimit) || isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Getting Recommendations...
                                </div>
                            ) : 'Get My Recommendations'}
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ExpenseForm;
