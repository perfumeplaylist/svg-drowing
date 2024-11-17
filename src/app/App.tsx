import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from 'styled-components';
import DrawingPage from '../pages/Drawing/DrawingPage';
import theme from './styles/theme';
import './styles/global.css';
import Toast from '../shared/components/Toast';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary
        fallbackRender={(props) => (
          <Toast duration={1000}>
            <Toast.Content>{props.error}</Toast.Content>
          </Toast>
        )}
      >
        <DrawingPage />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
