import { useEffect, useRef } from 'react';
import type { TotalPaintInfoType } from './useDrawCanvas';
import type { DrawingInfo } from '../../shared/types/paintType';

interface UseUndoRedoProps {
  totalPaintInfo: TotalPaintInfoType;
  setTotalPaintInfo: React.Dispatch<React.SetStateAction<TotalPaintInfoType>>;
  modeState: string;
  handleChangeModeState: (state: DrawingInfo['mode']['state']) => void;
  setValue: (value: TotalPaintInfoType) => void;
}

const useUndoRedo = ({
  totalPaintInfo,
  setTotalPaintInfo,
  modeState,
  handleChangeModeState,
  setValue,
}: UseUndoRedoProps) => {
  const undoArr = useRef<TotalPaintInfoType['data']>([]);
  const redoArr = useRef<TotalPaintInfoType['data']>([]);

  // totalPaintInfo가 변경될 때 redoArr 관리 및 저장
  useEffect(() => {
    if (redoArr.current.length > 40) {
      redoArr.current = redoArr.current.slice(1);
    }
    setValue(totalPaintInfo);
  }, [totalPaintInfo, setValue]);

  // undo 및 redo 기능 처리
  useEffect(() => {
    if (modeState === 'undo' && totalPaintInfo.data.length > 0) {
      const lastPaint = totalPaintInfo.data[totalPaintInfo.data.length - 1];
      undoArr.current = [...undoArr.current, lastPaint];
      const newPaintData = totalPaintInfo.data.slice(0, -1);

      setTotalPaintInfo((prev) => ({
        ...prev,
        data: newPaintData,
      }));

      handleChangeModeState('');
    } else if (modeState === 'redo' && undoArr.current.length > 0) {
      const redoPaint = undoArr.current[undoArr.current.length - 1];
      undoArr.current = undoArr.current.slice(0, -1); // 마지막 항목 제거

      setTotalPaintInfo((prev) => ({
        ...prev,
        data: [...prev.data, redoPaint],
      }));

      handleChangeModeState('');
    }
  }, [modeState, totalPaintInfo, handleChangeModeState, setTotalPaintInfo]);
};

export default useUndoRedo;
