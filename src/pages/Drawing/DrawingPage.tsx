import DrawingProvider from '../../features/paintCanvas/context/DrawingProvider';
import DrawingCanvas from '../../features/paintCanvas/ui';
import ColorSetting from '../../features/paintMode/color/ui';
import LineSetting from '../../features/paintMode/thickness/ui';
import logoIcon from '../../assets/icon.svg';
import Divider from '../../shared/components/Divider';
import Title from '../../shared/components/Title';
import UndoRedo from '../../features/paintMode/undoRedo/ui';
import ToolSetting from '../../features/paintMode/tools/ui';
import Toast from '../../shared/components/Toast';
import { Common } from '../../layout/Common';
import { Paint } from '../../layout/Paint';
import { ErrorBoundary } from 'react-error-boundary';

export default function DrawingPage() {
  return (
    <>
      <Common.Header.HeaderRoot>
        <Common.Header.HeaderLogo>
          <img src={logoIcon} alt="logo_Icon" width={20} height={20} />
          <Title level={2}>Drawing Board</Title>
        </Common.Header.HeaderLogo>
      </Common.Header.HeaderRoot>
      <Divider />
      <Common.Body>
        <ErrorBoundary
          fallbackRender={(props) => (
            <Toast duration={1000}>
              <Toast.Content>{props.error}</Toast.Content>
            </Toast>
          )}
        >
          <DrawingProvider>
            <Paint.SideBar.Container>
              <Paint.SideBar.SideBarItem>
                <ToolSetting />
                <LineSetting />
                <ColorSetting />
                <UndoRedo />
              </Paint.SideBar.SideBarItem>
            </Paint.SideBar.Container>
            <Divider direction="column" />
            <Paint.Main>
              <DrawingCanvas />
            </Paint.Main>
          </DrawingProvider>
        </ErrorBoundary>
      </Common.Body>
    </>
  );
}
