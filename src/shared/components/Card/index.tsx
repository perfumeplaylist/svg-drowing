import { PropsWithChildren } from 'react';
import * as S from './Card.style';

const Root = ({ children }: PropsWithChildren) => {
  return <S.Root>{children}</S.Root>;
};

const Header = ({ children }: PropsWithChildren) => {
  return <S.Header>{children}</S.Header>;
};

const Main = ({ children }: PropsWithChildren) => {
  return <S.Main>{children}</S.Main>;
};

const List = ({ children }: PropsWithChildren) => {
  return <S.List>{children}</S.List>;
};

const Card = Object.assign(Root, { Header, Main, List });

export default Card;
