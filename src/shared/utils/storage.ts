const getLocalStorage = <T>(key: string, initialValue: T) => {
  try {
    const value = localStorage.getItem(key);

    return value ? JSON.parse(value) : initialValue;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

const setLocalStorage = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
};

export default { getLocalStorage, setLocalStorage };
