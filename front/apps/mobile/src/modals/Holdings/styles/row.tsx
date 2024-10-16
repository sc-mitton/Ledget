import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  rowContainer: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 16,
    paddingLeft: 20,
    padding: 12
  },
  nameContainer: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  tickerSymbol: {
    marginTop: -2
  },
  amountContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  holdingTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    gap: 2
  },
  seperator: {
    position: 'absolute',
    top: 0,
    left: 44,
    right: 0,
    zIndex: 10,
  },
  leftActions: {
    marginTop: 6,
    paddingRight: 24,
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center'
  },
  pinButton: {
    borderRadius: 100,
  },
  pinBox: {
    transform: [{ translateX: 8 }],
    marginLeft: -16
  }
});

export default styles;
