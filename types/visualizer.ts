// AI Home Visualizer Types

export type RoomType = 
  | "living_room" 
  | "kitchen" 
  | "bedroom" 
  | "bathroom" 
  | "basement" 
  | "dining_room"
  | "office"
  | "other";

export type FlooringStyle = 
  | "tile" 
  | "vinyl" 
  | "hardwood" 
  | "laminate" 
  | "carpet"
  | "concrete"
  | "bamboo";

export type FlooringColor = 
  | "light_oak" 
  | "dark_walnut" 
  | "gray" 
  | "white" 
  | "natural"
  | "cherry"
  | "maple"
  | "espresso";

export type WallColor = 
  | "white" 
  | "beige" 
  | "gray" 
  | "light_gray"
  | "blue" 
  | "green"
  | "cream"
  | "taupe";

export type DesignStyle = 
  | "modern" 
  | "farmhouse" 
  | "luxury" 
  | "minimalist" 
  | "industrial"
  | "traditional"
  | "coastal"
  | "bohemian";

export interface VisualizerOptions {
  roomType?: RoomType;
  flooringStyle?: FlooringStyle;
  flooringColor?: FlooringColor;
  wallColor?: WallColor;
  designStyle?: DesignStyle;
  customRequest?: string;
}

export interface VisualizerGeneration {
  id: string;
  userId: string;
  beforeImageUrl: string;
  afterImageUrl: string;
  roomType?: string;
  flooringStyle?: string;
  flooringColor?: string;
  wallColor?: string;
  designStyle?: string;
  customRequest?: string;
  aiModel?: string;
  promptUsed?: string;
  processingTime?: number;
  wasSentToQuote: boolean;
  quoteId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisualizerSubscription {
  id: string;
  userId: string;
  isPaid: boolean;
  stripeSubscriptionId?: string;
  monthlyGenerationsUsed: number;
  lastResetDate: Date;
  freeMonthlyLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VisualizerUsageResponse {
  isAllowed: boolean;
  generationsUsed: number;
  generationsRemaining: number;
  isPaidSubscriber: boolean;
  resetDate: Date;
  message?: string;
}
