import Card from '../../../shared/components/Card';
import Title from '../../../shared/components/Title';
import { useDrawingContext } from '../../paintCanvas/context/useDrawingContext';

const LineSetting = () => {
  const {
    drawingInfo: { thickness },
    handleChangeRange,
  } = useDrawingContext();

  return (
    <Card>
      <Card.Header>
        <Title>Line Thickness</Title>
        <span>{thickness}</span>
      </Card.Header>
      <Card.Main>
        <input
          type="range"
          min={5}
          max={50}
          value={thickness}
          onChange={handleChangeRange}
        />
      </Card.Main>
    </Card>
  );
};

export default LineSetting;
