import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: '100%',
    paddingTop: 48,
  },
  chartContainer: {
    flex: 1,
    marginLeft: -20,
    marginRight: -20,
    transform: [{ translateY: -12 }],
  },
  emptyTextContainer: {
    position: 'absolute',
    left: '50%',
    bottom: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    position: 'absolute',
  },
  accountMenu: {
    position: 'absolute',
    top: 12,
    left: 8
  },
  windowMenu: {
    position: 'absolute',
    top: 16,
    right: 4
  },
  blurViewContainer: {
    borderRadius: 12,
    width: '200%',
    transform: [{ translateX: -100 }],
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
