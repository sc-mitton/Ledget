import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pickerBoxOuter: {
    zIndex: 100
  },
  currentWidgets: {
    zIndex: -1
  },
  scrollView: {
    flex: 1,
    position: 'relative',
    marginHorizontal: -24,
    paddingHorizontal: 24
  }
});

export default styles;
