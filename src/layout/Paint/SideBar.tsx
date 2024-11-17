import { PropsWithChildren } from 'react';

import * as S from './Paint.style';

const Container = ({ children }: PropsWithChildren) => {
  return <S.SideBar>{children}</S.SideBar>;
};

const SideBarItem = ({ children }: PropsWithChildren) => {
  return <S.SideBarItem>{children}</S.SideBarItem>;
};

const SideBar = {
  Container,
  SideBarItem,
};

export default SideBar;
