import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10
  },
  checkbox: {
    width: 24,
    height: 24
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
    position: 'absolute',
  }
});

export default styles;
