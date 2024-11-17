import type { StageProps } from 'react-konva';
import { useDrawingContext } from './context/useDrawing';
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
import paintType from '../../shared/constant/paintInfo';
import useUndoRedo from './useUndoRedo';
import useDrawCanvas from './useDrawCanvas';

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
    paintType.LOCALSTORAGE_KEY,
    {
      data: [],
    }
  );

  const {
    totalPaintInfo,
    setTotalPaintInfo,
    updateTotalPaintInfo,
    getCurvePaintInfo,
    getPolygonLastIndex,
    lastShape,
  } = useDrawCanvas(storage);

  const isDrawing = useRef<boolean>(false);
  const isCurving = useRef<boolean>(false);

  const newShape = useMemo(
    () =>
      ({
        type: mode.tool,
        key: Date.now(),
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
      case 'line': {
        const newData = totalPaintInfo.data.concat({
          ...newShape,
          points: [x, y, x, y],
        } as LineListType);

        updateTotalPaintInfo(newData);

        break;
      }
      case 'circle': {
        const newData = totalPaintInfo.data.concat({
          ...newShape,
          x,
          y,
          rx: 0,
          ry: 0,
        } as CircleListType);

        updateTotalPaintInfo(newData);

        break;
      }
      case 'rect': {
        const newData = totalPaintInfo.data.concat({
          ...newShape,
          x,
          y,
          width: 0,
          height: 0,
        } as RectListType);

        updateTotalPaintInfo(newData);

        break;
      }
      case 'curve': {
        if (!isCurving.current) {
          const newTempLine = totalPaintInfo.data.concat({
            ...newShape,
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            state: 'dashLine',
          } as CurveListType);

          updateTotalPaintInfo(newTempLine);
          break;
        }
        const lastCurveIndex = totalPaintInfo.data
          .slice()
          .reverse()
          .findIndex((shape) => shape.type === 'curve');

        if (lastCurveIndex !== -1) {
          const { actualIndex, updatedCurve } =
            getCurvePaintInfo(lastCurveIndex);

          const newData = totalPaintInfo.data.map((shape, index) =>
            index === actualIndex ? updatedCurve : shape
          );

          updateTotalPaintInfo(newData);
        }

        isCurving.current = false;
        isDrawing.current = false;
        break;
      }
      case 'polygon': {
        const lastPolygonIndex = getPolygonLastIndex();

        if (lastPolygonIndex === -1) {
          const newDate = totalPaintInfo.data.concat({
            ...newShape,
            points: [x, y, x, y],
            isComplete: false,
          } as PolygonListType);

          updateTotalPaintInfo(newDate);

          break;
        }

        const updatedData = totalPaintInfo.data.map((shape, index) => {
          if (lastPolygonIndex === index)
            return {
              ...(shape as PolygonListType),
              points: [...(shape as PolygonListType).points, x, y],
            };
          return shape;
        });

        updateTotalPaintInfo(updatedData);
        break;
      }
    }
  };

  const handleMouseMove = ({ target }: StageProps) => {
    if (!isDrawing.current || !mode.tool.length) return;
    const { x, y } = target.getStage().getPointerPosition();

    switch (mode.tool) {
      case 'line': {
        const updatedLine = totalPaintInfo.data.slice(0, -1).concat({
          ...lastShape,
          points: [
            (lastShape as LineListType).points[0],
            (lastShape as LineListType).points[1],
            x,
            y,
          ],
        } as LineListType);

        updateTotalPaintInfo(updatedLine);
        break;
      }
      case 'circle': {
        const updatedCircle = totalPaintInfo.data.slice(0, -1).concat({
          ...lastShape,
          rx: Math.abs((lastShape as CircleListType).x - x),
          ry: Math.abs((lastShape as CircleListType).y - y),
        } as CircleListType);

        updateTotalPaintInfo(updatedCircle);
        break;
      }
      case 'rect': {
        const updatedRect = totalPaintInfo.data.slice(0, -1).concat({
          ...lastShape,
          width: x - (lastShape as RectListType).x,
          height: y - (lastShape as RectListType).y,
        } as RectListType);

        updateTotalPaintInfo(updatedRect);

        break;
      }
      case 'curve': {
        if (!isCurving.current) {
          const updateCurve = totalPaintInfo.data.slice(0, -1).concat({
            ...lastShape,
            x2: x,
            y2: y,
          } as CurveListType);

          updateTotalPaintInfo(updateCurve);

          break;
        }
        const updateCurve = totalPaintInfo.data.slice(0, -1).concat({
          ...lastShape,
          controlX: x,
          controlY: y,
        });

        updateTotalPaintInfo(updateCurve);

        break;
      }
      case 'polygon': {
        const lastPolygonIndex = getPolygonLastIndex();

        if (lastPolygonIndex !== -1) {
          const updatedData = totalPaintInfo.data.map((shape, index) =>
            index === lastPolygonIndex
              ? {
                  ...(shape as PolygonListType),
                  points: [
                    ...(shape as PolygonListType).points.slice(0, -2),
                    x,
                    y,
                  ],
                }
              : shape
          );

          updateTotalPaintInfo(updatedData);
        }
        break;
      }
    }
  };

  const handleMouseUp = ({ target }: StageProps) => {
    if (mode.tool === 'curve') {
      const lastCurveIndex = totalPaintInfo.data.findIndex(
        (shape) =>
          shape.type === 'curve' &&
          (shape as CurveListType).state === 'dashLine'
      );

      if (lastCurveIndex !== -1) {
        const lastCurve = totalPaintInfo.data[lastCurveIndex] as CurveListType;
        const updatedCurve = {
          ...lastCurve,
          state: 'dashCurve',
          controlX: lastCurve.x2,
          controlY: lastCurve.y2,
        };

        const newData = totalPaintInfo.data.map((shape, index) =>
          index === lastCurveIndex ? updatedCurve : shape
        );

        updateTotalPaintInfo(newData);

        isCurving.current = true;
        return;
      }
    }

    if (mode.tool === 'polygon') {
      const { x, y } = target.getStage().getPointerPosition();

      const lastPolygonIndex = getPolygonLastIndex();

      if (lastPolygonIndex !== -1) {
        const lastPolygon = totalPaintInfo.data[
          lastPolygonIndex
        ] as PolygonListType;

        const startX = lastPolygon.points[0];
        const startY = lastPolygon.points[1];

        const isNearStart =
          Math.abs(x - startX) < 10 && Math.abs(y - startY) < 10;

        const updatedData = totalPaintInfo.data.map((shape, index) =>
          index === lastPolygonIndex
            ? {
                ...lastPolygon,
                points: isNearStart
                  ? [...lastPolygon.points.slice(0, -2), startX, startY]
                  : [...lastPolygon.points, x, y],
                isComplete: isNearStart,
              }
            : shape
        );

        updateTotalPaintInfo(updatedData);
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
