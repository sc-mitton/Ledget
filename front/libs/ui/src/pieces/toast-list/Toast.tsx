import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { InfoFill, AlertCircle, CheckInCircle } from '@geist-ui/icons';

import styles from './toast.module.scss';
import { useTransition, animated } from '@react-spring/web';

export type ToastType = 'success' | 'info' | 'error';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  timer?: number;
  actionLink?: string;
  actionMessage?: string;
  hasLoadingBar?: boolean;
}

export interface NewToast extends Omit<ToastItem, 'id'> {}

export type toastCleanUp = (toastId: string) => void;

export const Toast = ({
  toastStack,
  cleanUp,
}: {
  toastStack: ToastItem[];
  cleanUp: toastCleanUp;
}) => {
  const [uiToastStack, setUiToastStack] = useState<ToastItem[]>([]);
  const [timeoutMap, setTimeoutMap] = useState<Record<string, NodeJS.Timeout>>(
    {}
  );
  const navigate = useNavigate();

  useEffect(() => {
    for (const id in timeoutMap) {
      if (!uiToastStack.find((t) => t.id === id)) {
        clearTimeout(timeoutMap[id]);
        // remove the timeout from the map
        setTimeoutMap((prev) => {
          const { [id]: _, ...rest } = prev;
          return rest;
        });
      }
    }
  }, [uiToastStack]);

  // Keep track of the stack height being passed as a prop,
  // and if it increase, then trigger the addition of a new
  // toast ui item
  useEffect(() => {
    if (toastStack.length > uiToastStack.length) {
      toastStack.forEach((toast) => {
        if (!uiToastStack.find((t) => t.id === toast.id)) {
          setUiToastStack([...uiToastStack, toast]);

          const timeout = setTimeout(() => {
            cleanUp(toast.id);
            setUiToastStack((prev) => prev.filter((t) => t.id !== toast.id));
          }, toast.timer || 5000);

          setTimeoutMap((prev) => ({ ...prev, [toast.id]: timeout }));
        }
      });
    }
  }, [toastStack]);

  const transitions = useTransition(uiToastStack, {
    from: {
      opacity: 0,
      transform: 'translateX(50%)',
      maxHeight: '500px',
      marginTop: '8px',
      marginBottom: '8px',
    },
    enter: {
      opacity: 1,
      transform: 'translateX(0%)',
      maxHeight: '500px',
      paddingTop: '8px',
      paddingBottom: '8px',
      paddingLeft: '10px',
      paddingRight: '10px',
      marginTop: '8px',
      marginBottom: '8px',
    },
    leave: {
      to: async (next: any) => {
        await next({ opacity: 0, transform: 'translateX(50%)' });
        await next({
          maxHeight: '0px',
          paddingTop: '0px',
          paddingBottom: '0px',
          marginTop: '0px',
          marginBottom: '0px',
        });
      },
    },
    config: { duration: 200 },
  });

  return (
    <div className={styles.container}>
      {transitions((style, item) => (
        <animated.div
          style={{
            ...style,
            ...({
              '--toast-timer': `${item.timer || 5000}ms`,
            } as React.CSSProperties),
          }}
          // className={`toast ${item.type} ${item.hasLoadingBar ? 'has-loading-bar' : ''}`}
          className={styles.toast}
          data-loadingbar={item.hasLoadingBar}
          data-error={item.type === 'error'}
        >
          <div>
            {item.type === 'success' && (
              <CheckInCircle className="icon" stroke={'var(--blue)'} />
            )}
            {item.type === 'info' && <InfoFill className="icon" />}
            {item.type === 'error' && <AlertCircle className="icon" />}
          </div>
          <div>
            <span>{item.message}</span>
            {item.actionLink && item.actionMessage && (
              <a
                aria-label={item.actionMessage}
                onClick={() => {
                  if (item.actionLink?.startsWith('http')) {
                    window.open(item.actionLink, '_blank');
                  } else if (item.actionLink?.startsWith('/')) {
                    navigate(item.actionLink);
                  }
                  cleanUp(item.id);
                  setUiToastStack((prev) =>
                    prev.filter((t) => t.id !== item.id)
                  );
                }}
              >
                {item.actionMessage}
              </a>
            )}
          </div>
        </animated.div>
      ))}
    </div>
  );
};
