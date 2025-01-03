import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pulseContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1,
  },
  svg: {
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  circleContainer: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    borderRadius: 100,
  },
});

export default styles;
