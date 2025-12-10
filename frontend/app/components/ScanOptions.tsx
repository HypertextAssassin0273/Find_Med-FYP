import { Camera, Upload, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface ScanOptionsProps {
  // Updated: Returns an object with both images
  onImagesSelected: (images: { front: string; back: string }) => void;
  onBack: () => void;
}

export function ScanOptions({ onImagesSelected, onBack }: ScanOptionsProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);

  const isCapturingBack = !!frontImage;

  // Effect: When both images are present, send data to parent
  useEffect(() => {
    if (frontImage && backImage) {
      onImagesSelected({ front: frontImage, back: backImage });
    }
  }, [frontImage, backImage, onImagesSelected]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        if (!frontImage) {
          setFrontImage(reader.result);
        } else {
          setBackImage(reader.result);
        }
      }
    };
    reader.readAsDataURL(file);

    // Reset input value to allow selecting the same file again if needed (testing purposes)
    event.target.value = "";
  };

  const handleBackStep = () => {
    if (isCapturingBack) {
      // If pressing back while on step 2, clear front image to go back to step 1
      setFrontImage(null);
    } else {
      // If on step 1, go back to home
      onBack();
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-8 mt-6">
        <button
          onClick={handleBackStep}
          className="w-10 h-10 z-20 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="flex-1 text-center text-gray-900 -ml-10 font-semibold text-lg">
          {isCapturingBack ? "Scan Back Side" : "Scan Front Side"}
        </h2>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-4 mb-8">
        <div
          className={`flex items-center gap-2 ${
            isCapturingBack ? "text-green-600" : "text-blue-600 font-bold"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
              isCapturingBack
                ? "bg-green-100 border-green-600"
                : "bg-blue-100 border-blue-600"
            }`}
          >
            1
          </span>
          <span className="text-sm">Front</span>
        </div>
        <div className="w-10 h-[1px] bg-gray-300 self-center"></div>
        <div
          className={`flex items-center gap-2 ${
            isCapturingBack ? "text-blue-600 font-bold" : "text-gray-400"
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
              isCapturingBack
                ? "bg-blue-100 border-blue-600"
                : "bg-gray-100 border-gray-300"
            }`}
          >
            2
          </span>
          <span className="text-sm">Back</span>
        </div>
      </div>

      {/* Options */}

      <div className="flex-1 flex flex-col justify-center gap-6">
        {/* Open Camera */}
        <hr className="border-blue-800 shadow-2xs gradient-to-r from-blue-500 to-blue-600" />

        <OptionCard
          icon={<Camera className="w-12 h-12 text-white" />}
          title={`Take Photo (${isCapturingBack ? "Back" : "Front"})`}
          description="Use your camera to capture medicine"
          gradient="from-purple-500 to-purple-600"
          onClick={() => cameraInputRef.current?.click()}
        />

        {/* Upload */}
        <hr className="border-blue-800 shadow-2xs gradient-to-r from-blue-500 to-blue-600" />
        <OptionCard
          icon={<Upload className="w-12 h-12 text-white" />}
          title={`Upload Image (${isCapturingBack ? "Back" : "Front"})`}
          description="Choose from gallery, drive, or files"
          gradient="from-blue-500 to-blue-600"
          onClick={() => fileInputRef.current?.click()}
        />
      </div>

      {/* Inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="text-center text-gray-500 pb-6 mt-8">
        <p className="text-sm">
          {isCapturingBack
            ? "Ensure the composition/ingredients are visible."
            : "Make sure the medicine name is clearly visible."}
        </p>
      </div>
    </div>
  );
}

interface OptionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
}

function OptionCard({
  icon,
  title,
  description,
  gradient,
  onClick,
}: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 text-left cursor-pointer"
    >
      <div
        className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center mb-4 shadow-md`}
      >
        {icon}
      </div>
      <h3 className="text-gray-900 mb-2 font-medium">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </button>
  );
}
