import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pickerBoxOuter: {
    zIndex: 100
  },
  currentWidgets: {
    zIndex: 0,
    flex: 1,
  },
  scrollView: {
    flex: 1,
    position: 'relative',
    marginHorizontal: -24,
    paddingHorizontal: 24
  },
  currentWidgetsScrollView: {
    marginTop: 12
  },
  pickerWidgetsScrollView: {
    marginTop: 8,
    marginBottom: 64
  },
  widgetsContainer: {
    width: '100%',
  }
});

export default styles;
