import { useEffect, useState } from 'react';
import { useColorScheme } from '../use-color-scheme/use-color-scheme';

type CSSVar = `--${string}`;
type ReturnType<T> = T extends CSSVar[] ? string[] : string | undefined;

export function useSchemeVar<T extends CSSVar[] | CSSVar>(
  variable: T
): ReturnType<T> {
  const { isDark } = useColorScheme();
  const [result, setResult] = useState<ReturnType<T>>(
    typeof variable === 'string'
      ? undefined
      : (Array(variable.length).fill(undefined) as any)
  );

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return undefined as any;

    if (Array.isArray(variable)) {
      setResult(
        variable.map((v) => getComputedStyle(main).getPropertyValue(v)) as any
      );
    } else {
      setResult(getComputedStyle(main).getPropertyValue(variable) as any);
    }
  }, [isDark]);

  return result as ReturnType<T>;
}

export default useSchemeVar;
