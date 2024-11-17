import { useDrawingContext } from '../../paintCanvas/context/useDrawing';
import Title from '../../../shared/components/Title';
import paintType from '../../../shared/constant/paintInfo';
import Card from '../../../shared/components/Card';

const ColorSetting = () => {
  const {
    drawingInfo: { colorInfo },
    handleChangeColor,
  } = useDrawingContext();

  return (
    <Card>
      <Card.Header>
        <Title>Colors</Title>
      </Card.Header>
      <Card.Main>
        <Card.List>
          {paintType.COLOR_ARR.map((name) => (
            <li>
              <Title level={4}>{name}</Title>
              <input
                type="color"
                value={colorInfo[name]}
                onChange={(e) => handleChangeColor(e, name)}
              />
            </li>
          ))}
        </Card.List>
      </Card.Main>
    </Card>
  );
};

export default ColorSetting;
