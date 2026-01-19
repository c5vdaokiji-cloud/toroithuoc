import { GoogleGenAI, Type } from "@google/genai";
import { TradeItem } from "../types";

/**
 * Extracts table data from a base64 encoded PDF using Gemini.
 */
export const extractDataFromPdf = async (base64Data: string, mimeType: string): Promise<TradeItem[]> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("Thiếu API Key. Vui lòng kiểm tra biến môi trường.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the provided document. 
    Identify a table or list containing trade information.
    Extract the following fields for each row:
    1. "stt": The sequence number or ID.
    2. "name": The trade name (Tên thương mại).
    3. "link": The hyperlink or URL associated with it. If there is no explicit link, leave it empty or try to reconstruct it if implied.

    Return the data as a pure JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-latest", // Good balance of speed and multimodal capability
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              stt: { type: Type.STRING, description: "Sequence Number (STT)" },
              name: { type: Type.STRING, description: "Trade Name (Tên thương mại)" },
              link: { type: Type.STRING, description: "Hyperlink/URL" }
            },
            required: ["name"]
          }
        }
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("AI không trả về dữ liệu nào.");
    }

    const data = JSON.parse(textResponse) as TradeItem[];
    return data;

  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("Thất bại khi trích xuất dữ liệu từ tài liệu bằng AI.");
  }
};

/**
 * Generates a product placeholder image using Gemini.
 */
export const generateProductImage = async (tradeName: string): Promise<string | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Thiếu API Key.");

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [
          {
            text: `Create a clean, professional, medical-style product illustration for a pharmaceutical product named "${tradeName}". Minimalist packaging design, white background, high quality.`
          }
        ]
      },
      config: {
        // responseMimeType is not supported for nano banana series models.
      }
    });

    // Iterate through parts to find image part
    if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    return null;

  } catch (error) {
    console.error("Image Gen Error:", error);
    throw new Error("Không thể tạo ảnh minh họa.");
  }
};