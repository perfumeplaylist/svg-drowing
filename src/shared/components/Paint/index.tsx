import {
  Ellipse as KonvaEllipse,
  Line as KonvaLine,
  Rect as KonvaRect,
  Path as KonvaPath,
  Layer as KonvaLayer,
  Stage as KonvaStage,
  StageProps as KonvaStageProps,
} from 'react-konva';

import type {
  LineListType,
  CircleListType,
  RectListType,
  PolygonListType,
  CurveListType,
} from '../../types/paintType';

import { PropsWithChildren } from 'react';
import paintInfo from '../../constant/paintInfo';

type PaintProps =
  | LineListType
  | CircleListType
  | RectListType
  | PolygonListType
  | CurveListType;

const Stage = ({ children, ...props }: PropsWithChildren<KonvaStageProps>) => {
  return (
    <KonvaStage
      width={window.innerWidth}
      height={window.innerHeight}
      {...props}
    >
      {children}
    </KonvaStage>
  );
};

const Layer = ({ children }: PropsWithChildren) => {
  return <KonvaLayer>{children}</KonvaLayer>;
};

const Paint = ({ type, ...props }: PaintProps) => {
  switch (type) {
    case paintInfo.PAINT_TYPE.line: {
      const lineProps = props as LineListType;
      return (
        <KonvaLine
          {...lineProps}
          points={lineProps.points}
          stroke={lineProps.strokeColor}
          strokeWidth={lineProps.strokeWidth}
        />
      );
    }
    case paintInfo.PAINT_TYPE.circle: {
      const circleProps = props as CircleListType;
      return (
        <KonvaEllipse
          {...circleProps}
          x={circleProps.x}
          y={circleProps.y}
          radiusX={circleProps.rx}
          radiusY={circleProps.ry}
          fill={circleProps.color}
          stroke={circleProps.strokeColor}
          strokeWidth={circleProps.strokeWidth}
        />
      );
    }
    case paintInfo.PAINT_TYPE.rect: {
      const rectProps = props as RectListType;
      return (
        <KonvaRect
          {...rectProps}
          x={rectProps.x}
          y={rectProps.y}
          width={rectProps.width}
          height={rectProps.height}
          fill={rectProps.color}
          stroke={rectProps.strokeColor}
          strokeWidth={rectProps.strokeWidth}
        />
      );
    }
    case paintInfo.PAINT_TYPE.curve: {
      const curveProps = props as CurveListType;
      switch (curveProps.state) {
        case 'dashLine': {
          return (
            <KonvaLine
              points={[
                curveProps.x1,
                curveProps.y1,
                curveProps.x2,
                curveProps.y2,
              ]}
              stroke={curveProps.strokeColor}
              strokeWidth={curveProps.strokeWidth}
              dash={[10, 5]}
            />
          );
        }
        case 'dashCurve': {
          return (
            <KonvaPath
              data={`M ${curveProps.x1} ${curveProps.y1} Q ${curveProps.controlX} ${curveProps.controlY} ${curveProps.x2} ${curveProps.y2}`}
              stroke={curveProps.strokeColor}
              strokeWidth={curveProps.strokeWidth}
              dash={[5, 5]}
            />
          );
        }
        case 'curve': {
          return (
            <KonvaPath
              key={curveProps.key}
              data={curveProps.d}
              stroke={curveProps.strokeColor}
              strokeWidth={curveProps.strokeWidth}
            />
          );
        }
      }
    }
    case paintInfo.PAINT_TYPE.polygon: {
      const polygonProps = props as PolygonListType;
      return (
        <KonvaLine
          {...polygonProps}
          points={polygonProps.points}
          stroke={polygonProps.strokeColor}
          strokeWidth={polygonProps.strokeWidth}
          closed={polygonProps.isComplete}
          fill={polygonProps.isComplete ? polygonProps.color : 'none'}
        />
      );
    }
  }

  return null;
};

const Canvas = {
  Stage,
  Layer,
  Paint,
};

export default Canvas;
