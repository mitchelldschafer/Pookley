export interface App {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  category: Category;
  status: 'active' | 'development' | 'archived';
  lastUpdated: string;
  liveUrl: string;
  sourceUrl?: string;
  thumbnail: string;
  usage?: number;
  tier: 'free' | 'pro' | 'premium';
  featured?: boolean;
}

export type Category = 'productivity' | 'games' | 'utilities' | 'tools' | 'design' | 'security' | 'lifestyle' | 'development';

export type SortOption = 'newest' | 'oldest' | 'name' | 'mostUsed';