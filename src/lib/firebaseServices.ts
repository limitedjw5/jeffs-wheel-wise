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
  Timestamp,
  onSnapshot,
  limit,
  writeBatch
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { geminiModel } from './gemini';
import { Car } from '@/stores/useCarStore';
import { uploadImageToImgBB } from './imgbb';

export interface AdminLog {
  id?: string;
  type: 'login' | 'market_analysis' | 'inventory_review' | 'action' | 'car_added' | 'car_updated' | 'car_deleted' | 'status_change';
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
  id?: string;
  summary: string;
  trends: string[];
  recommendations: string[];
  lowStockAlert: any[];
  topPerformers: any[];
  priceInsights: string[];
  generatedAt: Timestamp;
  adminId: string;
  adminEmail: string;
}

export interface InventoryAlert {
  carId: string;
  make: string;
  model: string;
  currentStock: number;
  recommendedAction: string;
  priority: 'high' | 'medium' | 'low';
}

class FirebaseAdminService {
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
      ip: 'Hidden for privacy',
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

  // Car Management Functions
  async addCar(carData: Omit<Car, 'id' | 'createdAt' | 'updatedAt'>, adminId: string, adminEmail: string): Promise<string> {
    try {
      const car: Omit<Car, 'id'> = {
        ...carData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'cars'), car);
      
      // Log the action
      await this.logAdminAction(
        adminId,
        adminEmail,
        `Added new car: ${car.make} ${car.model} ${car.year}`,
        { carId: docRef.id, make: car.make, model: car.model, year: car.year }
      );

      return docRef.id;
    } catch (error) {
      console.error('Failed to add car:', error);
      throw error;
    }
  }

  async updateCar(carId: string, updates: Partial<Car>, adminId: string, adminEmail: string): Promise<void> {
    try {
      const carRef = doc(db, 'cars', carId);
      await updateDoc(carRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      });

      // Log the action
      await this.logAdminAction(
        adminId,
        adminEmail,
        `Updated car: ${carId}`,
        { carId, updates }
      );
    } catch (error) {
      console.error('Failed to update car:', error);
      throw error;
    }
  }

  async deleteCar(carId: string, adminId: string, adminEmail: string): Promise<void> {
    try {
      const carRef = doc(db, 'cars', carId);
      await deleteDoc(carRef);

      // Log the action
      await this.logAdminAction(
        adminId,
        adminEmail,
        `Deleted car: ${carId}`,
        { carId }
      );
    } catch (error) {
      console.error('Failed to delete car:', error);
      throw error;
    }
  }

  async getCars(): Promise<Car[]> {
    try {
      const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Car[];
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      return [];
    }
  }

  // Real-time cars subscription
  subscribeToCars(callback: (cars: Car[]) => void) {
    const q = query(collection(db, 'cars'), orderBy('createdAt', 'desc'));
    
    return onSnapshot(q, (querySnapshot) => {
      const cars = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Car[];
      callback(cars);
    });
  }

  // Upload images using ImgBB
async uploadCarImages(files: FileList, adminId: string, adminEmail: string): Promise<string[]> {
  try {
    const uploadPromises = Array.from(files).map(async (file) => {
      const response = await uploadImageToImgBB(file); 
      return response.data.url; // adjust based on actual response
    });

    const imageUrls = await Promise.all(uploadPromises);

    // Log the action
    await this.logAdminAction(
      adminId,
      adminEmail,
      `Uploaded ${imageUrls.length} car images`,
      { imageCount: imageUrls.length }
    );

    return imageUrls; // ✅ now string[]
  } catch (error) {
    console.error('Failed to upload images:', error);
    throw error;
  }
}

  // Generate market analysis using Gemini
  async generateMarketAnalysis(cars: Car[], adminId: string, adminEmail: string): Promise<MarketAnalysis> {
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
      
      let analysis: Omit<MarketAnalysis, 'id'>;
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
        analysis = {
          summary: parsed.summary || "Market analysis completed successfully.",
          trends: parsed.trends || ["Stable market conditions"],
          recommendations: parsed.recommendations || ["Continue current strategy"],
          lowStockAlert: lowStockCars,
          topPerformers: cars.filter(car => car.isFeatured).slice(0, 5),
          priceInsights: parsed.priceInsights || ["Competitive pricing maintained"],
          generatedAt: serverTimestamp() as Timestamp,
          adminId,
          adminEmail
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
          ],
          generatedAt: serverTimestamp() as Timestamp,
          adminId,
          adminEmail
        };
      }

      // Save analysis to Firestore
      const docRef = await addDoc(collection(db, 'market_analyses'), analysis);
      
      // Log the analysis
      await this.logAdminAction(adminId, adminEmail, 'Generated market analysis', { analysisId: docRef.id });
      
      return { id: docRef.id, ...analysis } as MarketAnalysis;
    } catch (error) {
      console.error('Market analysis failed:', error);
      throw new Error('Failed to generate market analysis');
    }
  }

  // Get previous market analyses
  async getMarketAnalyses(limitCount = 10): Promise<MarketAnalysis[]> {
    try {
      const q = query(
        collection(db, 'market_analyses'),
        orderBy('generatedAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MarketAnalysis[];
    } catch (error) {
      console.error('Failed to fetch market analyses:', error);
      return [];
    }
  }

  // Generate inventory review using Gemini
  async generateInventoryReview(cars: Car[], adminId: string, adminEmail: string) {
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

      // Save review to Firestore
      const reviewData = {
        ...review,
        generatedAt: serverTimestamp(),
        adminId,
        adminEmail
      };
      
      const docRef = await addDoc(collection(db, 'inventory_reviews'), reviewData);
      
      // Log the review
      await this.logAdminAction(adminId, adminEmail, 'Generated inventory review', { reviewId: docRef.id });
      
      return { id: docRef.id, ...review };
    } catch (error) {
      console.error('Inventory review failed:', error);
      throw new Error('Failed to generate inventory review');
    }
  }

  // Get admin logs with filtering and sorting
  async getAdminLogs(options: {
    limit?: number;
    type?: string;
    adminId?: string;
    startDate?: Date;
    endDate?: Date;
  } = {}): Promise<AdminLog[]> {
    try {
      let q = query(collection(db, 'admin_logs'));

      // Apply filters
      if (options.type) {
        q = query(q, where('type', '==', options.type));
      }
      
      if (options.adminId) {
        q = query(q, where('adminId', '==', options.adminId));
      }

      if (options.startDate) {
        q = query(q, where('timestamp', '>=', Timestamp.fromDate(options.startDate)));
      }

      if (options.endDate) {
        q = query(q, where('timestamp', '<=', Timestamp.fromDate(options.endDate)));
      }

      // Order by timestamp and limit
      q = query(q, orderBy('timestamp', 'desc'));
      
      if (options.limit) {
        q = query(q, limit(options.limit));
      }
      
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

  // Deal of the week management
  async setDealOfTheWeek(carId: string, adminId: string, adminEmail: string): Promise<void> {
    try {
      const batch = writeBatch(db);

      // Remove deal of the week from all cars
      const allCarsQuery = query(collection(db, 'cars'));
      const allCarsSnapshot = await getDocs(allCarsQuery);
      
      allCarsSnapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { isDealOfTheWeek: false });
      });

      // Set the new deal of the week
      const carRef = doc(db, 'cars', carId);
      batch.update(carRef, { isDealOfTheWeek: true });

      await batch.commit();

      // Log the action
      await this.logAdminAction(
        adminId,
        adminEmail,
        `Set deal of the week: ${carId}`,
        { carId }
      );
    } catch (error) {
      console.error('Failed to set deal of the week:', error);
      throw error;
    }
  }

  // Get deal of the week
  async getDealOfTheWeek(): Promise<Car | null> {
    try {
      const q = query(collection(db, 'cars'), where('isDealOfTheWeek', '==', true));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) return null;
      
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Car;
    } catch (error) {
      console.error('Failed to get deal of the week:', error);
      return null;
    }
  }

  // Get new arrivals (most recent cars)
  async getNewArrivals(limitCount: number = 6): Promise<Car[]> {
    try {
      const q = query(
        collection(db, 'cars'),
        where('status', '==', 'Active'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Car[];
    } catch (error) {
      console.error('Failed to fetch new arrivals:', error);
      return [];
    }
  }
}

export const firebaseAdminService = new FirebaseAdminService();