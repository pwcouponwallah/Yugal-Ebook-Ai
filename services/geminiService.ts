
import { GoogleGenAI, Type } from "@google/genai";
import { EbookConfig, EbookOutline, ChapterContent } from "../types";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export const generateOutline = async (config: EbookConfig): Promise<EbookOutline> => {
  const ai = getAIClient();
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Act as a world-class professional ghostwriter and market-leading ebook strategist. 
    Design a comprehensive, sellable ebook blueprint for:
    Topic: ${config.topic}
    Niche: ${config.niche}
    Author: ${config.authorName}
    Tone: ${config.tone}
    
    Requirements:
    - Create a compelling, high-converting Title.
    - Write a hooks-focused Introduction.
    - Create 10 distinct, logically ordered chapters that solve specific problems for the reader.
    - For each chapter, provide 3-5 specific subheadings to cover.
    - Include a "Cited Sources" placeholder for each chapter to promote credibility.
    - Provide a transformative Conclusion.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          introduction: { type: Type.STRING },
          chapters: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                subheadings: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["title", "summary", "subheadings"]
            }
          },
          conclusion: { type: Type.STRING }
        },
        required: ["title", "introduction", "chapters", "conclusion"]
      }
    }
  });

  if (!response.text) throw new Error("Failed to generate outline");
  return JSON.parse(response.text);
};

export const generateChapterContent = async (
  config: EbookConfig, 
  chapter: { title: string, summary: string, subheadings: string[] },
  totalOutline: EbookOutline
): Promise<string> => {
  const ai = getAIClient();
  
  const prompt = `
    Role: Senior Professional Non-Fiction Author.
    Project: Full Chapter Write-up for "${totalOutline.title}".
    Target Chapter: "${chapter.title}"
    Focus Areas: ${chapter.summary}
    Sub-sections: ${chapter.subheadings.join(", ")}
    Tone: ${config.tone}
    Author Pen Name: ${config.authorName}
    
    Detailed Writing Instructions:
    1. WRITE THE FULL CONTENT. Do not summarize or provide bullet points only.
    2. Length: Aim for 1200-1500 words of substance.
    3. Structure: Start with a story or hook, transition into the sub-sections, and end with an actionable "Implementation Task".
    4. Cited Sources: At the very end of the chapter, add a section titled "Cited Sources & Further Reading" with 2-3 relevant placeholder references or real sources if known.
    5. Formatting: Use Markdown (## for H2, ### for H3). Use bolding for emphasis. Use blockquotes for "Pro Tips".
    6. Quality: Content must be unique, insightful, and formatted for professional publication.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text || "";
};
