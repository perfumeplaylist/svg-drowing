import { ChangeEvent, createContext } from 'react';
import { DrawingInfo } from './useDrawing';

interface DrawingContextType {
  drawingInfo: DrawingInfo;
  handleChangeMode: (_value: string) => void;
  handleChangeColor: (
    _e: ChangeEvent<HTMLInputElement>,
    _type: keyof DrawingInfo['colorInfo']
  ) => void;
  handleChangeRange: (_e: ChangeEvent<HTMLInputElement>) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export default DrawingContext;
