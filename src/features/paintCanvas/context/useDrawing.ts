import { ChangeEvent, useCallback, useContext, useState } from 'react';
import DrawingContext from './DrawingContext';
import type { DrawingInfo } from '../../../shared/types/paintType';

export const useDrawing = () => {
  const [drawingInfo, setDrawingInfo] = useState<DrawingInfo>({
    mode: {
      tool: '',
      state: '',
    },
    thickness: 5,
    colorInfo: {
      fill: '#000000',
      stoke: '#000000',
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
    setDrawingInfo((prev) => ({
      ...prev,
      mode: { ...prev.mode, tool: '' },
    }));
  }, []);

  const handleChangeModeTool = (value: DrawingInfo['mode']['tool']) => {
    if (value === drawingInfo.mode.tool) resetMode();
    else
      setDrawingInfo((prev) => ({
        ...prev,
        mode: { ...prev.mode, tool: value },
      }));
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

  const handleChangeModeState = (value: DrawingInfo['mode']['state']) => {
    setDrawingInfo((prev) => ({
      ...prev,
      mode: { ...prev.mode, state: value },
    }));
  };

  return {
    drawingInfo,
    handleChangeModeTool,
    handleChangeModeState,
    handleChangeRange,
    handleChangeColor,
  };
};

export const useDrawingContext = () => {
  const drawingContext = useContext(DrawingContext);
  if (!drawingContext) throw new Error('DrawingContext is not defined');
  return drawingContext;
};
