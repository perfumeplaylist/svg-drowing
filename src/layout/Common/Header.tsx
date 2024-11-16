import { PropsWithChildren } from 'react';

import * as S from './Common.style';

const HeaderRoot = ({ children }: PropsWithChildren) => {
  return <S.Header>{children}</S.Header>;
};

const HeaderLogo = ({ children }: PropsWithChildren) => {
  return <S.Logo>{children}</S.Logo>;
};

const Header = {
  HeaderRoot,
  HeaderLogo,
};

export default Header;
