import type { StageProps } from 'react-konva';
import { useDrawingContext } from './context/useDrawing';
import { useMemo, useRef, useState } from 'react';
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

  const [totalPaintInfo, setTotalPaintInfo] =
    useState<TotalPaintInfoType>(storage);

  const isDrawing = useRef<boolean>(false);
  const isCurving = useRef<boolean>(false);
  const undoArr = useRef<TotalPaintInfoType['data']>([]);
  const redoArr = useRef<TotalPaintInfoType['data']>([]);

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

  // mousedown이 되었을때 어떻게 동작되는지 알아야할까?
  // 어떤게 업데이트가 되어서 화면에 표시되는지가 더 중요하지 않을까?
  const handleMouseDown = ({ target }: StageProps) => {
    if (!mode.tool.length) return;
    const { x, y } = target.getStage().getPointerPosition();
    isDrawing.current = true;

    switch (mode.tool) {
      case 'line': {
        setTotalPaintInfo((prev) => ({
          ...prev,
          data: [
            ...prev.data,
            {
              ...newShape,
              points: [x, y, x, y],
            } as LineListType,
          ],
        }));
        break;
      }
      case 'circle': {
        setTotalPaintInfo((prev) => ({
          ...prev,
          data: [
            ...prev.data,
            {
              ...newShape,
              x,
              y,
              rx: 0,
              ry: 0,
            } as CircleListType,
          ],
        }));
        break;
      }
      case 'rect': {
        setTotalPaintInfo((prev) => ({
          ...prev,
          data: [
            ...prev.data,
            {
              ...newShape,
              x,
              y,
              width: 0,
              height: 0,
            } as RectListType,
          ],
        }));
        break;
      }
      case 'curve': {
        if (!isCurving.current) {
          const newTempLine = {
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            state: 'dashLine',
          };
          setTotalPaintInfo((prev) => ({
            ...prev,
            data: [
              ...prev.data,
              {
                ...newShape,
                ...newTempLine,
              } as CurveListType,
            ],
          }));
          break;
        }
        const lastCurveIndex = totalPaintInfo.data
          .slice()
          .reverse()
          .findIndex((shape) => shape.type === 'curve');
        if (lastCurveIndex !== -1) {
          const actualIndex = totalPaintInfo.data.length - 1 - lastCurveIndex;
          const lastCurve = totalPaintInfo.data[actualIndex] as CurveListType;

          const pathData = `M ${lastCurve.x1} ${lastCurve.y1} Q ${lastCurve.controlX} ${lastCurve.controlY} ${lastCurve.x2} ${lastCurve.y2}`;

          const updatedCurve = {
            ...lastCurve,
            state: 'curve',
            d: pathData,
          };

          setTotalPaintInfo((prev) => ({
            ...prev,
            data: prev.data.map((shape, index) =>
              index === actualIndex ? updatedCurve : shape
            ),
          }));
        }
        isCurving.current = false;
        isDrawing.current = false;
        break;
      }
      case 'polygon': {
        const lastPolygonIndex = totalPaintInfo.data.findIndex(
          (shape) =>
            shape.type === 'polygon' && !(shape as PolygonListType).isComplete
        );

        if (lastPolygonIndex === -1) {
          setTotalPaintInfo((prev) => ({
            ...prev,
            data: [
              ...prev.data,
              {
                ...newShape,
                points: [x, y, x, y],
                isComplete: false,
              } as PolygonListType,
            ],
          }));
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

        setTotalPaintInfo((prev) => ({
          ...prev,
          data: updatedData,
        }));
        break;
      }
    }
  };

  const handleMouseMove = ({ target }: StageProps) => {
    if (!isDrawing.current || !mode.tool.length) return;
    const { x, y } = target.getStage().getPointerPosition();

    const lastIndex = totalPaintInfo.data.length - 1;
    const lastShape = totalPaintInfo.data[lastIndex];

    switch (mode.tool) {
      case 'line': {
        const updatedLine = {
          ...lastShape,
          points: [
            (lastShape as LineListType).points[0],
            (lastShape as LineListType).points[1],
            x,
            y,
          ],
        } as LineListType;

        setTotalPaintInfo((prev) => ({
          ...prev,
          data: [...prev.data.slice(0, -1), updatedLine],
        }));
        break;
      }
      case 'circle': {
        const updatedCircle = {
          ...lastShape,
          rx: Math.abs((lastShape as CircleListType).x - x),
          ry: Math.abs((lastShape as CircleListType).y - y),
        } as CircleListType;

        setTotalPaintInfo((prev) => ({
          ...prev,
          data: [...prev.data.slice(0, -1), updatedCircle],
        }));
        break;
      }
      case 'rect': {
        const updatedRect = {
          ...lastShape,
          width: x - (lastShape as RectListType).x,
          height: y - (lastShape as RectListType).y,
        } as RectListType;

        setTotalPaintInfo((prev) => ({
          ...prev,
          data: [...prev.data.slice(0, -1), updatedRect],
        }));
        break;
      }
      case 'curve': {
        if (!isCurving.current) {
          const updateCurve = {
            ...lastShape,
            x2: x,
            y2: y,
          } as CurveListType;

          setTotalPaintInfo((prev) => ({
            data: [...prev.data.slice(0, -1), updateCurve],
          }));

          break;
        }
        const updateCurve = {
          ...lastShape,
          controlX: x,
          controlY: y,
        };

        setTotalPaintInfo((prev) => ({
          ...prev,
          data: [...prev.data.slice(0, -1), updateCurve],
        }));
        break;
      }
      case 'polygon': {
        const lastPolygonIndex = totalPaintInfo.data.findIndex(
          (shape) =>
            shape.type === 'polygon' && !(shape as PolygonListType).isComplete
        );

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
          setTotalPaintInfo((prev) => ({
            ...prev,
            data: updatedData,
          }));
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

        setTotalPaintInfo((prev) => ({
          ...prev,
          data: prev.data.map((shape, index) =>
            index === lastCurveIndex ? updatedCurve : shape
          ),
        }));
        isCurving.current = true;
        return;
      }
    }

    if (mode.tool === 'polygon') {
      const { x, y } = target.getStage().getPointerPosition();
      const lastPolygonIndex = totalPaintInfo.data.findIndex(
        (shape) =>
          shape.type === 'polygon' && !(shape as PolygonListType).isComplete
      );

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

        setTotalPaintInfo((prev) => ({
          ...prev,
          data: updatedData,
        }));

        if (isNearStart) {
          undoArr.current.push(
            totalPaintInfo.data[totalPaintInfo.data.length - 1]
          );
          if (undoArr.current.length > 40) undoArr.current.shift();
        }
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
