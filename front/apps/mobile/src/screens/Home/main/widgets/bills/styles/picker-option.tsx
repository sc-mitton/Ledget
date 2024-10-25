import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    gap: 8
  },
  calendarButtonContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  dotContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    transform: [{ translateY: -2 }]
  },
  numbers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  numberContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default styles;
