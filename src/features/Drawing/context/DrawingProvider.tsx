import { PropsWithChildren } from 'react';
import DrawingContext from './DrawingContext';
import { useDrawing } from './useDrawing';

const DrawingProvider = ({ children }: PropsWithChildren) => {
  return (
    <DrawingContext.Provider value={{ ...useDrawing() }}>
      {children}
    </DrawingContext.Provider>
  );
};

export default DrawingProvider;
