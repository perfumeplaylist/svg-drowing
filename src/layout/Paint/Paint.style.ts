import styled from 'styled-components';

export const SideBar = styled.section`
  flex: 1;
  padding: 10px;
  max-width: 300px;
  height: 100%;
  overflow-y: auto;
`;

export const Main = styled.section`
  flex: 2;
  height: 100%;
  overflow-y: auto;
`;

export const SideBarItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
`;
