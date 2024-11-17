import { PropsWithChildren, useEffect, useState } from 'react';
import * as S from './Toast.style';

interface ToastProps extends PropsWithChildren {
  duration: number;
}

const Root = ({ duration, children }: ToastProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), duration - 300);

    return () => {
      clearTimeout(timer);
    };
  }, [duration]);

  return <S.Main visible={visible}>{children}</S.Main>;
};

const Content = ({ children }: PropsWithChildren) => {
  return <>{children}</>;
};

const Toast = Object.assign(Root, {
  Content,
});

export default Toast;
