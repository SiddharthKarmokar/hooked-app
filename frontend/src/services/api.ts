import { Platform } from 'react-native';

// API Configuration
const API_URL = Platform.OS === 'ios' 
  ? 'http://localhost:8000/api'  // For iOS simulator
  : 'http://10.0.2.2:8000/api';   // For Android emulator

// Hook Types
export type Hook = {
  id: string;
  title: string;
  category: string;
  content?: string;
  explanation?: string;
  analogy?: string;
  tags?: string[];
  difficulty?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Extended Hook Types for backend compatibility
export type DetailedHook = {
  id: string;
  headline: string;
  hookText: string;
  analogy: string;
  category: string;
  tags: string[];
  expandedContent: {
    fullExplanation: string;
    mindBlowingFact: string;
    realWorldConnection: string;
  };
  relatedTopics: string[];
  sourceInfo: {
    sonarTopicId: string;
    generatedAt: string;
  };
  metadata: {
    createdAt: string;
    popularity: number;
    saveCount: number;
    shareCount: number;
  };
};

// API Endpoints
const endpoints = {
  hooks: `${API_URL}/hooks`,
  hooksFeed: `${API_URL}/hooks/feed`,
  hook: (id: string) => `${API_URL}/hooks/${id}`,
  relatedHooks: (id: string) => `${API_URL}/hooks/${id}/related`,
  searchHooks: `${API_URL}/hooks/search`,
  categories: `${API_URL}/categories`,
  preferences: `${API_URL}/preferences`,
};

// Fetch hooks from the API
export const fetchHooks = async (category?: string): Promise<Hook[]> => {
  try {
    let url = endpoints.hooksFeed;
    if (category) {
      url += `?category=${encodeURIComponent(category)}`;
    }
    
    // Try to fetch from actual API first
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return data.map(mapApiHookToModel);
    } catch (apiError) {
      console.warn('API fetch failed, falling back to mock data', apiError);
      // Fall back to mock data
      return mockHooks.filter(hook => !category || hook.category.includes(category));
    }
  } catch (error) {
    console.error('Error fetching hooks:', error);
    throw error;
  }
};

// Fetch a single hook by ID
export const fetchHookById = async (id: string): Promise<Hook | null> => {
  try {
    // Try to fetch from actual API first
    try {
      const response = await fetch(endpoints.hook(id));
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      return mapApiHookToModel(data);
    } catch (apiError) {
      console.warn('API fetch failed, falling back to mock data', apiError);
      // Fall back to mock data
      return mockHooks.find(hook => hook.id === id) || null;
    }
  } catch (error) {
    console.error(`Error fetching hook ID ${id}:`, error);
    throw error;
  }
};

// Update user preferences
export const updatePreferences = async (categories: string[]): Promise<boolean> => {
  try {
    // In a production app, we would save to backend
    console.log('Updating preferences with categories:', categories);
    return true;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

// Helper function to map API hook to our model
const mapApiHookToModel = (apiHook: any): Hook => {
  // If it's already in our format
  if (apiHook.title) {
    return apiHook as Hook;
  }
  
  // If it's in the backend DetailedHook format
  if (apiHook.headline) {
    return {
      id: apiHook.id || String(apiHook._id),
      title: apiHook.headline,
      content: apiHook.hookText,
      explanation: apiHook.expandedContent?.fullExplanation,
      analogy: apiHook.analogy,
      category: apiHook.category,
      tags: apiHook.tags,
      difficulty: 'beginner',
      createdAt: apiHook.metadata?.createdAt,
      updatedAt: apiHook.metadata?.createdAt,
    };
  }
  
  // Fallback for unknown format
  return {
    id: String(apiHook._id || apiHook.id),
    title: apiHook.title || apiHook.headline || 'Unknown Hook',
    category: apiHook.category || 'Uncategorized',
    content: apiHook.content || apiHook.hookText || '',
    explanation: apiHook.explanation || apiHook.expandedContent?.fullExplanation || '',
  };
};

// Mock data
export const mockHooks: Hook[] = [
  {
    id: '1',
    title: 'Why is the sky blue?',
    category: 'Science & Technology',
    content: 'Have you ever wondered why the sky appears blue during the day, but becomes a canvas of different colors at sunrise and sunset?',
    explanation: 'The sky appears blue because of a phenomenon called Rayleigh scattering. Sunlight contains all colors of the visible spectrum, but the blue light waves are shorter and scatter more easily when they strike air molecules in our atmosphere.\n\nThis scattered blue light is what reaches our eyes from all directions, making the sky appear blue. At sunrise and sunset, sunlight travels through more atmosphere, causing most blue light to scatter away, allowing the reds and oranges to reach our eyes.',
    analogy: "It's like how a swimming pool looks bluer the deeper it gets - the water molecules interact more with light as depth increases, similar to how our atmosphere affects sunlight.",
    tags: ['physics', 'light', 'atmosphere', 'optics'],
    difficulty: 'beginner',
    createdAt: '2023-04-12T10:30:00Z',
    updatedAt: '2023-04-12T10:30:00Z',
  },
  {
    id: '2',
    title: 'How did ancient civilizations navigate?',
    category: 'History & Culture',
    content: 'Before GPS and modern technology, how did ancient sailors find their way across vast oceans without getting lost?',
    explanation: 'Ancient civilizations used several sophisticated navigation techniques. They observed celestial bodies like the North Star and constellations to determine direction and latitude. The Polynesians developed stick charts representing ocean swells and islands.\n\nMariners also used early tools like the astrolabe and kamal to measure the angle of stars above the horizon. They carefully documented coastal features, wind patterns, and ocean currents, passing this knowledge through generations of navigators.',
    analogy: "Imagine using your neighborhood landmarks to find your way home without a map - ancient navigators used the stars as their landmarks in a vast ocean.",
    tags: ['navigation', 'ancient civilizations', 'exploration', 'astronomy'],
    difficulty: 'intermediate',
    createdAt: '2023-04-15T14:45:00Z',
    updatedAt: '2023-04-15T14:45:00Z',
  },
  {
    id: '3',
    title: 'What makes music sound good?',
    category: 'Arts & Creativity',
    content: 'Why do some combinations of notes sound harmonious while others sound jarring and dissonant?',
    explanation: 'Music that sounds "good" often follows mathematical relationships. When note frequencies have simple ratios (like 2:1 for octaves or 3:2 for perfect fifths), they create consonant sounds our brains find pleasing.\n\nCultural exposure also shapes what we find harmonious—what sounds dissonant to one culture may be beautiful to another. Our brains process music using pattern recognition, anticipation, and emotional associations. The interplay of meeting and subverting these expectations creates the emotional journey of music.',
    analogy: "It's like how certain color combinations look pleasing together - these combinations follow mathematical relationships our brains recognize as harmonious.",
    tags: ['music', 'acoustics', 'perception', 'harmony'],
    difficulty: 'intermediate',
    createdAt: '2023-04-18T09:15:00Z',
    updatedAt: '2023-04-18T09:15:00Z',
  },
  {
    id: '4',
    title: 'How do patterns in nature form?',
    category: 'Numbers & Logic',
    content: 'From the spiral of a seashell to the hexagons of a honeycomb—why does nature seem to follow mathematical patterns?',
    explanation: 'Many patterns in nature emerge from simple mathematical rules and physical forces. The Fibonacci sequence and golden ratio appear in plant growth patterns because they optimize sunlight exposure and seed packing.\n\nHexagonal patterns, like in honeycomb, provide maximum space efficiency with minimal material. Spirals form in shells because they allow uniform growth without changing shape. These patterns aren\'t designed but emerge from evolutionary processes that favor efficiency, strength, and resource optimization.',
    analogy: "It's like how water always finds the most efficient path downhill - nature's patterns emerge from finding the most efficient solutions to physical challenges.",
    tags: ['mathematics', 'patterns', 'biology', 'geometry'],
    difficulty: 'intermediate',
    createdAt: '2023-04-20T16:30:00Z',
    updatedAt: '2023-04-20T16:30:00Z',
  },
  {
    id: '5',
    title: 'Why do we dream?',
    category: 'People & Society',
    content: 'Every night our brains create vivid stories while we sleep—but why do we dream, and what purpose does it serve?',
    explanation: 'Dreams likely serve multiple functions. One leading theory suggests dreams help process emotions and memories, strengthening important information while discarding unnecessary details. The brain essentially sorts through the day\'s experiences.\n\nDreams may also serve as a "simulation environment" where we can safely practice responses to threatening situations. Some researchers propose dreams represent random neural activity that our brain attempts to weave into coherent narratives. The exact purpose remains one of neuroscience\'s most fascinating open questions.',
    analogy: "Dreams are like your brain's nightly cleanup crew, sorting through the day's experiences and filing away the important memories while discarding the rest.",
    tags: ['psychology', 'sleep', 'brain', 'consciousness'],
    difficulty: 'beginner',
    createdAt: '2023-04-22T21:45:00Z',
    updatedAt: '2023-04-22T21:45:00Z',
  },
  {
    id: '6',
    title: 'How can tiny ants lift so much?',
    category: 'Science & Technology',
    content: 'Ants can carry objects 50 times their body weight. How do these tiny creatures possess such superhuman strength?',
    explanation: 'Ants\' extraordinary strength comes from their size-to-muscle ratio and exoskeleton structure. As creatures get smaller, their strength relative to body weight increases due to the square-cube law — muscle strength increases with area (squared) while weight increases with volume (cubed).\n\nTheir rigid exoskeletons provide optimal leverage for muscles, allowing maximum force transmission. Additionally, ants have evolved specialized neck joints and mandible muscles precisely designed for carrying objects. If humans had the strength-to-weight ratio of ants, we could lift cars overhead!',
    analogy: "It's like how a small car can have a more powerful engine relative to its weight than a large truck - as things get smaller, they can be proportionally stronger.",
    tags: ['biology', 'physics', 'insects', 'biomechanics'],
    difficulty: 'beginner',
    createdAt: '2023-04-25T08:20:00Z',
    updatedAt: '2023-04-25T08:20:00Z',
  },
];