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

// ---------------------------------------------------------
// THIS IS THE CONTRACT YOUR BACKEND MUST FOLLOW
// The JSON response from the backend MUST match this structure
// ---------------------------------------------------------
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

// HELPER: Converts Base64 string to a Blob (File) for upload
const base64ToBlob = async (base64Data: string) => {
  const response = await fetch(base64Data);
  const blob = await response.blob();
  return blob;
};

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home");
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

  const handleAnalyze = async () => {
    if (!selectedImages) return;

    setCurrentScreen("analyzing");

    try {
      // --- STEP 1: PREPARE DATA ---
      const formData = new FormData();
      const frontBlob = await base64ToBlob(selectedImages.front);
      const backBlob = await base64ToBlob(selectedImages.back);

      formData.append("front_image", frontBlob, "front.jpg");
      formData.append("back_image", backBlob, "back.jpg");

      // --- STEP 2: CALL API #1 (UPLOAD) ---
      // Ask Backend Engr for this URL (e.g., /api/upload)
      const UPLOAD_URL = "http://localhost:8000/api/upload_images";

      const uploadResponse = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload Failed: ${uploadResponse.statusText}`);
      }

      // Get the ID from the first response
      // CRITICAL: Ask your backend engr what this key is named!
      const uploadData = await uploadResponse.json();
      const scanId = uploadData.scan_id; // <--- Example: could be .id, .jobId, etc.

      if (!scanId) {
        throw new Error("Backend did not return a Scan ID");
      }

      // --- STEP 3: CALL API #2 (FETCH RESULTS) ---
      // Ask Backend Engr for this URL structure (e.g., /api/results/{id})
      const RESULTS_URL = `http://localhost:8000/api/get_results/${scanId}`;

      const resultsResponse = await fetch(RESULTS_URL, {
        method: "GET", // Usually GET for fetching results
        // Headers might be needed depending on backend
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!resultsResponse.ok) {
        throw new Error(`Result Fetch Failed: ${resultsResponse.statusText}`);
      }

      // --- STEP 4: UPDATE UI ---
      const realData: MedicineResult = await resultsResponse.json();
      setMedicineResult(realData);
      setCurrentScreen("results");
    } catch (error) {
      console.error("Error analyzing medicine:", error);
      alert("Failed to analyze images. Check console.");
      setCurrentScreen("image-review");
    }
  };

  const handleBack = () => {
    if (currentScreen === "scan-options") {
      setCurrentScreen("home");
    } else if (currentScreen === "image-review") {
      setCurrentScreen("scan-options");
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

      {currentScreen === "image-review" && selectedImages && (
        <ImageReview
          images={selectedImages}
          onAnalyze={handleAnalyze}
          onBack={handleBack}
        />
      )}

      {currentScreen === "analyzing" && <AnalyzingScreen />}

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
