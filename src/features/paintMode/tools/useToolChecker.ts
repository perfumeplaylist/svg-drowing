import { useCallback, useMemo } from 'react';

const useToolChecker = (tool: string) => {
  const isReset = useMemo(() => tool.length, [tool]);

  const isClicked = useCallback(
    (value: string) => {
      return tool === value;
    },
    [tool]
  );

  return { isReset, isClicked };
};

export default useToolChecker;
