import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {CreditCard, Gift, Plane, Shield, Star} from 'lucide-react';

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

interface CardBenefitsModalProps {
    card: {
        id: number;
        name: string;
        image: string;
        totalReturn: string;
        currentReturn: string;
        returnValue: number;
        isTopRecommended: boolean;
        keyBenefits: string[];
        returnBreakup: Array<{
            category: string;
            percentage: string | number;
            amount: string | number;
        }>;
        theme: {
            primary: string;
            secondary: string;
            gradient: string;
        };
        originalData?: CardRecommendation;
    };
    onClose: () => void;
}

const CardBenefitsModal = ({card, onClose}: CardBenefitsModalProps) => {
    // Use API data if available, otherwise use fallback data
    const benefitsData = card.originalData ? {
        eligibility: [
            {feature: 'Age', detail: card.originalData.eligibilityCriteria?.age || 'Not specified'},
            {feature: 'Income/TRV', detail: card.originalData.eligibilityCriteria?.income_trv || 'Not specified'},
            {feature: 'Other Criteria', detail: card.originalData.eligibilityCriteria?.others || 'Not specified'},
        ],
        rewards: card.originalData.rewardSummary
            ? card.originalData.rewardSummary
                .filter(reward => reward.rewardCategory !== 'Domestic Lounge' &&
                                reward.rewardCategory !== 'International Lounge' &&
                                reward.rewardCategory !== 'TRAVEL')
                .map(reward => ({
                    feature: reward.rewardCategory,
                    detail: reward.rewardStructures && reward.rewardStructures[0]
                        ? reward.rewardStructures[0].valueForCalculation
                        : 'Not specified'
                }))
            : [],
        travel: card.originalData.rewardSummary
            ? card.originalData.rewardSummary
                .filter(reward => reward.rewardCategory === 'TRAVEL' ||
                                reward.rewardCategory === 'FLIGHT(Travel)' ||
                                reward.rewardCategory === 'HOTEL(Travel)')
                .map(reward => ({
                    feature: reward.rewardCategory,
                    detail: reward.rewardStructures && reward.rewardStructures[0]
                        ? reward.rewardStructures[0].valueForCalculation
                        : 'Not specified'
                }))
            : [],
        lounge: [
            ...(card.originalData.rewardSummary
                ? card.originalData.rewardSummary
                    .filter(reward => reward.rewardCategory === 'Domestic Lounge')
                    .map(reward => ({
                        feature: 'Domestic Lounge',
                        detail: reward.rewardStructures && reward.rewardStructures[0]
                            ? reward.rewardStructures[0].valueForCalculation
                            : 'Not specified'
                    }))
                : []),
            ...(card.originalData.rewardSummary
                ? card.originalData.rewardSummary
                    .filter(reward => reward.rewardCategory === 'International Lounge')
                    .map(reward => ({
                        feature: 'International Lounge',
                        detail: reward.rewardStructures && reward.rewardStructures[0]
                            ? reward.rewardStructures[0].valueForCalculation
                            : 'Not specified'
                    }))
                : [])
        ],
        benefits: card.originalData.benefits
            ? card.originalData.benefits.map(benefit => ({
                feature: 'Benefit',
                detail: benefit.title || 'Not specified'
            }))
            : [],
    } : {
        // Fallback data if originalData is not available
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
        lounge: [
            {feature: 'Domestic Lounges', detail: 'Unlimited access'},
            {feature: 'International Lounges', detail: '4 per quarter'},
        ],
        benefits: [
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
                            <div className="text-3xl font-bold">{card.totalReturn}</div>
                            <div className="text-sm opacity-90">Total Returns</div>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="returns" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="returns" className="flex items-center gap-2">
                            <Gift className="h-4 w-4"/>
                            Returns
                        </TabsTrigger>
                        <TabsTrigger value="eligibility" className="flex items-center gap-2">
                            <Shield className="h-4 w-4"/>
                            Eligibility
                        </TabsTrigger>
                        <TabsTrigger value="rewards" className="flex items-center gap-2">
                            <Star className="h-4 w-4"/>
                            Rewards
                        </TabsTrigger>
                        <TabsTrigger value="benefits" className="flex items-center gap-2">
                            <Shield className="h-4 w-4"/>
                            Benefits
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
                                                <p className="text-sm text-gray-600">{item.percentage} rewards rate</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-green-600">{item.amount}</div>
                                                <div className="text-sm text-gray-600">Monthly returns</div>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="border-t pt-4">
                                        <div
                                            className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                            <h4 className="font-bold text-gray-800">Total Monthly Returns</h4>
                                            <div className="text-xl font-bold text-green-600">
                                                {card.totalReturn}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="eligibility" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Eligibility Criteria</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {benefitsData.eligibility.map((benefit, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-1">{benefit.feature}</h4>
                                            <p className="text-gray-600">{benefit.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="rewards" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Reward Structure</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {benefitsData.rewards.map((benefit, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-1">{benefit.feature}</h4>
                                            <p className="text-gray-600">{benefit.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>


                    <TabsContent value="benefits" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Additional Benefits</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {benefitsData.benefits.map((benefit, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-1">{benefit.feature}</h4>
                                            <p className="text-gray-600">{benefit.detail}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
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
