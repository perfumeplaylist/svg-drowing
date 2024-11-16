import { PropsWithChildren } from 'react';
import * as S from './Title.style';

export interface TitleProps extends PropsWithChildren {
  level?: number;
}

const Title = ({ level = 3, children }: TitleProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <S.Title as={Tag}>{children}</S.Title>;
};

export default Title;
