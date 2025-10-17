export interface CustomSolution {
  title: string;
  description: string;
}
export interface ExecutionRoadmap {
  immediate?: string[];
  threeMonths?: string[];
  longTerm?: string[];
}

export interface PortfolioAnalysis {
  title: string;
  summary: string;
  improvementPoints?: string[];
  customSolutions?: CustomSolution[];
  executionRoadmap?: ExecutionRoadmap;
}

export interface AssetSummary {
  totalAssets: number;
  accounts: number;
  insurances: number;
  pensions: number;
}
