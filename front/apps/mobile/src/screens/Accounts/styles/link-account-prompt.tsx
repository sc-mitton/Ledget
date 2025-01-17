import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  blurView: {
    zIndex: 1,
    transform: [{ translateY: 12 }],
  },
  addAccountButtonContainer: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAccountButton: {
    position: 'absolute',
  },
  message: {
    position: 'absolute',
    transform: [{ translateY: 32 }],
  },
});

export default styles;
