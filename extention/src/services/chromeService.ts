import type { AnalysisResult } from "../types/index";

// 1. Define an interface for the expected Chrome Storage structure
interface ChromeStorageResult {
  [key: string]: string | undefined;
}

// 2. Define the expected response from the Content Script
interface ContentScriptResponse {
  text?: string;
}

export const saveToChrome = async (
  key: string,
  value: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
};

export const getFromChrome = async (key: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    // Cast the result to our ChromeStorageResult interface
    chrome.storage.local.get([key], (result: ChromeStorageResult) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        // Explicitly check if the value exists and is a string
        const value = result[key];
        resolve(typeof value === "string" ? value : null);
      }
    });
  });
};

export const removeFromChrome = async (key: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove([key], () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
};

export const extractPageText = async (): Promise<string> => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id) {
    throw new Error("No active tab found");
  }

  // Check if we are on a restricted page (chrome://, edge://, etc.)
  if (tab.url?.startsWith("chrome://") || tab.url?.startsWith("edge://") || tab.url?.startsWith("about:")) {
    throw new Error("Cannot scan system pages. Please visit a job listing on a website.");
  }

  return new Promise((resolve, reject) => {
    chrome.tabs.sendMessage(
      tab.id!,
      { action: "getPageText" },
      (response: ContentScriptResponse | undefined) => {
        if (chrome.runtime.lastError) {
          const msg = chrome.runtime.lastError.message || "";
          if (msg.includes("Could not establish connection")) {
            reject(new Error("Content script not ready. Please refresh the page you want to scan."));
          } else {
            reject(new Error(msg));
          }
        } else if (response?.text) {
          resolve(response.text);
        } else {
          reject(new Error("Could not extract text from page. Make sure the page is fully loaded."));
        }
      }
    );
  });
};

export const analyzeWithBackend = async (
  cvText: string,
  jobText: string
): Promise<AnalysisResult> => {
  const BACKEND_URL = "http://localhost:3000";

  const response = await fetch(`${BACKEND_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cvText, jobText }),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed with status ${response.status}`);
  }

  // 4. Casting the JSON response to our known AnalysisResult type
  return response.json() as Promise<AnalysisResult>;
};
