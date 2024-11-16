import * as S from './Divider.style';

export interface DividerProps {
  direction?: 'row' | 'column';
}

const Divider = ({ direction = 'row' }: DividerProps) => {
  return <S.Divider direction={direction} />;
};

export default Divider;
