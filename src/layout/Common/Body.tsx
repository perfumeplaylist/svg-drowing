import { PropsWithChildren } from 'react';

import * as S from './Common.style';

const Body = ({ children }: PropsWithChildren) => {
  return <S.Body>{children}</S.Body>;
};

export default Body;
