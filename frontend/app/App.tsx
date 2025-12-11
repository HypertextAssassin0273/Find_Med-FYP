import { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ScanOptions } from './components/ScanOptions';
import { ImageReview } from './components/ImageReview';
import { ResultsScreen } from './components/ResultsScreen';
import { AnalyzingScreen } from './components/AnalyzingScreen';

export type Screen = 'home' | 'scan-options' | 'image-review' | 'analyzing' | 'results';

export interface MedicineResult {
  name: string;
  dosage: string;
  manufacturer: string;
  activeIngredient: string;
  uses: string;
  sideEffects: string;
  confidence: {
    overall: number;
    yoloDetection: number;
    ocrAccuracy: number;
  };
  aiModels: {
    detectionModel: string;
    ocrModel: string;
  };
  extractedText: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [medicineResult, setMedicineResult] = useState<MedicineResult | null>(null);

  const handleScanClick = () => {
    setCurrentScreen('scan-options');
  };

  const handleImageSelected = (imageData: string) => {
    setSelectedImage(imageData);
    setCurrentScreen('image-review');
  };

  const handleAnalyze = () => {
    setCurrentScreen('analyzing');
    // Simulate API call - in production, this would call your backend
    setTimeout(() => {
      setMedicineResult({
        name: 'Paracetamol',
        dosage: '500mg',
        manufacturer: 'PharmaCorp Industries',
        activeIngredient: 'Acetaminophen',
        uses: 'Pain relief and fever reduction',
        sideEffects: 'Nausea, rash, or allergic reactions (rare)',
        confidence: {
          overall: 94.5,
          yoloDetection: 96.8,
          ocrAccuracy: 92.3
        },
        aiModels: {
          detectionModel: 'YOLOv8',
          ocrModel: 'Tesseract OCR'
        },
        extractedText: 'PARACETAMOL 500MG PHARMACORP INDUSTRIES'
      });
      setCurrentScreen('results');
    }, 2500);
  };

  const handleBack = () => {
    if (currentScreen === 'scan-options') {
      setCurrentScreen('home');
    } else if (currentScreen === 'image-review') {
      setCurrentScreen('scan-options');
      setSelectedImage(null);
    } else if (currentScreen === 'results') {
      setCurrentScreen('home');
      setSelectedImage(null);
      setMedicineResult(null);
    }
  };

  const handleNewScan = () => {
    setCurrentScreen('scan-options');
    setSelectedImage(null);
    setMedicineResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {currentScreen === 'home' && <HomeScreen onScanClick={handleScanClick} />}
      {currentScreen === 'scan-options' && (
        <ScanOptions onImageSelected={handleImageSelected} onBack={handleBack} />
      )}
      {currentScreen === 'image-review' && selectedImage && (
        <ImageReview
          imageData={selectedImage}
          onAnalyze={handleAnalyze}
          onBack={handleBack}
        />
      )}
      {currentScreen === 'analyzing' && <AnalyzingScreen />}
      {currentScreen === 'results' && medicineResult && (
        <ResultsScreen
          result={medicineResult}
          uploadedImage={selectedImage}
          onBack={handleBack}
          onNewScan={handleNewScan}
          onRetake={() => {
            setCurrentScreen('scan-options');
            setSelectedImage(null);
            setMedicineResult(null);
          }}
        />
      )}
    </div>
  );
}