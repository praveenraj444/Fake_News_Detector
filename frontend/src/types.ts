export interface PredictionResponse {
  prediction: "REAL" | "FAKE";
  confidence: number;
  fake_probability: number;
  real_probability: number;
  word_count: number;
  character_count: number;
}

export interface ApiError {
  error: string;
  detail?: string;
}
