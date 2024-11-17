import { useState } from 'react';
import store from '../utils/storage';

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storage, setStorage] = useState(
    store.getLocalStorage(key, initialValue)
  );

  const setValue = <T>(value: T) => {
    setStorage(value);
    store.setLocalStorage(key, value);
  };

  return [storage, setValue];
};

export default useLocalStorage;
