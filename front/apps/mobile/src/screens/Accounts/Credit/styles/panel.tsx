import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  main: {
    flex: 1
  },
  topContainer: {
    marginTop: 36,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 2,
  },
  totalBalanceContainer: {
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
  carouselContainer: {
    flexDirection: 'row',
    marginVertical: 8
  },
  carousel: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  pageDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    gap: 7,
    transform: [{ translateY: -20 }]
  },
  pageDotsBack: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
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
