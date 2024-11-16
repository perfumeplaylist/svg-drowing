import DrawingProvider from '../../features/Drawing/context/DrawingProvider';
import DrawingCanvas from '../../features/Drawing/DrawingCanvas';
import ButtonGroup from '../../features/paintMode/ButtonGroup';
import ColorSetting from '../../features/paintMode/ColorSetting';
import LineSetting from '../../features/paintMode/LineSetting';
import { Common } from '../../layout/Common';
import { Paint } from '../../layout/Paint';
import Divider from '../../shared/components/Divider';
import Title from '../../shared/components/Title';

export default function DrawingPage() {
  // mode와 다양한 state를 정의해야한다.(context를 사용 안할시)

  return (
    <>
      <Common.Header.HeaderRoot>
        <Common.Header.HeaderLogo>
          <svg
            width="24"
            height="24"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
              fill="currentColor"
            ></path>
          </svg>
          <Title level={2}>Drawing Board</Title>
        </Common.Header.HeaderLogo>
      </Common.Header.HeaderRoot>
      <Divider />
      <Common.Body>
        <DrawingProvider>
          <Paint.SideBar>
            <ButtonGroup />
            <LineSetting />
            <ColorSetting />
          </Paint.SideBar>
          <Paint.Canvas>
            <DrawingCanvas />
          </Paint.Canvas>
        </DrawingProvider>
      </Common.Body>
    </>
  );
}
