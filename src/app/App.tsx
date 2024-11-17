import { ErrorBoundary } from 'react-error-boundary';
import { ThemeProvider } from 'styled-components';
import DrawingPage from '../pages/Drawing/DrawingPage';
import theme from './styles/theme';
import './styles/global.css';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <ErrorBoundary fallbackRender={(props) => <>{props.error}</>}>
        <DrawingPage />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
