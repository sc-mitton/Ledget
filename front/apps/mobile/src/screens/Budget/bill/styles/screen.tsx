import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  scrollView: {
    zIndex: 1,
    transform: [{ translateY: -48 }],
  },
  scrollContent: {
    paddingTop: 24,
    zIndex: 1,
  },
});

export default styles;
