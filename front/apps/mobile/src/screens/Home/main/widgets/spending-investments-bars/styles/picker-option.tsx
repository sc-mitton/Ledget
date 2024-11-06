import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    height: '100%',
  },
  bottomRow: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: 6 }]
  }
});

export default styles;
