import styled from 'styled-components';
import type { ButtonProps } from '.';

export const Button = styled.button<ButtonProps>`
  background-color: ${(props) =>
    props.isClicked ? props.theme.color.gray500 : props.theme.color.gray400};
  font-size: 1rem;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  text-transform: capitalize;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.theme.color.gray600};
  }
`;
