import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  emptyBoxContainer: {
    top: 24,
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshControl: {
    transform: [{ scaleY: 0.7 }, { scaleX: 0.7 }, { translateY: -24 }],
  },
});

export default styles;
