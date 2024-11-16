import { ChangeEvent, useCallback, useContext, useState } from 'react';
import DrawingContext from './DrawingContext';

export interface DrawingInfo {
  mode: string;
  thickness: number;
  colorInfo: {
    fill: string;
    line: string;
    background: string;
  };
}

export const useDrawing = () => {
  const [drawingInfo, setDrawingInfo] = useState<DrawingInfo>({
    mode: '',
    thickness: 5,
    colorInfo: {
      fill: '#000000',
      line: '#000000',
      background: '#000000',
    },
  });

  // TODO:이것을 리렌더링을 줄일수 있는 방향으로 생각해보기
  const handleChangeRange = (e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setDrawingInfo((prev) => ({
      ...prev,
      thickness: Math.max(5, Number(value)),
    }));
  };

  const resetMode = useCallback(() => {
    setDrawingInfo((prev) => ({ ...prev, mode: '' }));
  }, []);

  const handleChangeMode = (value: string) => {
    if (value === drawingInfo.mode) resetMode();
    else setDrawingInfo((prev) => ({ ...prev, mode: value }));
  };

  const handleChangeColor = (
    e: ChangeEvent<HTMLInputElement>,
    type: keyof DrawingInfo['colorInfo']
  ) => {
    const {
      target: { value },
    } = e;
    if (value === drawingInfo.colorInfo[type]) return;
    setDrawingInfo((prev) => ({
      ...prev,
      colorInfo: { ...prev.colorInfo, [type]: value },
    }));
  };

  return {
    drawingInfo,
    handleChangeMode,
    handleChangeRange,
    handleChangeColor,
  };
};

export const useDrawingContext = () => {
  const drawingContext = useContext(DrawingContext);
  if (!drawingContext) throw new Error('DrawingContext is not defined');
  return drawingContext;
};
