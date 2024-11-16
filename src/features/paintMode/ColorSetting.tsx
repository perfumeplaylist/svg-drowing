import Title from '../../shared/components/Title';
import { useDrawingContext } from '../Drawing/context/useDrawing';

const ColorSetting = () => {
  const { drawingInfo, handleChangeColor } = useDrawingContext();

  return (
    <article>
      <Title>Colors</Title>
      <ul>
        <li>
          <Title level={4}>fill</Title>
          <input
            type="color"
            value={drawingInfo.colorInfo.fill}
            onChange={(e) => handleChangeColor(e, 'fill')}
          />
        </li>
        <li>
          <Title level={4}>line</Title>
          <input
            type="color"
            value={drawingInfo.colorInfo.line}
            onChange={(e) => handleChangeColor(e, 'line')}
          />
        </li>
        <li>
          <Title level={4}>background</Title>
          <input
            type="color"
            value={drawingInfo.colorInfo.background}
            onChange={(e) => handleChangeColor(e, 'background')}
          />
        </li>
      </ul>
    </article>
  );
};

export default ColorSetting;
