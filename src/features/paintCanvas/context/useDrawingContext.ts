import { useContext } from 'react';
import DrawingContext from './DrawingContext';

export const useDrawingContext = () => {
  const drawingContext = useContext(DrawingContext);
  if (!drawingContext) throw new Error('DrawingContext is not defined');
  return drawingContext;
};
