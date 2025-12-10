import { Pill, Scan, Shield, Zap } from "lucide-react";

interface HomeScreenProps {
  onScanClick: () => void;
}

export function HomeScreen({ onScanClick }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mt-12 mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-3xl mb-4 shadow-lg">
          <Pill className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-blue-900 mb-2">FindMed</h1>
        <p className="text-gray-600">Identify medicines instantly with AI</p>
      </div>

      {/* Main CTA */}
      <div className="flex-1 flex flex-col justify-center mb-12">
        <button
          onClick={onScanClick}
          className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:scale-105 active:scale-95 mb-6"
        >
          <Scan className="w-8 h-8  mx-auto mb-2" />
          <span className="block">Scan Medicine</span>
        </button>

        {/* Features */}
        <div className="grid grid-cols-1 gap-4 mt-8">
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-blue-600" />}
            title="Instant Recognition"
            description="AI-powered medicine identification in seconds"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-blue-600" />}
            title="Accurate Results"
            description="Get detailed information about dosage and usage"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 pb-6">
        <p className="text-sm">Always consult your healthcare provider</p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h3 className="text-gray-900 mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
