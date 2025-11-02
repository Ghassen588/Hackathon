// This file exports TypeScript types and interfaces used throughout the application for better type safety.

export interface User {
  id: string;
  username: string;
  cin: string;
}

export interface MapData {
  soil: {
    tomatoes: boolean[];
    onions: boolean[];
    mint: boolean[];
  };
  pumps: {
    tomatoes: boolean[];
    onions: boolean[];
    mint: boolean[];
  };
}

export interface WeatherForecast {
  day: string;
  emoji: string;
  high: string;
  low: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  popular: boolean;
}