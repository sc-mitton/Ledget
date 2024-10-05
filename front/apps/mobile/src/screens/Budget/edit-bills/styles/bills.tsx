import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8
  },
  nameContainer: {
    flexGrow: 1,
    marginLeft: 18,
  },
  amountContainer: {
    flexDirection: 'row',
    gap: 6
  },
  headerIcon: {
    marginLeft: 4
  },
  header: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 8,
    width: '100%',
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingLeft: 12,
    flexDirection: 'row',
    gap: 8
  },
  scrollViewContent: {
    marginTop: 40,
    paddingHorizontal: 20,
    height: '100%',
  },
  emptyTextContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    position: 'absolute',
  }
});

export default styles;
