import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.VITE_GEMINI_API_KEY || 'demo-key';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the model
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-pro' });

export interface CarRecommendation {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  reasoning: string;
  confidenceScore: number;
}

export const getCarRecommendations = async (
  budget: number,
  carType: string,
  requirements: string,
  availableCars: any[]
): Promise<CarRecommendation[]> => {
  try {
    const prompt = `
      As an AI car expert for Jeffworldwide Automotive, recommend cars based on these criteria:
      
      Budget: ₦${budget.toLocaleString()}
      Car Type: ${carType}
      Requirements: ${requirements}
      
      Available Cars:
      ${availableCars.map(car => `
        ID: ${car.id}
        Make: ${car.make}
        Model: ${car.model}
        Year: ${car.year}
        Price: ₦${car.price?.toLocaleString()}
        Condition: ${car.condition}
        Features: ${car.features?.standard?.join(', ') || 'N/A'}
      `).join('\n')}
      
      Please recommend 2-6 cars that best match the criteria. For each recommendation, provide:
      1. The exact car ID from the list
      2. Clear reasoning (2-3 sentences)
      3. A confidence score (1-100)
      
      Respond in this exact JSON format:
      {
        "recommendations": [
          {
            "id": "car_id_here",
            "reasoning": "detailed reasoning here",
            "confidenceScore": 85
          }
        ]
      }
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text);
      return parsed.recommendations.map((rec: any) => {
        const car = availableCars.find(c => c.id === rec.id);
        return {
          id: rec.id,
          make: car?.make || 'Unknown',
          model: car?.model || 'Unknown',
          year: car?.year || 2020,
          price: car?.price || 0,
          reasoning: rec.reasoning,
          confidenceScore: rec.confidenceScore
        };
      }).filter((rec: CarRecommendation) => rec.make !== 'Unknown');
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return [];
  }
};

export const generateCarDescription = async (car: any): Promise<string> => {
  try {
    const prompt = `
      Create a compelling, professional description for this car:
      
      Make: ${car.make}
      Model: ${car.model}
      Year: ${car.year}
      Price: ₦${car.price?.toLocaleString()}
      Condition: ${car.condition}
      Mileage: ${car.mileage} km
      
      Write a 2-3 sentence description highlighting the car's best features and value proposition.
      Keep it professional and sales-focused.
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return `Experience the perfect blend of performance and reliability with this ${car.year} ${car.make} ${car.model}.`;
  }
};

export const generatePricingRecommendation = async (car: any, marketData?: any[]): Promise<{
  recommendedPrice: number;
  reasoning: string;
}> => {
  try {
    const prompt = `
      As a car pricing expert, recommend a competitive price for this vehicle:
      
      Car Details:
      - Make: ${car.make}
      - Model: ${car.model}
      - Year: ${car.year}
      - Condition: ${car.condition}
      - Mileage: ${car.mileage} km
      - Current Price: ₦${car.price?.toLocaleString()}
      
      Consider Nigerian car market trends and provide:
      1. A recommended price in Naira
      2. Brief reasoning (1-2 sentences)
      
      Respond in JSON format:
      {
        "recommendedPrice": 5500000,
        "reasoning": "explanation here"
      }
    `;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      return JSON.parse(text);
    } catch (parseError) {
      return {
        recommendedPrice: car.price || 0,
        reasoning: "Market-competitive pricing based on current conditions."
      };
    }
  } catch (error) {
    console.error('Gemini AI Error:', error);
    return {
      recommendedPrice: car.price || 0,
      reasoning: "Competitive pricing based on market analysis."
    };
  }
};