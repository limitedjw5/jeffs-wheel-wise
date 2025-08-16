import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { geminiModel } from './gemini';

export interface AdminLog {
  id?: string;
  type: 'login' | 'market_analysis' | 'inventory_review' | 'action';
  message: string;
  data?: any;
  timestamp: Timestamp;
  adminId: string;
  adminEmail: string;
  metadata?: {
    ip?: string;
    userAgent?: string;
    location?: string;
    device?: string;
    browser?: string;
    platform?: string;
  };
}

export interface MarketAnalysis {
  summary: string;
  trends: string[];
  recommendations: string[];
  lowStockAlert: any[];
  topPerformers: any[];
  priceInsights: string[];
}

export interface InventoryAlert {
  carId: string;
  make: string;
  model: string;
  currentStock: number;
  recommendedAction: string;
  priority: 'high' | 'medium' | 'low';
}

class AdminService {
  // Device and location detection
  async getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Get approximate location using IP (basic implementation)
    let location = 'Unknown';
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      location = `${data.city}, ${data.region}, ${data.country_name}`;
    } catch (error) {
      console.error('Location detection failed:', error);
    }

    // Parse browser info
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Parse device info
    let device = 'Desktop';
    if (userAgent.includes('Mobile')) device = 'Mobile';
    else if (userAgent.includes('Tablet')) device = 'Tablet';

    return {
      userAgent,
      platform,
      location,
      browser,
      device,
      ip: 'Hidden for privacy', // IP would be server-side in production
      timestamp: new Date().toISOString()
    };
  }

  // Log admin login
  async logAdminLogin(adminId: string, adminEmail: string) {
    try {
      const deviceInfo = await this.getDeviceInfo();
      
      const loginLog: Omit<AdminLog, 'id'> = {
        type: 'login',
        message: `Admin login: ${adminEmail}`,
        adminId,
        adminEmail,
        timestamp: serverTimestamp() as Timestamp,
        metadata: deviceInfo
      };

      await addDoc(collection(db, 'admin_logs'), loginLog);
    } catch (error) {
      console.error('Failed to log admin login:', error);
    }
  }

  // Log admin actions
  async logAdminAction(
    adminId: string, 
    adminEmail: string, 
    action: string, 
    data?: any
  ) {
    try {
      const actionLog: Omit<AdminLog, 'id'> = {
        type: 'action',
        message: action,
        data,
        adminId,
        adminEmail,
        timestamp: serverTimestamp() as Timestamp
      };

      await addDoc(collection(db, 'admin_logs'), actionLog);
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }

  // Generate market analysis using Gemini
  async generateMarketAnalysis(cars: any[], adminId: string, adminEmail: string): Promise<MarketAnalysis> {
    try {
      const totalCars = cars.length;
      const brands = [...new Set(cars.map(car => car.make))];
      const avgPrice = cars.reduce((sum, car) => sum + (car.price || 0), 0) / totalCars;
      const lowStockCars = cars.filter(car => car.status === 'Active').slice(0, 5);

      const prompt = `
        As a car market analyst for Jeffworldwide Automotive, analyze this inventory data and provide insights:

        Total Cars: ${totalCars}
        Brands Available: ${brands.join(', ')}
        Average Price: ₦${avgPrice.toLocaleString()}
        
        Car Details:
        ${cars.slice(0, 20).map(car => `
          ${car.make} ${car.model} ${car.year} - ₦${car.price?.toLocaleString()} - ${car.condition} - Status: ${car.status}
        `).join('\n')}

        Provide a comprehensive market analysis including:
        1. Current market summary (2-3 sentences)
        2. Market trends (3-4 bullet points)
        3. Business recommendations (3-4 actionable items)
        4. Price insights (2-3 pricing observations)

        Format as JSON:
        {
          "summary": "market overview",
          "trends": ["trend1", "trend2", "trend3"],
          "recommendations": ["rec1", "rec2", "rec3"],
          "priceInsights": ["insight1", "insight2"]
        }
      `;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      let analysis: MarketAnalysis;
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
        analysis = {
          summary: parsed.summary || "Market analysis completed successfully.",
          trends: parsed.trends || ["Stable market conditions"],
          recommendations: parsed.recommendations || ["Continue current strategy"],
          lowStockAlert: lowStockCars,
          topPerformers: cars.filter(car => car.isFeatured).slice(0, 5),
          priceInsights: parsed.priceInsights || ["Competitive pricing maintained"]
        };
      } catch (parseError) {
        // Fallback analysis
        analysis = {
          summary: `Current inventory shows ${totalCars} vehicles across ${brands.length} brands with an average price of ₦${avgPrice.toLocaleString()}.`,
          trends: [
            "Diverse brand portfolio maintained",
            "Competitive pricing strategy in place",
            "Strong inventory levels across categories"
          ],
          recommendations: [
            "Monitor low-stock vehicles for restocking",
            "Consider promotional campaigns for slow-moving inventory",
            "Maintain current pricing strategy"
          ],
          lowStockAlert: lowStockCars,
          topPerformers: cars.filter(car => car.isFeatured).slice(0, 5),
          priceInsights: [
            "Current pricing aligns with market standards",
            "Premium vehicles showing strong positioning"
          ]
        };
      }

      // Log the analysis
      await this.logAnalysis(adminId, adminEmail, 'market_analysis', analysis);
      
      return analysis;
    } catch (error) {
      console.error('Market analysis failed:', error);
      throw new Error('Failed to generate market analysis');
    }
  }

  // Generate inventory review using Gemini
  async generateInventoryReview(cars: any[], adminId: string, adminEmail: string) {
    try {
      const activeCars = cars.filter(car => car.status === 'Active');
      const soldCars = cars.filter(car => car.status === 'Sold');
      const inactiveCars = cars.filter(car => car.status === 'Inactive');

      const prompt = `
        As an inventory specialist for Jeffworldwide Automotive, review this inventory:

        Active Cars: ${activeCars.length}
        Sold Cars: ${soldCars.length}
        Inactive Cars: ${inactiveCars.length}

        Active Inventory Details:
        ${activeCars.slice(0, 15).map(car => `
          ${car.make} ${car.model} ${car.year} - ₦${car.price?.toLocaleString()} - ${car.condition}
          Days listed: ${Math.floor((Date.now() - new Date(car.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
        `).join('\n')}

        Provide inventory insights:
        1. Overall inventory health assessment
        2. Slow-moving vehicles (if any)
        3. Quick-selling categories
        4. Stock optimization recommendations
        5. Pricing adjustments needed

        Format as JSON:
        {
          "healthScore": 85,
          "summary": "inventory assessment",
          "slowMoving": ["car details"],
          "fastMoving": ["categories"],
          "recommendations": ["action items"],
          "alerts": ["urgent items"]
        }
      `;

      const result = await geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      let review;
      try {
        review = JSON.parse(text.replace(/```json|```/g, '').trim());
      } catch (parseError) {
        review = {
          healthScore: 75,
          summary: "Inventory review completed with current data analysis.",
          slowMoving: ["Monitor vehicles listed over 30 days"],
          fastMoving: ["Popular brands showing good turnover"],
          recommendations: ["Regular inventory turnover analysis", "Price optimization review"],
          alerts: inactiveCars.length > 0 ? [`${inactiveCars.length} inactive vehicles need attention`] : []
        };
      }

      // Log the review
      await this.logAnalysis(adminId, adminEmail, 'inventory_review', review);
      
      return review;
    } catch (error) {
      console.error('Inventory review failed:', error);
      throw new Error('Failed to generate inventory review');
    }
  }

  // Log AI analysis results
  async logAnalysis(adminId: string, adminEmail: string, type: string, data: any) {
    try {
      const analysisLog: Omit<AdminLog, 'id'> = {
        type: type as any,
        message: `AI ${type.replace('_', ' ')} generated`,
        data,
        adminId,
        adminEmail,
        timestamp: serverTimestamp() as Timestamp
      };

      await addDoc(collection(db, 'admin_logs'), analysisLog);
    } catch (error) {
      console.error('Failed to log analysis:', error);
    }
  }

  // Get admin logs
  async getAdminLogs(limit = 50): Promise<AdminLog[]> {
    try {
      const q = query(
        collection(db, 'admin_logs'),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminLog[];
    } catch (error) {
      console.error('Failed to fetch admin logs:', error);
      return [];
    }
  }

  // Get filtered logs
  async getFilteredLogs(type?: string, adminId?: string): Promise<AdminLog[]> {
    try {
      let q = query(collection(db, 'admin_logs'), orderBy('timestamp', 'desc'));
      
      if (type) {
        q = query(collection(db, 'admin_logs'), where('type', '==', type), orderBy('timestamp', 'desc'));
      }
      
      if (adminId) {
        q = query(collection(db, 'admin_logs'), where('adminId', '==', adminId), orderBy('timestamp', 'desc'));
      }
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AdminLog[];
    } catch (error) {
      console.error('Failed to fetch filtered logs:', error);
      return [];
    }
  }

  // Delete log
  async deleteLog(logId: string) {
    try {
      await deleteDoc(doc(db, 'admin_logs', logId));
    } catch (error) {
      console.error('Failed to delete log:', error);
      throw error;
    }
  }

  // Clear old logs (older than X days)
  async clearOldLogs(daysOld = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);
      
      const q = query(
        collection(db, 'admin_logs'),
        where('timestamp', '<', Timestamp.fromDate(cutoffDate))
      );
      
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      return querySnapshot.docs.length;
    } catch (error) {
      console.error('Failed to clear old logs:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();