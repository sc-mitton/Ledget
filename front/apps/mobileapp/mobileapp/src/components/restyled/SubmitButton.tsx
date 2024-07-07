import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

import { Button } from './Button';
import type { Props } from './Button';
import { Spinner } from '../animated/LoadingIndicators/Spinner';
import { Icon } from './Icon';

interface ExtraProps {
  isLoading?: boolean;
  isSuccess?: boolean;
  isSubmitting?: boolean;
}

export const SubmitButton = (props: Props & ExtraProps) => {
  const [showCheck, setShowCheck] = useState(false);
  const { isLoading, isSuccess, isSubmitting, label, ...rest } = props;
  const checkScale = useSharedValue(.9);

  useEffect(() => {
    if (isSuccess) {

      setShowCheck(true);

      checkScale.value = withSequence(
        withTiming(1.1, { duration: 200 }),
        withTiming(1, { duration: 200 }),
        withDelay(1000, withTiming(.7, { duration: 200 }))
      );

      setShowCheck(false);
    }
  }, [isSuccess]);

  return (
    <Button label={showCheck ? undefined : label} {...rest} >
      {isSubmitting && <Spinner />}
      <Animated.View style={{ transform: [{ scale: checkScale }] }}>
        {showCheck && <Icon icon={Icon} color={'successIcon'} />}
      </Animated.View>
    </Button>
  );
};
