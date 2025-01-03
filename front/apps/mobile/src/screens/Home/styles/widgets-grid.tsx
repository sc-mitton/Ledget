import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainBox: {
    zIndex: 0,
    flex: 1,
  },
  box: {
    zIndex: 0,
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
    position: 'relative',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  currentWidgetsScrollView: {
    marginTop: 12,
  },
  pickerWidgetsScrollView: {
    marginTop: 8,
    marginBottom: 144,
  },
  widgetsContainer: {
    width: '100%',
  },
  pickerBoxOuter: {
    zIndex: 100,
  },
});

export default styles;
