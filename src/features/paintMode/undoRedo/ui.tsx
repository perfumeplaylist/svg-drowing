import Button from '../../../shared/components/Button';
import Title from '../../../shared/components/Title';
import { useDrawingContext } from '../../paintCanvas/context/useDrawingContext';
import paintType from '../../../shared/constant/paintInfo';
import Card from '../../../shared/components/Card';

const UndoRedo = () => {
  const { handleChangeModeState } = useDrawingContext();

  return (
    <Card>
      <Card.Header>
        <Title>Undo/Redo</Title>
      </Card.Header>
      <Card.Main>
        {paintType.PAINT_ARR.map((value, index) => (
          <Button key={index} onClick={() => handleChangeModeState(value)}>
            {value}
          </Button>
        ))}
      </Card.Main>
    </Card>
  );
};

export default UndoRedo;
