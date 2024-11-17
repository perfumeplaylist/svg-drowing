import { ComponentProps, PropsWithChildren } from 'react';
import * as S from './button.style';
export interface ButtonProps
  extends PropsWithChildren,
    ComponentProps<'button'> {
  isClicked?: boolean;
}

const Button = ({ type = 'button', children, ...props }: ButtonProps) => {
  return <S.Button {...props}>{children}</S.Button>;
};

export default Button;
