import styled from 'styled-components';

export const Root = styled.article`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  width: 100%;
`;

export const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.3rem;
`;
