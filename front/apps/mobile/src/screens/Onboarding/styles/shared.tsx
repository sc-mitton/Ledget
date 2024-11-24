import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomSplitButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4
  },
  emptyMessage: {
    marginVertical: 24
  }
});

export default styles;
