import { useEffect, useState } from 'react';

export const useLoaded = (time?: number, initialLoaded: boolean = false) => {
  const [loaded, setLoaded] = useState(initialLoaded);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (time && !loaded) {
      timeout = setTimeout(() => {
        setLoaded(true);
      }, time);
    } else if (!time) {
      setLoaded(true);
    }
    return () => clearTimeout(timeout);
  }, [time, initialLoaded]);

  return loaded;
};
