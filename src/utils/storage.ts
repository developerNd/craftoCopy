import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom storage adapter for Zustand persist middleware
export const createAsyncStorage = () => ({
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value;
    } catch (error) {
      console.warn(`Failed to get item ${name} from AsyncStorage:`, error);
      return null;
    }
  },
  setItem: async (name: string, value: any): Promise<void> => {
    try {
      // Ensure value is always a string
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      await AsyncStorage.setItem(name, stringValue);
    } catch (error) {
      console.warn(`Failed to set item ${name} in AsyncStorage:`, error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.warn(`Failed to remove item ${name} from AsyncStorage:`, error);
    }
  },
});
