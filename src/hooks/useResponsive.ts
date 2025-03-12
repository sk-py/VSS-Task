import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';

export const useResponsive = () => {
  // Initialize with current window dimensions
  const [dimensions, setDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    // Listen for dimension changes
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });

    // Cleanup subscription on unmount
    return () => subscription.remove();
  }, []);

  // Helper functions for responsive calculations
  const wp = (percentage: number) => (dimensions.width * percentage) / 100;
  const hp = (percentage: number) => (dimensions.height * percentage) / 100;

  return {
    width: dimensions.width,
    height: dimensions.height,
    wp, // width percentage
    hp, // height percentage
  };
}; 