// 분기처리에 대한 업데이트 함수 목적
import paintInfo from '../../../shared/constant/paintInfo';
import type {
  CircleListType,
  CurveListType,
  LineListType,
  PolygonListType,
  RectListType,
} from '../../../shared/types/paintType';
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

  const updateFindTotal = <T extends PaintDataType>(
    targetIndex: number,
    updateState: T
  ) => {
    const newData = totalPaintInfo.data.map((shape, index) =>
      index === targetIndex ? updateState : shape
    );

    setTotalPaintInfo((prev) => ({ ...prev, data: [...newData] }));
  };

  const updateTotal = <T extends PaintDataType>(
    updateState: T,
    isRemove: boolean = false
  ) => {
    const newData = isRemove
      ? totalPaintInfo.data.slice(0, -1).concat(updateState as T)
      : totalPaintInfo.data.concat(updateState as T);

    setTotalPaintInfo((prev) => ({ ...prev, data: newData }));
  };

  const getUpdateLastType = (
    lastCurveIndex: number,
    type: Omit<keyof typeof paintInfo.PAINT_TYPE, ''>
  ) => {
    switch (type) {
      case paintInfo.PAINT_TYPE.curve: {
        const lastData = totalPaintInfo.data[lastCurveIndex] as CurveListType;

        const pathData = `M ${lastData.x1} ${lastData.y1} Q ${lastData.controlX} ${lastData.controlY} ${lastData.x2} ${lastData.y2}`;

        return {
          ...lastData,
          state: 'curve',
          d: pathData,
        };
      }
      case paintInfo.PAINT_TYPE.polygon: {
        const lastData = totalPaintInfo.data[lastCurveIndex] as PolygonListType;
        return lastData;
      }
    }
  };

  const getTypeLastIndex = (
    type: Omit<keyof typeof paintInfo.PAINT_TYPE, ''>,
    state?: string
  ) => {
    if (type === paintInfo.PAINT_TYPE.polygon)
      return totalPaintInfo.data.findIndex(
        (shape) =>
          shape.type === paintInfo.PAINT_TYPE.polygon &&
          !(shape as PolygonListType).isComplete
      );
    if (type === paintInfo.PAINT_TYPE.curve)
      return totalPaintInfo.data.findIndex(
        (shape) =>
          shape.type === paintInfo.PAINT_TYPE.curve &&
          (shape as CurveListType).state === state
      );
  };

  const lastIndex = totalPaintInfo.data.length - 1;
  const lastShape = totalPaintInfo.data[lastIndex];

  return {
    totalPaintInfo,
    setTotalPaintInfo,
    updateTotal,
    getUpdateLastType,
    updateFindTotal,
    getTypeLastIndex,
    lastShape,
  };
};

export default useDrawCanvas;
