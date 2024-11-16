import Title from '../../shared/components/Title';
import { useDrawingContext } from '../Drawing/context/useDrawing';

const LineSetting = () => {
  const { drawingInfo, handleChangeRange } = useDrawingContext();

  return (
    <article>
      <div>
        <Title>Line Thickness</Title>
        <span>{drawingInfo.thickness}</span>
      </div>
      <div>
        <input
          type="range"
          min={5}
          max={50}
          value={drawingInfo.thickness}
          onChange={handleChangeRange}
        />
      </div>
    </article>
  );
};

export default LineSetting;
