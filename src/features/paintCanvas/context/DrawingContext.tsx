import { ChangeEvent, createContext } from 'react';
import type { DrawingInfo } from '../../../shared/types/paintType';

interface DrawingContextType {
  drawingInfo: DrawingInfo;
  handleChangeModeTool: (_value: DrawingInfo['mode']['tool']) => void;
  handleChangeModeState: (_value: DrawingInfo['mode']['state']) => void;
  handleChangeColor: (
    _e: ChangeEvent<HTMLInputElement>,
    _type: keyof DrawingInfo['colorInfo']
  ) => void;
  handleChangeRange: (_e: ChangeEvent<HTMLInputElement>) => void;
}

const DrawingContext = createContext<DrawingContextType | undefined>(undefined);

export default DrawingContext;
