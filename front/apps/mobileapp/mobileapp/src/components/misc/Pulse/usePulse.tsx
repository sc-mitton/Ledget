import { useEffect } from "react";
import { Animated } from "react-native";

const innerPulseLength = 2000;
const innerPulseDelay = 500;
const outerPulseLength = 2000;

const successLength = 500;

export const usePulse = ({ onSuccess }: { onSuccess: () => void }) => {
  const innerScale = new Animated.Value(.6);
  const outerScale = new Animated.Value(1);
  const fade = new Animated.Value(1);

  const inner = Animated.loop(
    Animated.sequence([
      Animated.timing(innerScale, {
        toValue: 1.2,
        duration: innerPulseLength,
        delay: innerPulseDelay,
        useNativeDriver: true
      }),
      Animated.timing(innerScale, {
        toValue: .6,
        duration: innerPulseLength,
        delay: innerPulseDelay,
        useNativeDriver: true
      })
    ])
  );

  const outer = Animated.loop(
    Animated.sequence([
      Animated.timing(outerScale, {
        toValue: 1.6,
        duration: outerPulseLength + innerPulseDelay,
        useNativeDriver: true
      }),
      Animated.timing(outerScale, {
        toValue: 1,
        duration: outerPulseLength + innerPulseDelay,
        useNativeDriver: true
      })
    ])
  );

  useEffect(() => {
    inner.start();
    outer.start();
  }, []);

  const succeed = () => {
    inner.stop();
    outer.stop();

    Animated.parallel([
      Animated.timing(innerScale, {
        toValue: 0,
        duration: successLength,
        useNativeDriver: true
      }),
      Animated.timing(outerScale, {
        toValue: 0,
        duration: successLength,
        useNativeDriver: true,
      })
    ]).start((result) => {
      if (result.finished) {
        onSuccess();
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 0,
            duration: successLength,
            useNativeDriver: true
          }),
          Animated.parallel([
            Animated.timing(innerScale, {
              toValue: 1.2,
              duration: successLength,
              useNativeDriver: true
            }),
            Animated.timing(outerScale, {
              toValue: 1.6,
              duration: successLength,
              useNativeDriver: true
            })
          ]),
        ]).start();
      }
    })
  };

  return { innerScale, outerScale, fade, succeed };
};
