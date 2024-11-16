import { ThemeProvider } from 'styled-components';
import DrawingPage from '../pages/Drawing/DrawingPage';
import theme from './styles/theme';
import './styles/global.css';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <DrawingPage />
    </ThemeProvider>
  );
}
