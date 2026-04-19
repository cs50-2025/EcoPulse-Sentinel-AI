import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface DetectionEnrichment {
  species: string;
  habitat: string;
  condition: string;
  conservationStatus: string;
  environmentalThreats: { name: string; impact: string }[];
  scientificReasoning: string;
  riskScore: number;
}

export async function analyzeWildlifeImage(imageData?: string, sampleSpecies?: string): Promise<DetectionEnrichment> {
  const modelToUse = "gemini-3-flash-preview";

  let prompt = "";
  let contents: any[] = [];

  if (imageData && imageData.startsWith("data:image")) {
    const mimeType = imageData.split(";")[0].split(":")[1];
    const base64Data = imageData.split(",")[1];
    contents = [
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Data,
        },
      },
      {
        text: "Analyze this image for wildlife. Identify the species, its habitat, its apparent physical condition, and assess environmental risks. Return a riskScore as a number between 0 and 100 where 100 is maximum critical risk. Return the data in the specified JSON format."
      }
    ];
  } else {
    prompt = `Analyze the typical conservation profile for the species: "${sampleSpecies || 'Endangered Wildlife'}". 
    Provide localized data for habitat, physical condition checks, and environmental risks. 
    Ensure the riskScore is a number between 0 and 100.
    Return the data in the specified JSON format.`;
    contents = [{ text: prompt }];
  }

  const response = await ai.models.generateContent({
    model: modelToUse,
    contents: contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          species: { type: Type.STRING },
          habitat: { type: Type.STRING },
          condition: { type: Type.STRING },
          conservationStatus: { type: Type.STRING },
          environmentalThreats: { 
            type: Type.ARRAY, 
            items: { 
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                impact: { type: Type.STRING }
              }
            } 
          },
          scientificReasoning: { type: Type.STRING },
          riskScore: { 
            type: Type.NUMBER,
            description: "A calculated risk score between 0 and 100 based on threats and condition."
          },
        },
        required: ["species", "habitat", "condition", "conservationStatus", "environmentalThreats", "scientificReasoning", "riskScore"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(response.text);
}
