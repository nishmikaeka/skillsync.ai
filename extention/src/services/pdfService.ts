import * as pdfjsLib from "pdfjs-dist";
import type { TextContent, TextItem } from "pdfjs-dist/types/src/display/api";

// Set up worker using the modern URL pattern
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export const extractPdfText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      // 1. Cast the text content to the library's official type
      const textContent = (await page.getTextContent()) as TextContent;

      // 2. Filter and map items safely to avoid 'any'
      const pageText = textContent.items
        .map((item) => {
          // PDF.js items can be TextItem or TextMarkedContent
          // We only want TextItem as it contains the '.str' property
          return (item as TextItem).str || "";
        })
        .join(" ");

      fullText += pageText + "\n";
    }

    return fullText;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to extract PDF text: ${errorMessage}`);
  }
};
