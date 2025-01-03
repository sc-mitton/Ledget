import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  rowBoxOuter: {
    width: '100%',
  },
  rowBoxInner: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  draggableList: {
    width: '100%',
    marginTop: 32,
    paddingHorizontal: 12,
  },
  nameContainer: {
    gap: 16,
    flexDirection: 'row',
    flexGrow: 1,
  },
  amountContainer: {
    position: 'absolute',
    right: 32,
  },
  headerIcon: {
    marginLeft: 4,
  },
  header: {
    zIndex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 8,
    width: '100%',
    justifyContent: 'space-between',
    paddingRight: 12,
    paddingLeft: 36,
    flexDirection: 'row',
    gap: 8,
  },
});

export default styles;
