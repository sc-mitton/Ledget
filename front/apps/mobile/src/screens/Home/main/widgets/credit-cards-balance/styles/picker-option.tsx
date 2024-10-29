import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  skeletonRows: {
    justifyContent: 'space-evenly',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 8,
  },
  logoSkeleton: {
    width: 18,
    height: 18,
  },
  rightContainer: {
    flexGrow: 1,
    alignItems: 'flex-start',
    gap: 6
  },
  amountSkeleton: {
    height: 9,
    width: 36,
  },
  nameSkeleton: {
    height: 10,
    width: 72
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default styles;
