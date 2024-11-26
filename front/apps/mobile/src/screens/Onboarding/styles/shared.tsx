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
  },
  header: {
    width: '100%',
    marginTop: 48,
    marginBottom: 8,
    marginLeft: 8
  },
  form: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 12,
    paddingHorizontal: 6,
    paddingBottom: 6,
    paddingTop: 12,
    overflow: 'hidden',
  },
});

export default styles;
