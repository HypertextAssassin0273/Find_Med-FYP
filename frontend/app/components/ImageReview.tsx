import { useState } from "react";
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";

interface ImageReviewProps {
  // Updated to receive object with both images
  images: { front: string; back: string };
  onAnalyze: () => void;
  onBack: () => void;
}

export function ImageReview({ images, onAnalyze, onBack }: ImageReviewProps) {
  const [scale, setScale] = useState(1);
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleAnalyzeClick = () => {
    onAnalyze();
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex z-20 items-center mb-4 mt-6">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 z-20 text-gray-700" />
        </button>
        <h2 className="flex-1 text-center text-gray-900 -ml-10 font-semibold">
          Review Images
        </h2>
      </div>

      {/* Tabs to switch sides */}
      <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
        <button
          onClick={() => {
            setActiveSide("front");
            setScale(1);
          }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeSide === "front"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Front Side
        </button>
        <button
          onClick={() => {
            setActiveSide("back");
            setScale(1);
          }}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
            activeSide === "back"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Back Side
        </button>
      </div>

      {/* Image Preview Area */}
      <div className="flex-1 flex flex-col justify-center mb-70">
        <div className="flex-1 bg-gray-900 rounded-2xl overflow-hidden mb-6 relative group">
          <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
            <img
              // Dynamically show front or back based on active tab
              src={activeSide === "front" ? images.front : images.back}
              alt={`Medicine ${activeSide} preview`}
              style={{
                transform: `scale(${scale})`,
                transition: "transform 0.2s",
              }}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Side Indicator Badge */}
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider">
            {activeSide}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              <ZoomOut className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={handleZoomIn}
              disabled={scale >= 3}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors disabled:opacity-50"
            >
              <ZoomIn className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Scale Indicator */}
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
            {Math.round(scale * 100)}%
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={handleAnalyzeClick}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl shadow-xl transition-all hover:shadow-2xl flex items-center justify-center gap-2 mb-2"
        >
          <CheckCircle className="w-6 h-6" />
          <span className="font-medium text-lg">Analyze Medicine</span>
        </button>

        <p className="text-center text-gray-500 mt-2 text-sm">
          Both sides will be sent for analysis
        </p>
      </div>
    </div>
  );
}
