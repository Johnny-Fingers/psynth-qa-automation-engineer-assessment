export interface ScoreItem {
  name?: string;
  abbreviation?: string;
  score: number;
  percentile: number;
  confidenceInterval: string;
  classification: string;
}

export interface Subtest {
  name: string;
  scaledScore: number;
  index: string;
}

export interface Scores {
  fullScaleIq: ScoreItem;
  primaryIndices: ScoreItem[];
  subtests: Subtest[];
}
