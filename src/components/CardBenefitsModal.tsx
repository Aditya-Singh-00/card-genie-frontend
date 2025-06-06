import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {CreditCard, Gift, Plane, Shield, Star, DollarSign, IndianRupee} from 'lucide-react';

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

interface FeeStructure {
  joiningFee: string;
  annualFee: string;
  renewalFee: string;
  renewalFeeWaiver: string;
  forexMarkup: string;
  fuelSurchargeWaiver: string;
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
  feeStructure: FeeStructure;
  applyUrl: string;
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
    // Helper function to add Rupee symbol if not already present
    const addRupeeSymbol = (value: string | undefined): string => {
        if (!value) return 'Not specified';
        // If value already has Rupee symbol, return as is
        if (value.includes('₹')) return value;
        // If value starts with "Rs", replace it with Rupee symbol
        if (value.startsWith('Rs')) return value.replace('Rs', '₹');
        // Otherwise, add Rupee symbol at the beginning
        return `₹${value}`;
    };
    // Use API data if available, otherwise use fallback data
    const benefitsData = card.originalData ? {
        eligibility: [
            {feature: 'Age', detail: card.originalData.eligibilityCriteria?.age || 'Not specified'},
            {feature: 'Income/TRV', detail: card.originalData.eligibilityCriteria?.income_trv || 'Not specified'},
            {feature: 'Other Criteria', detail: card.originalData.eligibilityCriteria?.others || 'Not specified'},
        ],
        fees: card.originalData.feeStructure ? [
            {feature: 'Joining Fee', detail: addRupeeSymbol(card.originalData.feeStructure.joiningFee) || 'Not specified'},
            {feature: 'Renewal Fee', detail: addRupeeSymbol(card.originalData.feeStructure.renewalFee) || 'Not specified'},
            {feature: 'Renewal Fee Waiver', detail: addRupeeSymbol(card.originalData.feeStructure.renewalFeeWaiver) || 'Not specified'},
            {feature: 'Forex Markup', detail: card.originalData.feeStructure.forexMarkup || 'Not specified'},
            {feature: 'Fuel Surcharge Waiver', detail: addRupeeSymbol(card.originalData.feeStructure.fuelSurchargeWaiver) || 'Not specified'},
            {feature: 'Other Fees', detail: addRupeeSymbol(card.originalData.feeStructure.others) || 'Not specified'},
        ] : [],
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
            {feature: 'Joining Fee', detail: '₹500 + GST'},
            {feature: 'Renewal Fee', detail: '₹10,000 + GST'},
            {feature: 'Renewal Fee Waiver', detail: 'Waived on ₹8L+ spends'},
            {feature: 'Forex Markup', detail: '3.5% + GST'},
            {feature: 'Fuel Surcharge Waiver', detail: '1% up to ₹500/month'},
            {feature: 'Other Fees', detail: 'Cash Advance: 2.5% or ₹500, whichever is higher'},
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
                            <div className="text-3xl font-bold">{typeof card.totalReturn === 'string' ? card.totalReturn : String(card.totalReturn || '₹0')}</div>
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
                        <TabsTrigger value="fees" className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4"/>
                            Fees
                        </TabsTrigger>
                        <TabsTrigger value="rewards" className="flex items-center gap-2">
                            <Star className="h-4 w-4"/>
                            Rewards
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
                                                <p className="text-sm text-gray-600">{item.amount} rewards rate</p>
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
                                                {typeof card.totalReturn === 'string' ? card.totalReturn : String(card.totalReturn || '₹0')}
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

                    <TabsContent value="fees" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Fee Structure</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {benefitsData.fees.map((fee, index) => (
                                        <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                            <h4 className="font-semibold text-gray-800 mb-1">{fee.feature}</h4>
                                            <p className="text-gray-600">{fee.detail}</p>
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


                </Tabs>

                <div className="flex gap-4 mt-6">
                    <Button
                        className={`w-full bg-gradient-to-r ${card.theme.gradient} text-white hover:opacity-90`}
                        onClick={() => {
                            if (card.originalData?.applyUrl) {
                                window.open(card.originalData.applyUrl, '_blank');
                            }
                        }}
                    >
                        Apply for {card.name}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CardBenefitsModal;
