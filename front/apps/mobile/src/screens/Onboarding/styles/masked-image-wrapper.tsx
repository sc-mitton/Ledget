import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  maskedImageContainer: {
    overflow: 'hidden',
    alignItems: 'center',
  },
  maskedImageContainerTop: {
    marginBottom: -100,
  },
  maskedImageContainerBottom: {
    marginTop: -100,
  },
  maskedImageTop: {
    transform: [{ translateY: -125 }],
  },
  maskedImageBottom: {
    transform: [{ translateY: 150 }],
  },
  bottomCanvas: {
    bottom: 0,
  },
  topCanvas: {
    top: 0,
  },
  canvas: {
    position: 'absolute',
    width: '100%',
    zIndex: 10,
  },
});

export default styles;
