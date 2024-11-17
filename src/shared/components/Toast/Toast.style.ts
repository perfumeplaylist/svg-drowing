import styled, { css } from 'styled-components';

export const Main = styled.div<{ visible: boolean }>`
  position: fixed;
  top: 16px;
  right: 16px;
  padding: 12px 20px;
  background-color: #333;
  color: #fff;
  font-size: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: translateY(-20px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;

  ${({ visible }) =>
    visible &&
    css`
      opacity: 1;
      transform: translateY(0);
    `}
`;
