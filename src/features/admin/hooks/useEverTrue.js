import { useRef, useEffect } from 'react';

export function useEverTrue(value) {
  const ref = useRef(false);
  useEffect(() => {
    if (value) ref.current = true;
  }, [value]);
  return value || ref.current;
}
