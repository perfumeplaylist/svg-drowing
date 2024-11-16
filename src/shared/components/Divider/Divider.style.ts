import styled from 'styled-components';
import type { DividerProps } from '.';

export const Divider = styled.div<DividerProps>`
  width: ${(props) => (props.direction === 'row' ? '100%' : '1px')};
  height: ${(props) => (props.direction === 'row' ? '1px' : '100%')};
  background-color: ${(props) => props.theme.color.gray400};
`;
