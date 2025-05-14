'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from "@/components/ui/progress";
import { handleFileUploadAndAnalyze } from '@/app/actions';
import { cn } from '@/lib/utils';

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const readFileContent = (selectedFile: File) => {
    const reader = new FileReader();
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded * 100) / event.total);
        setUploadProgress(progress);
      }
    };

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        if (!content) {
            throw new Error("File content is empty.");
        }
        setCsvData(content);
        setError(null); // Clear previous errors
        setUploadProgress(100);
      } catch (err) {
        console.error("Error reading file:", err);
        setError("Error reading file. Please ensure it's a valid text-based CSV.");
        setFile(null);
        setCsvData(null);
        setUploadProgress(0);
      }
    };
    reader.onerror = () => {
      console.error("FileReader error");
      setError('Failed to read file. Please try again.');
      setFile(null);
      setCsvData(null);
      setUploadProgress(0);
    };
    reader.readAsText(selectedFile);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setAnalysisResult(null); // Clear previous results
    setError(null); // Clear previous errors
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setUploadProgress(0);
        readFileContent(selectedFile);
      } else {
        setError('Invalid file type. Please upload a CSV file.');
        setFile(null);
        setCsvData(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    multiple: false,
  });

  const handleSubmit = async () => {
    if (!csvData) {
      setError('No CSV data to analyze. Please upload a file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const result = await handleFileUploadAndAnalyze(csvData);

    if (result.summary) {
      setAnalysisResult(result.summary);
    } else if (result.error) {
      setError(result.error);
    }
    setIsLoading(false);
  };

  const clearFile = () => {
    setFile(null);
    setCsvData(null);
    setAnalysisResult(null);
    setError(null);
    setUploadProgress(0);
  };
  
  const baseStyle = "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out flex flex-col items-center justify-center space-y-3 h-48";
  const activeStyle = "border-primary bg-primary/10";
  const acceptStyle = "border-accent bg-accent/10";
  const rejectStyle = "border-destructive bg-destructive/10";

  const dropzoneClassName = cn(
    baseStyle,
    isDragActive ? activeStyle : "border-border hover:border-primary/70",
    isDragAccept ? acceptStyle : "",
    isDragReject ? rejectStyle : ""
  );


  return (
    <div className="space-y-6">
      <div {...getRootProps()} className={dropzoneClassName}>
        <input {...getInputProps()} />
        <UploadCloud className={cn("w-12 h-12", isDragActive ? "text-primary" : "text-muted-foreground")} />
        {isDragActive ? (
          <p className="text-primary">Drop the file here ...</p>
        ) : (
          <p className="text-muted-foreground">Drag &amp; drop a CSV file here, or click to select file</p>
        )}
        <p className="text-xs text-muted-foreground">.CSV files only</p>
      </div>

      {file && (
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-primary" />
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile} aria-label="Remove file">
                <X className="w-5 h-5 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
                 <Progress value={uploadProgress} className="w-full h-2 mt-2" />
            )}
            {uploadProgress === 100 && !analysisResult && !isLoading && (
                 <div className="mt-2 text-sm text-green-600 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1.5"/>File ready for analysis.</div>
            )}
          </CardContent>
        </Card>
      )}

      {csvData && !isLoading && !analysisResult && (
        <div className="text-center">
          <Button onClick={handleSubmit} size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <UploadCloud className="mr-2 h-5 w-5" />
            Analyze Data
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-3 p-6 rounded-md text-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-lg font-medium text-primary">Analyzing data...</p>
          <p className="text-sm text-muted-foreground">This may take a few moments.</p>
        </div>
      )}

      {error && !isLoading && (
        <Card className="border-destructive bg-destructive/5 shadow-md">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" />
              Analysis Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive-foreground text-sm whitespace-pre-wrap">{error}</p>
          </CardContent>
        </Card>
      )}

      {analysisResult && !isLoading && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-primary flex items-center">
              <CheckCircle2 className="w-7 h-7 mr-2 text-green-600" />
              Analysis Report
            </CardTitle>
            <CardDescription>
              Below is the summary generated from your CEAI survey data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-4 rounded-md border">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-mono text-foreground">
                    {analysisResult}
                </pre>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
              This report was generated by an AI model. Please review carefully.
            </p>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
