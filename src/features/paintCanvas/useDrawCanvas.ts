// 분기처리에 대한 업데이트 함수 목적
import type {
  CircleListType,
  CurveListType,
  LineListType,
  PolygonListType,
  RectListType,
} from '../../shared/types/paintType';
import { useState } from 'react';

type PaintDataType =
  | LineListType
  | CircleListType
  | RectListType
  | PolygonListType
  | CurveListType;

export interface TotalPaintInfoType {
  data: PaintDataType[];
}
const useDrawCanvas = (storage: TotalPaintInfoType) => {
  const [totalPaintInfo, setTotalPaintInfo] =
    useState<TotalPaintInfoType>(storage);

  const updateTotalPaintInfo = (updateState: PaintDataType[]) => {
    setTotalPaintInfo((prev) => ({ ...prev, data: [...updateState] }));
  };

  const getCurvePaintInfo = (lastCurveIndex: number) => {
    const actualIndex = totalPaintInfo.data.length - 1 - lastCurveIndex;
    const lastCurve = totalPaintInfo.data[actualIndex] as CurveListType;

    const pathData = `M ${lastCurve.x1} ${lastCurve.y1} Q ${lastCurve.controlX} ${lastCurve.controlY} ${lastCurve.x2} ${lastCurve.y2}`;

    const updatedCurve = {
      ...lastCurve,
      state: 'curve',
      d: pathData,
    };

    return {
      actualIndex,
      updatedCurve,
    };
  };

  const getPolygonLastIndex = () => {
    return totalPaintInfo.data.findIndex(
      (shape) =>
        shape.type === 'polygon' && !(shape as PolygonListType).isComplete
    );
  };

  const lastIndex = totalPaintInfo.data.length - 1;
  const lastShape = totalPaintInfo.data[lastIndex];

  return {
    totalPaintInfo,
    setTotalPaintInfo,
    updateTotalPaintInfo,
    getCurvePaintInfo,
    getPolygonLastIndex,
    lastShape,
  };
};

export default useDrawCanvas;
