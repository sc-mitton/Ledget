import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  rectangleBox: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    gap: 24,
  },
  totalAmount: {
    marginTop: -4
  },
  dots: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  rectangleLeft: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 3,
    flex: 3,
    paddingLeft: 0
  },
  rectangleLeftInner: {
    minWidth: 75
  },
  rectangleRight: {
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    minWidth: 150,
  },
  rectangleRightRow: {
    flexDirection: 'row',
    height: '50%',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  rectangleRightColumn: {
    justifyContent: 'space-evenly',
    gap: 4
  },
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 2,
    height: 24,
    borderRadius: 8,
    transform: [{ translateX: -18 }],
  }
});

export default styles;
