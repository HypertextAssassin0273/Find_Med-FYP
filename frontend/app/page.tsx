"use client";

import { useState } from "react";

// Adjust these imports based on where you placed your components folder
import { HomeScreen } from "./components/HomeScreen";
import { ScanOptions } from "./components/ScanOptions";
import { ImageReview } from "./components/ImageReview";
import { ResultsScreen } from "./components/ResultsScreen";
import { AnalyzingScreen } from "./components/AnalyzingScreen";

export type Screen =
  | "home"
  | "scan-options"
  | "image-review"
  | "analyzing"
  | "results";

// Interface for our dual-image storage
export interface ScannedImages {
  front: string;
  back: string;
}

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

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");

  // State to hold both images
  const [selectedImages, setSelectedImages] = useState<ScannedImages | null>(
    null
  );

  const [medicineResult, setMedicineResult] = useState<MedicineResult | null>(
    null
  );

  const handleScanClick = () => {
    setCurrentScreen("scan-options");
  };

  const handleImagesSelected = (images: ScannedImages) => {
    setSelectedImages(images);
    setCurrentScreen("image-review");
  };

  const handleAnalyze = () => {
    setCurrentScreen("analyzing");

    // Simulate API call - sending both front and back
    console.log(
      "Analyzing Front:",
      selectedImages?.front ? "Present" : "Missing"
    );
    console.log(
      "Analyzing Back:",
      selectedImages?.back ? "Present" : "Missing"
    );

    setTimeout(() => {
      setMedicineResult({
        name: "Paracetamol",
        dosage: "500mg",
        manufacturer: "PharmaCorp Industries",
        activeIngredient: "Acetaminophen",
        uses: "Pain relief and fever reduction",
        sideEffects: "Nausea, rash, or allergic reactions (rare)",
        confidence: {
          overall: 94.5,
          yoloDetection: 96.8,
          ocrAccuracy: 92.3,
        },
        aiModels: {
          detectionModel: "YOLOv8",
          ocrModel: "Tesseract OCR",
        },
        extractedText: "PARACETAMOL 500MG PHARMACORP INDUSTRIES",
      });
      setCurrentScreen("results");
    }, 2500);
  };

  const handleBack = () => {
    if (currentScreen === "scan-options") {
      setCurrentScreen("home");
    } else if (currentScreen === "image-review") {
      setCurrentScreen("scan-options");
      // Reset images if going back to scan options
      setSelectedImages(null);
    } else if (currentScreen === "results") {
      setCurrentScreen("home");
      setSelectedImages(null);
      setMedicineResult(null);
    }
  };

  const handleNewScan = () => {
    setCurrentScreen("scan-options");
    setSelectedImages(null);
    setMedicineResult(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {currentScreen === "home" && <HomeScreen onScanClick={handleScanClick} />}

      {currentScreen === "scan-options" && (
        <ScanOptions
          onImagesSelected={handleImagesSelected}
          onBack={handleBack}
        />
      )}

      {/* FIXED: Removed 'imageData' prop, only passing 'images' */}
      {currentScreen === "image-review" && selectedImages && (
        <ImageReview
          images={selectedImages}
          onAnalyze={handleAnalyze}
          onBack={handleBack}
        />
      )}

      {currentScreen === "analyzing" && <AnalyzingScreen />}

      {/* FIXED: Removed 'uploadedImage' prop, only passing 'uploadedImages' */}
      {currentScreen === "results" && medicineResult && (
        <ResultsScreen
          result={medicineResult}
          uploadedImages={selectedImages}
          onBack={handleBack}
          onNewScan={handleNewScan}
          onRetake={() => {
            setCurrentScreen("scan-options");
            setSelectedImages(null);
            setMedicineResult(null);
          }}
        />
      )}
    </main>
  );
}
