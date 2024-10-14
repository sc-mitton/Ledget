import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  chartContainer: {
    height: 200,
    width: '100%',
    paddingTop: 48
  },
  emptyTextContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    position: 'absolute',
  },
  accountMenu: {
    position: 'absolute',
    top: 12,
    left: 8,
    zIndex: 20
  },
  windowMenu: {
    position: 'absolute',
    top: 16,
    right: 4,
    zIndex: 20
  },
  blurViewContainer: {
    zIndex: 10,
    borderRadius: 12
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    zIndex: -1
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  }
});

export default styles;
