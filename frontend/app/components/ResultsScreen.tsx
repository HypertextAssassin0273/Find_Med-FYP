import {
  CheckCircle,
  Pill,
  Factory,
  AlertCircle,
  Info,
  Scan,
  Home,
  Brain,
  Eye,
  FileText,
  Image as ImageIcon,
  X,
  Camera,
} from "lucide-react";
import { MedicineResult } from "../App"; // Ensure this import path matches your project
import { useState } from "react";

interface ResultsScreenProps {
  result: MedicineResult;
  // Updated: Accepts object or null
  uploadedImages: { front: string; back: string } | null;
  onBack: () => void;
  onNewScan: () => void;
  onRetake: () => void;
}

export function ResultsScreen({
  result,
  uploadedImages,
  onBack,
  onNewScan,
  onRetake,
}: ResultsScreenProps) {
  const [showImagePreview, setShowImagePreview] = useState(false);
  // State to toggle view in the modal
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  return (
    <>
      <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto pb-24">
        {/* Success Header */}
        <div className="text-center mt-6 mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 shadow-lg">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-green-900 mb-2 font-bold text-2xl">
            Medicine Identified!
          </h2>
          <p className="text-gray-600">Here are the details we found</p>
        </div>

        {/* Medicine Name Card */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-6 rounded-2xl shadow-xl mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Pill className="w-6 h-6 opacity-80" />
            <span className="text-blue-100 text-sm font-medium uppercase tracking-wide">
              Medicine Name
            </span>
          </div>
          <h3 className="text-white mb-1 text-3xl font-bold">{result.name}</h3>
          <p className="text-blue-100 text-lg">{result.dosage}</p>
        </div>

        {/* Details Cards */}
        <div className="space-y-4 mb-6">
          <DetailCard
            icon={<Factory className="w-5 h-5 text-purple-600" />}
            label="Manufacturer"
            value={result.manufacturer}
            bgColor="bg-purple-50"
          />

          <DetailCard
            icon={<Info className="w-5 h-5 text-blue-600" />}
            label="Active Ingredient"
            value={result.activeIngredient}
            bgColor="bg-blue-50"
          />

          <DetailCard
            icon={<CheckCircle className="w-5 h-5 text-green-600" />}
            label="Uses"
            value={result.uses}
            bgColor="bg-green-50"
          />

          <DetailCard
            icon={<AlertCircle className="w-5 h-5 text-orange-600" />}
            label="Side Effects"
            value={result.sideEffects}
            bgColor="bg-orange-50"
          />
        </div>

        {/* AI Confidence Scores */}
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white p-6 rounded-2xl shadow-xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5" />
            <span className="font-semibold">AI Analysis Confidence</span>
          </div>

          {/* Overall Confidence */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 text-sm">
                Overall Confidence
              </span>
              <span className="text-xl font-bold">
                {result.confidence.overall}%
              </span>
            </div>
            <div className="w-full bg-purple-900/30 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-1000 shadow-sm"
                style={{ width: `${result.confidence.overall}%` }}
              />
            </div>
          </div>

          {/* Individual Model Scores */}
          <div className="grid grid-cols-2 gap-3">
            <ModelScore
              icon={<Eye className="w-4 h-4" />}
              label="YOLO Detection"
              score={result.confidence.yoloDetection}
            />
            <ModelScore
              icon={<FileText className="w-4 h-4" />}
              label="OCR Accuracy"
              score={result.confidence.ocrAccuracy}
            />
          </div>
        </div>

        {/* AI Models Used */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900 font-medium">AI Models Used</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">Detection Model:</span>
              <span className="text-gray-900 bg-purple-50 px-3 py-1 rounded-lg text-sm font-medium border border-purple-100">
                {result.aiModels.detectionModel}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 text-sm">OCR Model:</span>
              <span className="text-gray-900 bg-blue-50 px-3 py-1 rounded-lg text-sm font-medium border border-blue-100">
                {result.aiModels.ocrModel}
              </span>
            </div>
          </div>
        </div>

        {/* Extracted Text */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="text-gray-900 font-medium">Extracted Text (OCR)</h3>
          </div>
          <p className="text-gray-700 font-mono text-sm bg-white p-3 rounded-lg border border-gray-200 break-words">
            {result.extractedText}
          </p>
        </div>

        {/* Review Uploaded Image Button */}
        {uploadedImages && (
          <button
            onClick={() => setShowImagePreview(true)}
            className="w-full bg-white cursor-pointer hover:bg-gray-50 text-gray-700 py-4 rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 mb-6 border border-gray-200"
          >
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Review Uploaded Images</span>
          </button>
        )}

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-900 mb-1 font-medium">
                Important Notice
              </p>
              <p className="text-yellow-800 text-sm leading-relaxed">
                This information is for reference only. Always consult a
                healthcare professional before taking any medication.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 max-w-md mx-auto w-full z-10">
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer text-gray-700 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>
            <button
              onClick={onNewScan}
              className="flex-1 bg-blue-700 hover:bg-blue-800 cursor-pointer text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              <Scan className="w-5 h-5" />
              <span className="font-medium">New Scan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImagePreview && uploadedImages && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full flex flex-col h-full max-h-[90vh]">
            {/* Header with Tabs */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex bg-gray-800 p-1 rounded-lg">
                <button
                  onClick={() => setPreviewSide("front")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    previewSide === "front"
                      ? "bg-white text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Front
                </button>
                <button
                  onClick={() => setPreviewSide("back")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    previewSide === "back"
                      ? "bg-white text-black"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Back
                </button>
              </div>

              <button
                onClick={() => setShowImagePreview(false)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Image Container */}
            <div className="bg-black/50 rounded-2xl overflow-hidden flex-1 flex items-center justify-center border border-gray-800 mb-4 relative">
              <img
                src={
                  previewSide === "front"
                    ? uploadedImages.front
                    : uploadedImages.back
                }
                alt={`Uploaded medicine ${previewSide}`}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-white text-xs">
                Viewing {previewSide} side
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImagePreview(false);
                  onRetake();
                }}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                <span className="font-medium">Retake Scan</span>
              </button>
              <button
                onClick={() => setShowImagePreview(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                <span className="font-medium">Close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Subcomponents helper
interface DetailCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  bgColor: string;
}

function DetailCard({ icon, label, value, bgColor }: DetailCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 transition-all hover:shadow-md">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p className="text-gray-500 text-sm mb-1 font-medium">{label}</p>
          <p className="text-gray-900 font-medium">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface ModelScoreProps {
  icon: React.ReactNode;
  label: string;
  score: number;
}

function ModelScore({ icon, label, score }: ModelScoreProps) {
  return (
    <div className="bg-purple-900/20 rounded-xl p-3 border border-purple-400/20">
      <div className="flex items-center gap-2 mb-2 text-purple-100">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="text-white text-lg font-bold">{score}%</p>
    </div>
  );
}
