import { aiRecommendation } from "@/constants";

export default function AiCoachCard() {
  return (
    <div className="bg-white dark:bg-darkCard rounded-2xl p-5">
      <div className="flex items-start gap-4">
        <div className="w-8 h-8 flex-shrink-0 rounded-full bg-yellow-500/20 flex items-center justify-center">
          {aiRecommendation.icon}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            {aiRecommendation.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 mb-3">
            {aiRecommendation.description}
          </p>
          <button className="bg-olo/80 hover:bg-olo text-white text-sm font-bold py-2 px-4 rounded-lg transition-colors">
            {aiRecommendation.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
