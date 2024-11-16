import { Ellipse, Layer, Line, Rect, Stage, StageProps } from 'react-konva';
import { DrawingInfo, useDrawingContext } from './context/useDrawing';
import { useRef, useState } from 'react';

interface DrawingInfoProps {
  strokeWidth: DrawingInfo['thickness'];
  strokeColor: DrawingInfo['colorInfo']['line'];
  color?: DrawingInfo['colorInfo']['fill'];
}

interface lineListType extends DrawingInfoProps {
  points: number[];
}

interface CircleListType extends DrawingInfoProps {
  x: number;
  y: number;
  rx: number;
  ry: number;
}

interface RectListType extends DrawingInfoProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface polygonListType extends lineListType {
  isComplete: boolean;
}

const DrawingCanvas = () => {
  const { drawingInfo } = useDrawingContext();
  const [lineList, setLineList] = useState<lineListType[]>([]);
  const [circleList, setCircleList] = useState<CircleListType[]>([]);
  const [rectList, setRectList] = useState<RectListType[]>([]);
  const [polygonList, setPolygonList] = useState<polygonListType[]>([]);
  const isDrawing = useRef<boolean>(false);

  const handleMouseDown = (e: StageProps) => {
    if (!drawingInfo.mode.length) return;
    isDrawing.current = true;
    const { x, y } = e.target.getStage().getPointerPosition();

    switch (drawingInfo.mode) {
      case 'line': {
        setLineList((prev) => [
          ...prev,
          {
            points: [x, y, x, y],
            strokeWidth: drawingInfo.thickness,
            strokeColor: drawingInfo.colorInfo.line,
          },
        ]);
        break;
      }
      case 'circle': {
        setCircleList((prev) => [
          ...prev,
          {
            x,
            y,
            rx: 0,
            ry: 0,
            color: drawingInfo.colorInfo.fill,
            strokeWidth: drawingInfo.thickness,
            strokeColor: drawingInfo.colorInfo.line,
          },
        ]);
        break;
      }
      case 'rect': {
        setRectList((prev) => [
          ...prev,
          {
            x,
            y,
            width: 0,
            height: 0,
            color: drawingInfo.colorInfo.fill,
            strokeWidth: drawingInfo.thickness,
            strokeColor: drawingInfo.colorInfo.line,
          },
        ]);
        break;
      }
      case 'polygon': {
        const lastPolygon = polygonList[polygonList.length - 1];
        if (lastPolygon && !lastPolygon.isComplete) {
          lastPolygon.points = [...lastPolygon.points, x, y];
          setPolygonList([...polygonList.slice(0, -1), lastPolygon]);
        } else {
          setPolygonList((prev) => [
            ...prev,
            {
              isComplete: false,
              points: [x, y, x, y],
              color: drawingInfo.colorInfo.fill,
              strokeWidth: drawingInfo.thickness,
              strokeColor: drawingInfo.colorInfo.line,
            },
          ]);
        }
        break;
      }
    }
  };

  const handleMouseMove = ({ target }: StageProps) => {
    if (!drawingInfo.mode.length || !isDrawing.current) return;

    const { x, y } = target.getStage().getPointerPosition();

    switch (drawingInfo.mode) {
      case 'line': {
        const lastLine = lineList[lineList.length - 1];
        lastLine.points = [lastLine.points[0], lastLine.points[1], x, y];
        setLineList([...lineList.slice(0, -1), lastLine]);
        break;
      }
      case 'circle': {
        let lastCircle = circleList[circleList.length - 1];
        const startX = lastCircle.x;
        const startY = lastCircle.y;

        lastCircle.rx = Math.abs(startX - x);
        lastCircle.ry = Math.abs(startY - y);

        setCircleList([...circleList.slice(0, -1), lastCircle]);
        break;
      }
      case 'rect': {
        let lastRect = rectList[rectList.length - 1];
        const startX = lastRect.x;
        const startY = lastRect.y;

        lastRect.width = x - startX;
        lastRect.height = y - startY;

        setRectList([...rectList.slice(0, -1), lastRect]);
        break;
      }
      case 'polygon': {
        const lastPolygon = polygonList[polygonList.length - 1];
        lastPolygon.points = [...lastPolygon.points.slice(0, -2), x, y]; // 마지막 점만 업데이트
        setPolygonList([...polygonList.slice(0, -1), lastPolygon]);
        break;
      }
    }
  };

  const handleMouseUp = ({ target }: StageProps) => {
    if (!drawingInfo.mode.length) return;

    const { x, y } = target.getStage().getPointerPosition();
    switch (drawingInfo.mode) {
      case 'polygon': {
        const lastPolygon = polygonList[polygonList.length - 1];
        const startX = lastPolygon.points[0];
        const startY = lastPolygon.points[1];

        if (Math.abs(startX - x) < 10 && Math.abs(startY - y) < 10) {
          lastPolygon.isComplete = true;
          lastPolygon.points = [
            ...lastPolygon.points.slice(0, -2),
            startX,
            startY,
          ];
        } else {
          lastPolygon.points = [...lastPolygon.points, x, y]; // 점 추가
        }

        setPolygonList([...polygonList.slice(0, -1), lastPolygon]);
        break;
      }
    }
    isDrawing.current = false;
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      // TODO:background color 넣어야함
    >
      <Layer>
        {lineList.map((line, index) => (
          <Line
            key={index}
            points={line.points}
            stroke={line.strokeColor}
            strokeWidth={line.strokeWidth}
          />
        ))}
        {circleList.map((circle, index) => (
          <Ellipse
            key={index}
            x={circle.x}
            y={circle.y}
            radiusX={circle.rx}
            radiusY={circle.ry}
            fill={circle.color}
            stroke={circle.strokeColor}
            strokeWidth={circle.strokeWidth}
          />
        ))}
        {rectList.map((rect, index) => (
          <Rect
            key={index}
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={rect.color}
            stroke={rect.strokeColor}
            strokeWidth={rect.strokeWidth}
          />
        ))}
        {polygonList.map((polygon, index) => (
          <Line
            key={index}
            points={polygon.points}
            stroke={polygon.strokeColor}
            strokeWidth={polygon.strokeWidth}
            closed={polygon.isComplete}
            fill={polygon.isComplete ? polygon.color : 'none'}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default DrawingCanvas;
