import {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Check, File, Upload, X, Lock, Plus} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

// Define a type for file with password
interface FileWithPassword {
    file: File;
    password: string;
}

interface FileUploadProps {
    onComplete: (files: FileWithPassword[]) => void;
}

const FileUpload = ({onComplete}: FileUploadProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<FileWithPassword[]>([]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const filesWithPasswords = files.map(file => ({
                file,
                password: ''
            }));
            // Limit to maximum 5 files total
            setUploadedFiles(prev => {
                const newFiles = [...prev, ...filesWithPasswords];
                return newFiles.slice(0, 5);
            });

            // Reset the file input value so the same file can be selected again
            e.target.value = '';
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const updateFilePassword = (index: number, password: string) => {
        setUploadedFiles(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, password } : item
            )
        );
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
                                    <div className="mt-1 flex items-center gap-2">
                                        <Lock className="h-3 w-3 text-gray-600" />
                                        <Input
                                            id={`file-password-${index}`}
                                            type="password"
                                            placeholder="Password (if protected)"
                                            value={fileWithPassword.password}
                                            onChange={(e) => updateFilePassword(index, e.target.value)}
                                            className="border-gray-300 text-xs h-7 py-0"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-green-700 mb-2">
                                {uploadedFiles.length >= 3
                                    ? "Enough files for analysis."
                                    : `Upload ${3 - uploadedFiles.length} more for better results (optional).`}
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

                            <Button
                                onClick={() => onComplete(uploadedFiles)}
                                className="bg-green-600 hover:bg-green-700 text-sm py-1 px-4 h-8"
                                disabled={uploadedFiles.length === 0}
                            >
                                Analyze ({uploadedFiles.length} files)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default FileUpload;
