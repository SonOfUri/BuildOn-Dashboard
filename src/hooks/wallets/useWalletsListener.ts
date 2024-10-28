import { useEffect, useRef } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';

const useAccountChangeListener = (onChangeCallback:any) => {
  const storedAddress = useDashboardStore((state) => state.address); // Get the current address from Zustand store
  const previousAddressRef = useRef(storedAddress); // Use useRef to hold the previous address
  console.log("PREVVVV", previousAddressRef, storedAddress);
  
  useEffect(() => {
    if (onChangeCallback && typeof onChangeCallback === 'function') {
      // Only call the callback if the address has changed
      if (storedAddress == previousAddressRef.current) {
        onChangeCallback(storedAddress);
      }
      // Update the ref with the new address
      previousAddressRef.current = storedAddress;
    }

    
  }, [storedAddress, onChangeCallback]); // Re-run when storedAddress changes
};

export default useAccountChangeListener;
