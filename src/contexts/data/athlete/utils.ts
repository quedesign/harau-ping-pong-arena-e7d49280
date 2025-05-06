
import { AthleteProfile } from '@/types';

// Helper function for athlete profile loading
export const loadProfiles = async (fetchFunction: any, setFunction: any, t?: any) => {
  try {
    const profiles = await fetchFunction();
    setFunction(profiles);
    return profiles;
  } catch (error) {
    console.error('Error loading profiles:', error);
    return [];
  }
};
