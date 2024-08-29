import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
  withDelay,
  useAnimatedStyle
} from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { Check } from 'geist-native-icons';

import { Button } from './Button';
import type { ButtonProps } from './Button';
import { UnstyledSpinner } from '../animated/loading-indicators/Spinner';
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

  const animation = useAnimatedStyle(() => {
    return { transform: [{ scale: checkScale.value }] };
  });

  return (
    <Button transparent={isSubmitting || showCheck} style={[style, styles.button]} {...rest}>
      {({ color }) => (
        <>
          {isSubmitting && <UnstyledSpinner color={color} />}
          <Animated.View style={[animation, styles.checkContainer]}>
            {isSuccess &&
              <View style={styles.check}>
                <Icon icon={Check} color={'successIcon'} />
              </View>}
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
    transformOrigin: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  check: {
    position: 'absolute'
  },
  button: {
    position: 'relative',
  }
});
