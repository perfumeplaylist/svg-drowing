import styled from 'styled-components';
import { TitleProps } from '.';

export const Title = styled.h1<TitleProps>`
  font-size: ${(props) => `${2 - props.level! * 0.2}rem`};
  font-weight: bold;
`;
