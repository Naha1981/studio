import { FileUpload } from '@/components/file-uploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans">
      <div className="w-full max-w-3xl flex-grow">
        <header className="mb-8 text-center py-6 md:py-10 flex justify-between items-center">
          <div className="flex items-center justify-center space-x-3 flex-grow">
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary tracking-tight">
              CEAI Insights
            </h1>
          </div>
          <ModeToggle />
        </header>

        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardHeader className="bg-card/50 border-b">
            <CardTitle className="text-xl sm:text-2xl text-center text-primary-foreground bg-primary py-4 -mx-6 -mt-6 px-6 rounded-t-xl">
              Upload Survey Data
            </CardTitle>
             <CardDescription className="text-center pt-4 text-sm sm:text-base">
              Drag and drop your .csv file below or click to select.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 md:p-8">
            <FileUpload />
          </CardContent>
        </Card>
      </div>
      <footer className="w-full text-center p-6 mt-8">
        
      </footer>
    </main>
  );
}
