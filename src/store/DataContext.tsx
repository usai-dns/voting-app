import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { seedDemoData } from '../services/api';

const DataContext = createContext(null);

export function DataProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    seedDemoData();
  }, []);

  return (
    <DataContext.Provider value={null}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
