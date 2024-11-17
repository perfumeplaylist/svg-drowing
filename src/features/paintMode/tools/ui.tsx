import { useCallback, useMemo } from 'react';
import Button from '../../../shared/components/Button';
import { useDrawingContext } from '../../paintCanvas/context/useDrawing';
import Title from '../../../shared/components/Title';
import paintType from '../../../shared/constant/paintInfo';
import Card from '../../../shared/components/Card';

// 합성 컴포넌트로 리펙토링 필요
// ui로직과 데이터 로직이 붙어있어서 구분이 필요

const ToolSetting = () => {
  const {
    drawingInfo: {
      mode: { tool },
    },
    handleChangeModeTool,
  } = useDrawingContext();

  const isReset = useMemo(() => tool.length, [tool]);

  const isClicked = useCallback(
    (value: string) => {
      return tool === value;
    },
    [tool]
  );

  return (
    <Card>
      <Card.Header>
        <Title>Tools</Title>
        {isReset ? (
          <p
            style={{ cursor: 'pointer' }}
            onClick={() => handleChangeModeTool(tool)}
          >
            초기화
          </p>
        ) : undefined}
      </Card.Header>
      <Card.Main>
        <Card.List>
          {paintType.BUTTON_ARR.map((value, index) => (
            <li key={index}>
              <Button
                isClicked={isClicked(value)}
                onClick={() => handleChangeModeTool(value)}
              >
                {value}
              </Button>
            </li>
          ))}
        </Card.List>
      </Card.Main>
    </Card>
  );
};

export default ToolSetting;
