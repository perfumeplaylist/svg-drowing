import Button from '../../../shared/components/Button';
import Title from '../../../shared/components/Title';
import { useDrawingContext } from '../../paintCanvas/context/useDrawing';
import paintType from '../../../shared/constant/paintInfo';
import Card from '../../../shared/components/Card';

// TODO:buttonground를 통해서 리팩토링
// TODO:합성 컴포넌트 적용하여 변화에 좋은 컴포넌트 제작하기

const UndoRedo = () => {
  // isDisabled : undo | redo | all | not

  const { handleChangeModeState } = useDrawingContext();

  return (
    <Card>
      <Card.Header>
        <Title>Undo/Redo</Title>
      </Card.Header>
      <Card.Main>
        {paintType.PAINT_ARR.map((value) => (
          <Button onClick={() => handleChangeModeState(value)}>{value}</Button>
        ))}
      </Card.Main>
    </Card>
  );
};

export default UndoRedo;
