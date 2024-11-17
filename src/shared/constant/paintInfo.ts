const PAINT_TYPE = {
  line: 'line',
  curve: 'curve',
  circle: 'circle',
  rect: 'rect',
  polygon: 'polygon',
};

const COLOR_TYPE = {
  fill: 'fill',
  stoke: 'stoke',
};

const PAINT_FN_TYPE = {
  undo: 'undo',
  redo: 'redo',
};

const BUTTON_ARR = [...Object.keys(PAINT_TYPE)] as (keyof typeof PAINT_TYPE)[];

const COLOR_ARR = [...Object.keys(COLOR_TYPE)] as (keyof typeof COLOR_TYPE)[];

const PAINT_ARR = [
  ...Object.keys(PAINT_FN_TYPE),
] as (keyof typeof PAINT_FN_TYPE)[];

const LOCALSTORAGE_KEY = 'paint';

export default {
  PAINT_TYPE,
  COLOR_TYPE,
  PAINT_FN_TYPE,
  PAINT_ARR,
  BUTTON_ARR,
  COLOR_ARR,
  LOCALSTORAGE_KEY,
};
