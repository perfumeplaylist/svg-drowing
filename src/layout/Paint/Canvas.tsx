import { PropsWithChildren } from 'react';

import * as S from './Paint.style';

const Canvas = ({ children }: PropsWithChildren) => {
  return <S.Canvas>{children}</S.Canvas>;
};

export default Canvas;
