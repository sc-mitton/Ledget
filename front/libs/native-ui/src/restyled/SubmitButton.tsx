import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { Check } from 'geist-native-icons';

import { Button } from './Button';
import type { ButtonProps } from './Button';
import { Box } from './Box';
import { Spinner } from '../animated/loading-indicators/Spinner';
import { Icon } from './Icon';

interface ExtraProps {
  isLoading?: boolean;
  isSuccess?: boolean;
  isSubmitting?: boolean;
  children?: React.ReactNode | ((props: { isSuccess?: boolean, isLoading?: boolean, isSubmitting?: boolean }) => React.ReactNode);
}

export const SubmitButton = (props: Omit<ButtonProps, 'children'> & ExtraProps) => {
  const [showCheck, setShowCheck] = useState(false);
  const { isLoading, isSuccess, isSubmitting, children, style, ...rest } = props;
  const checkScale = useSharedValue(.9);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSuccess) {

      setShowCheck(true);

      checkScale.value = withSequence(
        withTiming(1.3, { duration: 200 }),
        withTiming(1.2, { duration: 200 }),
        withDelay(2000, withTiming(.7, { duration: 200 }))
      );

      timeout = setTimeout(() => {
        setShowCheck(false);
      }, 2600);
    }
    return () => clearTimeout(timeout);

  }, [isSuccess]);

  return (
    <Button transparent={isSubmitting || showCheck} style={[style, styles.button]} {...rest}>
      {({ color }) => (
        <>
          {isSubmitting && <Spinner color={color} />}
          <Animated.View style={[{ transform: [{ scale: checkScale }] }, styles.checkContainer]}>
            {isSuccess &&
              <Box padding='xxs'>
                <Icon icon={Check} color={'successIcon'} />
              </Box>}
          </Animated.View>
          {typeof children === 'function' ? children({ isSubmitting, isSuccess, isLoading }) : children}
        </>
      )}
    </Button>
  );
};

const styles = StyleSheet.create({
  checkContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -1 }, { translateY: -1 }],
  },
  button: {
    position: 'relative',
  }
});
