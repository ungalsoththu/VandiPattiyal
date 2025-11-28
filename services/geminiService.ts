import { GoogleGenAI } from "@google/genai";
import { Bus } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is not defined in the environment.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to count occurrences of a specific key's values in the fleet data
const countBy = (data: Bus[], key: keyof Bus) => {
  return data.reduce((acc, item) => {
    const val = String(item[key]);
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const analyzeFleetData = async (
  query: string,
  fleetData: Bus[]
): Promise<string> => {
  try {
    const ai = getClient();
    
    // 1. Generate Summary Statistics (Always include)
    // This allows the AI to answer "How many buses..." questions without needing the full raw dataset.
    const summary = {
      totalBuses: fleetData.length,
      byDepot: countBy(fleetData, 'depot'),
      byServiceType: countBy(fleetData, 'serviceType'),
      byStatus: countBy(fleetData, 'status'),
      byAC: {
        AC: fleetData.filter(b => b.isAC).length,
        NonAC: fleetData.filter(b => !b.isAC).length
      }
    };

    // 2. Identify Relevant Records based on simple keyword matching
    // This solves the payload size issue by only sending rows likely to be relevant.
    const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    let relevantBuses: Bus[] = [];

    if (terms.length > 0) {
      // Find buses that contain any of the search terms
      const matches = fleetData.filter(bus => {
        const searchStr = `${bus.fleetNumber} ${bus.registrationNumber} ${bus.depot} ${bus.make} ${bus.model} ${bus.serviceType}`.toLowerCase();
        return terms.some(term => searchStr.includes(term));
      });
      // Limit to 30 rows to ensure the payload remains extremely small for browser XHR limits
      relevantBuses = matches.slice(0, 30);
    } else {
      // If no specific terms, just give a tiny sample
      relevantBuses = fleetData.slice(0, 5);
    }

    // Convert relevant rows to CSV
    const csvHeader = "Depot,FleetNo,RegNo,Make,Model,AC,Service,RegDate,Status";
    const csvRows = relevantBuses.map(b => 
      `${b.depot},${b.fleetNumber},${b.registrationNumber},${b.make},${b.model},${b.isAC ? 'Yes' : 'No'},${b.serviceType},${b.registrationDate},${b.status}`
    ).join("\n");

    const dataContext = `
    SUMMARY STATISTICS (JSON):
    ${JSON.stringify(summary, null, 2)}

    RELEVANT FLEET DATA SAMPLES (CSV - limited rows):
    ${csvHeader}
    ${csvRows}
    `;

    const prompt = `
      You are an expert Fleet Analyst for MTC Chennai (Metropolitan Transport Corporation).
      
      User Query: "${query}"

      Context Data:
      ${dataContext}

      Instructions:
      1. Use the "SUMMARY STATISTICS" for aggregate questions (counts, distributions, overview).
      2. Use "RELEVANT FLEET DATA SAMPLES" for specific vehicle inquiries or to cite examples.
      3. If the user asks about a specific vehicle/fleet number that is not in the samples, politely explain that you are analyzing a subset of data and couldn't find that specific record, but offer the general statistics instead.
      4. Provide a concise, professional answer formatted with Markdown. Use bullet points for lists.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful, data-driven assistant for a Bus Fleet Management System.",
        temperature: 0.2, // Low temperature for factual data analysis
      }
    });

    return response.text || "I could not generate an answer based on the data.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while analyzing the fleet data. Please try a more specific query or ask about general fleet statistics.";
  }
};