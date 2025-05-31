import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Check, File, Upload, X, Plus, Loader2} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Define a type for file
interface FileWithPassword {
    file: File;
    cardName?: string;
}

// List of credit card names
const creditCardOptions = [
    "HDFC Bank Superia Credit Card",
    "AU Bank Xcite Ultra Credit Card",
    "Emirates Skywards ICICI Bank Sapphiro Credit Card",
    "HSBC Taj Credit Card",
    "IndusInd Bank Celesta Credit Card",
    "Times Black ICICI Bank Credit Card",
    "SBI Shaurya Credit Card",
    "Yes Private/Private Prime Credit Card",
    "HDFC Bank Millennia Credit Card",
    "ICICI Bank HPCL Super Saver Credit Card",
    "ICICI Bank HPCL Coral Credit Card",
    "IndusInd Bank Platinum RuPay Credit Card",
    "Axis Bank Pride Signature Credit Card",
    "Yes Bank Wellness Credit Card",
    "RBL Bank Titanium Delight Card",
    "IndusInd Bank Crest Credit Card",
    "YES Prosperity Cashback Plus Credit Card",
    "Standard Chartered DigiSmart Credit Card",
    "ICICI Bank Emeralde Private Metal Credit Card",
    "Kotak Royale Signature Credit Card",
    "Swiggy HDFC Bank Credit Card",
    "Federal Bank Visa Celesta Credit Card",
    "Paytm HDFC Bank Credit Card",
    "Emirates Skywards ICICI Bank Rubyx Credit Card",
    "Kotak Solitaire Credit Card",
    "IndusInd Bank Duo Plus Credit Card",
    "InterMiles ICICI Bank Coral Credit Card",
    "SBI Card Miles Elite",
    "Kotak Essentia Platinum Credit Card",
    "BOBCARD Premier Credit Card",
    "IndusInd Bank ePay Amex Credit Card",
    "PVR Kotak Platinum Credit Card",
    "HDFC Bank Diners Club Privilege Credit Card",
    "HDFC Bank Diners Club Miles Credit Card",
    "PVR Kotak Gold Credit Card",
    "HSBC Live+ Credit Card – Cashback on Groceries",
    "HDFC Bank Diners Club Black Credit Card",
    "Cashback SBI Credit Card",
    "BOBCARD Easy Credit Card",
    "Marriott Bonvoy HDFC Bank Credit Card",
    "InterMiles ICICI Bank Sapphiro Credit Card",
    "YES Bank EMI Credit Card",
    "EazyDiner IndusInd Bank Credit Card",
    "YES Prosperity Rewards Credit Card",
    "Axis Bank ACE Credit Card",
    "Amazon Pay ICICI Bank Credit Card",
    "ICICI Bank Expressions Credit Card",
    "EazyDiner IndusInd Platinum Credit Card",
    "SBI Prime Credit Card",
    "RBL Bank iGlobe Credit Card",
    "Flipkart Axis Bank Credit Card",
    "American Express Platinum Charge Card",
    "IndusInd Nexxt Credit Card",
    "Axis Bank Privilege Credit Card",
    "Paytm HDFC Bank Select Credit Card",
    "Myntra Kotak Credit Card",
    "American Express SmartEarn Credit Card",
    "RBL Bank Platinum Maxima Plus Credit Card",
    "Yes Bank Marquee Credit Card",
    "AU Altura Plus Credit Card",
    "Axis Bank Burgundy Private Credit Card",
    "AU Bank InstaPay Credit Card",
    "InterMiles HDFC Bank Signature Credit Card",
    "Kotak Mahindra Bank UPI RuPay Credit Card",
    "Kotak 811 Credit Card",
    "IndianOil Axis Bank RuPay Credit Card",
    "HDFC Bank Pixel Play Credit Card",
    "YES First Preferred Credit Card",
    "HDFC Bank RuPay IRCTC Credit Card",
    "ICICI Bank British Airways Classic Credit Card",
    "RBL Bank ShopRite Credit Card",
    "YES Elite+ Credit Card",
    "Axis Bank AURA Credit Card",
    "HSBC Visa Platinum Credit Card",
    "ICICI Bank Coral Credit Card",
    "InterMiles ICICI Bank Rubyx Credit Card",
    "ICICI Bank Rubyx Credit Card",
    "HDFC Bank Regalia Gold Credit Card",
    "ICICI Bank VISA Signature Credit Card",
    "Kotak League Platinum Credit Card",
    "6E Rewards – IndiGo HDFC Bank Credit Card",
    "IRCTC SBI RuPay Credit Card",
    "Axis Bank Cashback Credit Card",
    "Axis Bank Magnus Credit Card",
    "Indian Oil Kotak Credit Card",
    "HSBC TravelOne Credit Card",
    "Flipkart Axis Bank Super Elite Credit Card",
    "HSBC Premier Metal Credit Card",
    "HDFC Bank MoneyBack Plus Credit Card",
    "American Express Platinum Travel Credit Card",
    "Tata Neu Plus HDFC Bank Credit Card",
    "IndianOil Axis Bank Premium Credit Card",
    "SBI MILES Credit Card",
    "PVR INOX Kotak Credit Card",
    "AU Zenith+ Credit Card",
    "BOBCARD Select Credit Card",
    "IRCTC SBI Card Premier",
    "MakeMyTrip ICICI Bank Credit Card",
    "Axis Bank Horizon Credit Card",
    "Indian Oil HDFC Bank Credit Card",
    "Axis Bank SELECT Credit Card",
    "YES ACE Credit Card",
    "IndusInd Bank Indulge Credit Card",
    "Indus Solitaire Credit Card",
    "IndusInd Bank Pioneer Heritage Credit Card",
    "Tata Neu Infinity HDFC Bank Credit Card",
    "American Express Platinum Reserve Credit Card",
    "Standard Chartered EaseMyTrip Credit Card",
    "AU Altura Credit Card",
    "YES Bank Wellness Plus Credit Card",
    "SBI MILES PRIME Credit Card",
    "HDFC Bank All Miles Credit Card",
    "ICICI Bank Sapphiro Credit Card",
    "HDFC Bank Regalia Credit Card",
    "HDFC Bank Regalia First Credit Card",
    "InterMiles HDFC Bank Platinum Credit Card",
    "Standard Chartered Ultimate Credit Card",
    "YES Select Credit Card",
    "ICICI Bank Platinum Chip Credit Card",
    "Standard Chartered Platinum Rewards Credit Card",
    "Standard Chartered Smart Credit Card",
    "IRCTC RuPay BOBCARD Credit Card",
    "Axis Bank SuperMoney RuPay Credit Card",
    "RBL Bank Edition Credit Card",
    "IndusInd Bank Platinum Aura Edge Credit Card",
    "Axis Bank Neo Credit Card",
    "Airtel Axis Bank Credit Card",
    "SBI SimplyCLICK Credit Card",
    "HDFC Bank Diners Club Rewardz Credit Card",
    "HDFC Bank Pixel Go Credit Card",
    "SBI SimplySAVE UPI RuPay Credit Card",
    "RBL Bank Novio Credit Card",
    "Standard Chartered Priority Visa Infinite Credit Card",
    "HDFC Bank Diners Club Premium Credit Card",
    "Axis Bank Rewards Credit Card",
    "HDFC Platinum Times Credit Card",
    "YES Bank RESERV Credit Card",
    "RBL World Safari Credit Card",
    "HDFC Bank Diners Club Black Metal Edition Credit Card",
    "HDFC Bank Freedom Credit Card",
    "SBI ELITE Credit Card",
    "IndusInd Legend Credit Card",
    "Axis Bank Atlas Credit Card",
    "HDFC Bank INFINIA Metal Credit Card",
    "Axis My Zone Credit Card",
    "IndusInd Bank Platinum Credit Card",
    "Kotak Zen Signature Credit Card",
    "Standard Chartered Rewards Credit Card",
    "Axis Bank Miles & More Credit Card",
    "RBL Platinum Delight Credit Card",
    "Federal Bank Imperio Credit Card"
];

interface FileUploadProps {
    onComplete: (files: FileWithPassword[]) => void;
}

const FileUpload = ({onComplete}: FileUploadProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<FileWithPassword[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const filesWithoutPasswords = files.map(file => ({
                file,
                cardName: undefined // Initialize with undefined
            }));
            // Limit to maximum 5 files total
            setUploadedFiles(prev => {
                const newFiles = [...prev, ...filesWithoutPasswords];
                return newFiles.slice(0, 5);
            });

            // Reset the file input value so the same file can be selected again
            e.target.value = '';
        }
    };

    // Handle card selection for a specific file
    const handleCardSelection = (index: number, cardName: string) => {
        setUploadedFiles(prev => {
            const newFiles = [...prev];
            newFiles[index] = { ...newFiles[index], cardName };
            return newFiles;
        });
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-4">
            {/* Upload Area - Only shown when no files are uploaded */}
            {uploadedFiles.length === 0 && (
                <div className="text-center">
                    <Upload className="h-16 w-16 text-blue-600 mx-auto mb-4"/>
                    <h4 className="text-xl font-semibold mb-3 text-gray-800">
                        Upload Previous Statements
                    </h4>
                    <p className="text-gray-600 mb-4">
                        Upload your credit card statements for accurate analysis. We recommend at least 3 months of data.
                    </p>

                    <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                    />
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                            const input = document.getElementById('file-upload') as HTMLInputElement;
                            if (input) {
                                input.value = ''; // Reset input value
                                input.click();
                            }
                        }}
                    >
                        Upload Files
                    </Button>

                    <p className="text-xs text-gray-500 mt-2">
                        PDF files only. Max: 10MB each
                    </p>
                </div>
            )}

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-3">
                        <h4 className="text-sm font-semibold mb-2 text-green-800 flex items-center gap-1">
                            <Check className="h-4 w-4"/>
                            Uploaded Files ({uploadedFiles.length})
                        </h4>

                        <div className="space-y-2 mb-3">
                            {uploadedFiles.map((fileWithPassword, index) => (
                                <div key={index}
                                     className="flex flex-col p-2 bg-white rounded-lg border border-green-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <File className="h-5 w-5 text-red-500"/>
                                            <div className="truncate max-w-[200px]">
                                                <p className="font-medium text-sm text-gray-800 truncate">{fileWithPassword.file.name}</p>
                                                <p className="text-xs text-gray-600">{formatFileSize(fileWithPassword.file.size)}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeFile(index)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
                                        >
                                            <X className="h-3 w-3"/>
                                        </Button>
                                    </div>

                                    {/* Card Selection Dropdown */}
                                    <div className="mt-2">
                                        <Label htmlFor={`card-select-${index}`} className="text-xs text-gray-600 mb-1">
                                            Choose your credit card
                                        </Label>
                                        <Select
                                            value={fileWithPassword.cardName}
                                            onValueChange={(value) => handleCardSelection(index, value)}
                                        >
                                            <SelectTrigger id={`card-select-${index}`} className="w-full text-xs h-8">
                                                <SelectValue placeholder="Select a credit card" />
                                            </SelectTrigger>
                                            <SelectContent className="max-h-[200px] overflow-y-auto">
                                                {creditCardOptions.map((card, cardIndex) => (
                                                    <SelectItem key={cardIndex} value={card} className="text-xs">
                                                        {card}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-green-700 mb-2">
                                {uploadedFiles.length >= 3
                                    ? "Enough files for analysis."
                                    : `Upload ${3 - uploadedFiles.length} more files for better results (optional).`}
                            </p>

                            <div className="flex justify-center mb-2">
                                <div>
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                        id="add-more-files"
                                    />
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent event propagation
                                            const input = document.getElementById('add-more-files') as HTMLInputElement;
                                            if (input) {
                                                // Reset the input value before clicking to ensure onChange fires even if same file is selected
                                                input.value = '';
                                                input.click();
                                            }
                                        }}
                                        variant="outline"
                                        className="flex items-center gap-1 text-xs py-1 px-2 h-7"
                                        disabled={uploadedFiles.length >= 5}
                                    >
                                        <Plus className="h-3 w-3" />
                                        Add More
                                    </Button>
                                </div>
                                {uploadedFiles.length >= 5 && (
                                    <p className="text-amber-600 text-xs ml-2 mt-1">
                                        Max 5 files
                                    </p>
                                )}
                            </div>

                            {/* Credit card selection is optional */}

                            <Button
                                onClick={() => {
                                    setIsLoading(true);
                                    // Call onComplete with the uploaded files
                                    onComplete(uploadedFiles);
                                    // Note: The loading state will remain true until the parent component
                                    // completes its processing and re-renders this component
                                }}
                                className="bg-green-600 hover:bg-green-700 text-sm py-1 px-4 h-8"
                                disabled={uploadedFiles.length === 0 || isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center">
                                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                        Analyzing...
                                    </div>
                                ) : `Get Recommendations`}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default FileUpload;
