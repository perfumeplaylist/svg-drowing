import type { StageProps } from 'react-konva';
import { useDrawingContext } from './context/useDrawingContext';
import { useMemo, useRef } from 'react';
import useLocalStorage from '../../shared/hooks/useLocalStorage';
import type {
  CircleListType,
  CurveListType,
  LineListType,
  PolygonListType,
  RectListType,
  DrawingInfoProps,
} from '../../shared/types/paintType';
import Canvas from '../../shared/components/Paint';
import useUndoRedo from './hooks/useUndoRedo';
import useDrawCanvas from './hooks/useDrawCanvas';
import paintInfo from '../../shared/constant/paintInfo';

interface TotalPaintInfoType {
  data: (
    | LineListType
    | CircleListType
    | RectListType
    | PolygonListType
    | CurveListType
  )[];
}

const DrawingCanvas = () => {
  const {
    drawingInfo: { mode, thickness, colorInfo },
    handleChangeModeState,
  } = useDrawingContext();

  const [storage, setValue] = useLocalStorage<TotalPaintInfoType>(
    paintInfo.LOCALSTORAGE_KEY,
    {
      data: [],
    }
  );

  const {
    totalPaintInfo,
    setTotalPaintInfo,
    updateTotalPaintInfo,
    updateTotal,
    updateFindTotal,
    getUpdateLastType,
    getTypeLastIndex,
    lastShape,
  } = useDrawCanvas(storage);

  const isDrawing = useRef<boolean>(false);
  const isCurving = useRef<boolean>(false);

  const newShape = useMemo(
    () =>
      ({
        type: mode.tool,
        key: Date.now() - Math.random() * 10,
        strokeWidth: thickness,
        strokeColor: colorInfo.stoke,
        color: colorInfo.fill,
      }) as DrawingInfoProps,
    [mode, thickness, colorInfo]
  );

  const handleMouseDown = ({ target }: StageProps) => {
    if (!mode.tool.length) return;
    const { x, y } = target.getStage().getPointerPosition();
    isDrawing.current = true;

    switch (mode.tool) {
      case paintInfo.PAINT_TYPE.line: {
        const newData = {
          ...newShape,
          points: [x, y, x, y],
        };

        updateTotal<LineListType>(newData);

        break;
      }
      case paintInfo.PAINT_TYPE.circle: {
        const newData = {
          ...newShape,
          x,
          y,
          rx: 0,
          ry: 0,
        };

        updateTotal<CircleListType>(newData);

        break;
      }
      case paintInfo.PAINT_TYPE.rect: {
        // 기존에 진행했던 방식

        // const newData = totalPaintInfo.data.concat({
        //   ...newShape,
        //   x,
        //   y,
        //   width: 0,
        //   height: 0,
        // } as RectListType);

        // updateTotalPaintInfo(newData);

        const newData = {
          ...newShape,
          x,
          y,
          width: 0,
          height: 0,
        };

        updateTotal<RectListType>(newData);

        break;
      }
      case paintInfo.PAINT_TYPE.curve: {
        if (!isCurving.current) {
          const newData = {
            ...newShape,
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            state: 'dashLine',
          };

          updateTotal<CurveListType>(newData);
          break;
        }

        const lastCurveIndex = getTypeLastIndex(
          paintInfo.PAINT_TYPE.curve,
          'dashCurve'
        )!;

        if (lastCurveIndex !== -1) {
          const updatedCurve = getUpdateLastType(
            lastCurveIndex,
            paintInfo.PAINT_TYPE.curve
          ) as CurveListType;

          updateFindTotal<CurveListType>(lastCurveIndex, updatedCurve);
        }

        isCurving.current = false;
        isDrawing.current = false;
        break;
      }
      case paintInfo.PAINT_TYPE.polygon: {
        const lastPolygonIndex = getTypeLastIndex(
          paintInfo.PAINT_TYPE.polygon
        )!;

        if (lastPolygonIndex === -1) {
          const newData = {
            ...newShape,
            points: [x, y, x, y],
            isComplete: false,
          };

          updateTotal<PolygonListType>(newData);

          break;
        }

        const lastData = getUpdateLastType(
          lastPolygonIndex,
          paintInfo.PAINT_TYPE.polygon
        )! as PolygonListType;

        const updateState = {
          ...lastData,
          points: [...lastData.points.slice(0, -2), x, y],
        };

        updateFindTotal(lastPolygonIndex, updateState);
        break;
      }
    }
  };

  const handleMouseMove = ({ target }: StageProps) => {
    if (!isDrawing.current || !mode.tool.length) return;
    const { x, y } = target.getStage().getPointerPosition();

    switch (mode.tool) {
      case paintInfo.PAINT_TYPE.line: {
        const updatedLine = {
          ...lastShape,
          points: [
            (lastShape as LineListType).points[0],
            (lastShape as LineListType).points[1],
            x,
            y,
          ],
        };

        updateTotal(updatedLine, true);
        break;
      }
      case paintInfo.PAINT_TYPE.circle: {
        const updateCircle = {
          ...lastShape,
          rx: Math.abs((lastShape as CircleListType).x - x),
          ry: Math.abs((lastShape as CircleListType).y - y),
        } as CircleListType;

        updateTotal(updateCircle, true);
        break;
      }
      case paintInfo.PAINT_TYPE.rect: {
        const updatedRect = {
          ...lastShape,
          width: x - (lastShape as RectListType).x,
          height: y - (lastShape as RectListType).y,
        } as RectListType;

        updateTotal(updatedRect, true);

        break;
      }
      case paintInfo.PAINT_TYPE.curve: {
        if (!isCurving.current) {
          const updateCurve = {
            ...lastShape,
            x2: x,
            y2: y,
          } as CurveListType;

          updateTotal(updateCurve, true);

          break;
        }
        const updateCurve = {
          ...lastShape,
          controlX: x,
          controlY: y,
        } as CurveListType;

        updateTotal(updateCurve, true);

        break;
      }
      case paintInfo.PAINT_TYPE.polygon: {
        const lastPolygonIndex = getTypeLastIndex(
          paintInfo.PAINT_TYPE.polygon
        )!;

        if (lastPolygonIndex !== -1) {
          const lastData = getUpdateLastType(
            lastPolygonIndex,
            paintInfo.PAINT_TYPE.polygon
          )! as PolygonListType;

          const updateState = {
            ...lastData,
            points: [...lastData.points.slice(0, -2), x, y],
          };

          updateFindTotal(lastPolygonIndex, updateState);
        }
        break;
      }
    }
  };

  const handleMouseUp = ({ target }: StageProps) => {
    if (mode.tool === paintInfo.PAINT_TYPE.curve) {
      const lastCurveIndex = getTypeLastIndex(
        paintInfo.PAINT_TYPE.curve,
        'dashLine'
      )!;

      if (lastCurveIndex !== -1) {
        const lastCurve = totalPaintInfo.data[lastCurveIndex] as CurveListType;

        const updatedCurve = {
          ...lastCurve,
          state: 'dashCurve',
          controlX: lastCurve.x2,
          controlY: lastCurve.y2,
        };

        updateFindTotal(lastCurveIndex, updatedCurve);

        isCurving.current = true;
        return;
      }
    }

    if (mode.tool === paintInfo.PAINT_TYPE.polygon) {
      const { x, y } = target.getStage().getPointerPosition();

      const lastPolygonIndex = getTypeLastIndex(paintInfo.PAINT_TYPE.polygon)!;

      if (lastPolygonIndex !== -1) {
        const { points, ...lastPolygonInfo } = getUpdateLastType(
          lastPolygonIndex,
          paintInfo.PAINT_TYPE.polygon
        ) as PolygonListType;

        const startX = points[0];
        const startY = points[1];

        const isNearStart =
          Math.abs(x - startX) < 10 && Math.abs(y - startY) < 10;

        const newPoints = isNearStart
          ? [...points.slice(0, -2), startX, startY]
          : [...points, x, y];

        const newData = {
          ...lastPolygonInfo,
          points: newPoints,
          isComplete: isNearStart,
        };

        updateFindTotal(lastPolygonIndex, newData);
      }
    }
    isDrawing.current = false;
  };

  useUndoRedo({
    totalPaintInfo,
    setTotalPaintInfo,
    modeState: mode.state,
    handleChangeModeState,
    setValue,
  });

  return (
    <Canvas.Stage
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <Canvas.Layer>
        {totalPaintInfo.data.map((paint) => (
          <Canvas.Paint {...paint} key={paint.key} />
        ))}
      </Canvas.Layer>
    </Canvas.Stage>
  );
};

export default DrawingCanvas;
