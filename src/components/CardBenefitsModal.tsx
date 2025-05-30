import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {CreditCard, Gift, Plane, Shield, Star} from 'lucide-react';

interface CardBenefitsModalProps {
    card: any;
    onClose: () => void;
}

const CardBenefitsModal = ({card, onClose}: CardBenefitsModalProps) => {
    const benefitsData = {
        eligibility: [
            {feature: 'Minimum Age', detail: '21 years'},
            {feature: 'Minimum Income', detail: '₹30,000/month'},
            {feature: 'Credit Score', detail: '750+'},
        ],
        fees: [
            {feature: 'Annual Fee', detail: '₹10,000'},
            {feature: 'Renewal Fee', detail: 'Waived on ₹8L+ spends'},
            {feature: 'Foreign Transaction', detail: '3.5%'},
        ],
        rewards: [
            {feature: 'Dining', detail: '10X rewards'},
            {feature: 'Travel', detail: '8X rewards'},
            {feature: 'Shopping', detail: '5X rewards'},
            {feature: 'Others', detail: '1X rewards'},
        ],
        travel: [
            {feature: 'Domestic Lounges', detail: 'Unlimited access'},
            {feature: 'International Lounges', detail: '4 per quarter'},
            {feature: 'Priority Pass', detail: 'Complimentary membership'},
            {feature: 'Golf Privileges', detail: '12 rounds per year'},
        ],
        premium: [
            {feature: 'Concierge Service', detail: '24/7 assistance'},
            {feature: 'Insurance Cover', detail: '₹1 Crore'},
            {feature: 'Emergency Card', detail: '48 hours worldwide'},
        ],
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-800">
                        {card.name} - Complete Benefits
                    </DialogTitle>
                </DialogHeader>

                <div className={`p-6 rounded-lg bg-gradient-to-r ${card.theme.gradient} text-white mb-6`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold">{card.name}</h3>
                            <p className="text-lg opacity-90">Premium Credit Card</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold">{card.returnPercentage}%</div>
                            <div className="text-sm opacity-90">Total Returns</div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="returns" className="w-full">
                    <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="returns" className="flex items-center gap-2">
                            <Gift className="h-4 w-4"/>
                            Returns
                        </TabsTrigger>
                        <TabsTrigger value="eligibility" className="flex items-center gap-2">
                            <Shield className="h-4 w-4"/>
                            Eligibility
                        </TabsTrigger>
                        <TabsTrigger value="fees" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4"/>
                            Fees
                        </TabsTrigger>
                        <TabsTrigger value="rewards" className="flex items-center gap-2">
                            <Star className="h-4 w-4"/>
                            Rewards
                        </TabsTrigger>
                        <TabsTrigger value="travel" className="flex items-center gap-2">
                            <Plane className="h-4 w-4"/>
                            Travel
                        </TabsTrigger>
                        <TabsTrigger value="premium" className="flex items-center gap-2">
                            <Shield className="h-4 w-4"/>
                            Premium
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="returns" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Returns Breakup</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {card.returnBreakup.map((item: any, index: number) => (
                                        <div key={index}
                                             className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{item.category}</h4>
                                                <p className="text-sm text-gray-600">{item.percentage}% rewards rate</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600">₹{item.amount}</div>
                                                <div className="text-sm text-gray-600">Monthly returns</div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="border-t pt-4">
                                        <div
                                            className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                            <h4 className="font-bold text-gray-800">Total Monthly Returns</h4>
                                            <div className="text-xl font-bold text-green-600">
                                                ₹{card.returnBreakup.reduce((sum: number, item: any) => sum + item.amount, 0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {Object.entries(benefitsData).map(([category, benefits]) => (
                        <TabsContent key={category} value={category} className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="capitalize">{category} Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {benefits.map((benefit, index) => (
                                            <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                                <h4 className="font-semibold text-gray-800 mb-1">{benefit.feature}</h4>
                                                <p className="text-gray-600">{benefit.detail}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>

                <div className="flex gap-4 mt-6">
                    <Button
                        className={`w-full bg-gradient-to-r ${card.theme.gradient} text-white hover:opacity-90`}
                    >
                        Apply for {card.name}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CardBenefitsModal;
