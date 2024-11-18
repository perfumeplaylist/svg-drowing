import paintType from '../constant/paintInfo';

export interface DrawingInfo {
  mode: {
    tool: keyof typeof paintType.PAINT_TYPE | '';
    state: keyof typeof paintType.PAINT_FN_TYPE | '';
  };
  thickness: number;
  colorInfo: typeof paintType.COLOR_TYPE;
}

export interface DrawingInfoProps {
  strokeWidth: number;
  strokeColor: string;
  color?: string;
  type: string;
  key: number;
}

export interface LineListType extends DrawingInfoProps {
  points: number[];
}

export interface CircleListType extends DrawingInfoProps {
  x: number;
  y: number;
  rx: number;
  ry: number;
}

export interface RectListType extends DrawingInfoProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PolygonListType extends LineListType {
  isComplete: boolean;
}

export interface CurveListType extends DrawingInfoProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  state: string;
  controlX?: number;
  controlY?: number;
  d?: string;
}
