import { PropsWithChildren } from 'react';

import * as S from './Paint.style';

const SideBar = ({ children }: PropsWithChildren) => {
  return <S.SideBar>{children}</S.SideBar>;
};

export default SideBar;
