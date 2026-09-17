import axios, { AxiosError } from "axios";
import type { PredictionResponse, ApiError } from "./types";

// Point this at your Flask backend. Override with VITE_API_BASE_URL in a .env
// file if you deploy the backend somewhere other than localhost:5000.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export class PredictionError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "PredictionError";
    this.status = status;
  }
}

export async function predictNews(text: string): Promise<PredictionResponse> {
  try {
    const response = await client.post<PredictionResponse>("/predict", { text });
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError<ApiError>;

    if (axiosErr.response) {
      const message = axiosErr.response.data?.error || "The server returned an error.";
      throw new PredictionError(message, axiosErr.response.status);
    }

    if (axiosErr.request) {
      throw new PredictionError(
        "Could not reach the server. Is the Flask backend running on " + API_BASE_URL + "?"
      );
    }

    throw new PredictionError("Something went wrong while sending the request.");
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await client.get("/health");
    return res.status === 200;
  } catch {
    return false;
  }
}

// --- Translation (independent of the /predict flow above) ---

export class TranslationError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "TranslationError";
    this.status = status;
  }
}

export async function translateText(text: string): Promise<string> {
  try {
    // Longer timeout than /predict: the translation model can be a multi-GB
    // download + load on its very first use, which can take several minutes.
    const response = await client.post<{ translated_text: string }>(
      "/translate",
      { text },
      { timeout: 300000 } // 5 minutes
    );
    return response.data.translated_text;
  } catch (err) {
    const axiosErr = err as AxiosError<ApiError>;

    if (axiosErr.code === "ECONNABORTED") {
      throw new TranslationError(
        "Translation timed out. If this is your first translation, the model may " +
        "still be downloading in the backend terminal -- check its progress there " +
        "and try again once it finishes."
      );
    }

    if (axiosErr.response) {
      const message = axiosErr.response.data?.error || "Translation failed on the server.";
      throw new TranslationError(message, axiosErr.response.status);
    }

    if (axiosErr.request) {
      throw new TranslationError(
        "Could not reach the server. Is the Flask backend running on " + API_BASE_URL + "?"
      );
    }

    throw new TranslationError("Something went wrong while sending the translation request.");
  }
}
