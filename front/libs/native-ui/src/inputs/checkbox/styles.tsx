import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
  },
  checkIconContainer: {
    position: 'absolute',
    width: 2,
    height: 2,
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    transform: [{ translateX: -0.5 }],
    position: 'absolute',
  },
});

export default styles;
