import { useCallback } from 'react';
import Button from '../../shared/components/Button';
import { useDrawingContext } from '../Drawing/context/useDrawing';
import Title from '../../shared/components/Title';

// 직선,곡선,원,직사각형,다각형
// 원,직사각형,직선은 컴포넌트가 있다.(o)
// 다각형,곡선은 조합을 통해서 구현

const buttonInfo = ['line', 'spline', 'circle', 'rect', 'polygon'];

// 합성 컴포넌트로 리펙토링 필요
// ui로직과 데이터 로직이 붙어있어서 구분이 필요

const ButtonGroup = () => {
  const { drawingInfo, handleChangeMode } = useDrawingContext();

  const isClicked = useCallback(
    (value: string) => {
      return drawingInfo.mode === value;
    },
    [drawingInfo]
  );

  return (
    <article>
      <Title>Tools</Title>
      {drawingInfo.mode?.length ? (
        <p onClick={() => handleChangeMode(drawingInfo.mode)}>초기화</p>
      ) : undefined}
      <ul>
        {buttonInfo.map((value) => (
          <Button
            type="button"
            isClicked={isClicked(value)}
            onClick={() => handleChangeMode(value)}
          >
            {value}
          </Button>
        ))}
      </ul>
    </article>
  );
};

export default ButtonGroup;
