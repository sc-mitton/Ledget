import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  topContainer: {
    marginTop: 24,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  totalBalanceContainer: {
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 20
  },
  totalBalance: {
  },
  totalBalanceText: {
    marginTop: -4
  },
  skeletonCard: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 2,
    marginBottom: 12
  },
  carousel: {
    flexDirection: 'row',
    marginTop: 8,
  },
  pageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 7,
    transform: [{ translateY: -10 }]
  },
  dotContainer: {
    width: 5,
    height: 5,
    borderRadius: 5,
    overflow: 'hidden'
  },
  dot: {
    width: '100%',
    height: '100%',
  },
  accountName: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingLeft: 24,
    paddingBottom: 8,
  }
});

export default styles;
