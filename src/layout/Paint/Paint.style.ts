import styled from 'styled-components';

export const SideBar = styled.section`
  flex: 1;
  padding: 10px;
  max-width: 300px;
  height: 100%;
  border-right: 1px solid ${(props) => props.theme.color.black};
  overflow-y: auto;
`;

export const Canvas = styled.section`
  flex: 2;
  height: 100%;
  overflow-y: auto;
`;
