import { useCallback, useRef } from 'react';

export default function useFn<T extends (...args: any[]) => any>(callback: T) {
  const fnRef = useRef(callback);
  fnRef.current = callback;

  return useCallback((...args) => fnRef.current(...args), []);
}
