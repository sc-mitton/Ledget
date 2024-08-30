import { useEffect, useState } from 'react';

import { useAppSelector, useAppDispatch } from '@/hooks';
import { ToastStack } from '@ledget/native-ui';
import { toastStackSelector, tossToast } from '@ledget/shared-features';

const Toast = () => {
  const dispatch = useAppDispatch();
  const toast = useAppSelector(toastStackSelector);
  const [timeoutMap, setTimeoutMap] = useState<Record<string, NodeJS.Timeout>>({})

  useEffect(() => {
    // If toast isn't in toast stack, add it to the timeout map.
    // The timeout map dispatches the tossToast action after the timeout
    // amount specified in the toast object.
    toast.forEach(t => {
      if (!timeoutMap[t.id]) {
        const timeout = setTimeout(() => {
          dispatch(tossToast(t.id))
        }, t.timer)
        setTimeoutMap(prev => ({ ...prev, [t.id]: timeout }))
      }
    })
  }, [toast])

  return <ToastStack stack={toast} />;
}

export default Toast;
