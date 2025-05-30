import {useCallback, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Check, File, Upload, X} from 'lucide-react';

interface FileUploadProps {
    onComplete: () => void;
}

const FileUpload = ({onComplete}: FileUploadProps) => {
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files).filter(file =>
            file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        );

        setUploadedFiles(prev => [...prev, ...files]);
    }, []);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setUploadedFiles(prev => [...prev, ...files]);
        }
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
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Upload Your Credit Card Statements</h3>
                <p className="text-gray-600">Upload PDF statements from the last 3-6 months for better
                    recommendations</p>
            </div>

            {/* Upload Area */}
            <Card
                className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
                    isDragOver
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <CardContent className="p-12 text-center">
                    <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4"/>
                    <h4 className="text-xl font-semibold mb-2 text-gray-800">
                        Drag & drop your PDF statements here
                    </h4>
                    <p className="text-gray-600 mb-6">or click to browse files</p>

                    <input
                        type="file"
                        multiple
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                    />
                    <label htmlFor="file-upload">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Choose Files
                        </Button>
                    </label>

                    <p className="text-sm text-gray-500 mt-4">
                        Only PDF files are accepted. Maximum file size: 10MB each
                    </p>
                </CardContent>
            </Card>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="p-6">
                        <h4 className="text-lg font-semibold mb-4 text-green-800 flex items-center gap-2">
                            <Check className="h-5 w-5"/>
                            Uploaded Files ({uploadedFiles.length})
                        </h4>

                        <div className="space-y-3 mb-6">
                            {uploadedFiles.map((file, index) => (
                                <div key={index}
                                     className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-200">
                                    <div className="flex items-center gap-3">
                                        <File className="h-8 w-8 text-red-500"/>
                                        <div>
                                            <p className="font-medium text-gray-800">{file.name}</p>
                                            <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-green-700 mb-4">
                                {uploadedFiles.length >= 3
                                    ? "Great! You've uploaded enough files for accurate analysis."
                                    : `Upload ${3 - uploadedFiles.length} more files for better recommendations (optional).`}
                            </p>

                            <Button
                                onClick={onComplete}
                                className="bg-green-600 hover:bg-green-700 text-lg py-3 px-8"
                                disabled={uploadedFiles.length === 0}
                            >
                                Analyze My Statements ({uploadedFiles.length} files)
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default FileUpload;
