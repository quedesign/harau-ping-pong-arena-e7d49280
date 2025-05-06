
import { createContext } from 'react';

// Empty DataContext for usage in index.tsx
export const DataContext = createContext({});

// Helper function for athlete profile loading
export const loadProfiles = async (fetchFunction: any, setFunction: any) => {
  try {
    const profiles = await fetchFunction();
    setFunction(profiles);
    return profiles;
  } catch (error) {
    console.error('Error loading profiles:', error);
    return [];
  }
};
