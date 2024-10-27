import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  skeletonRows: {
    justifyContent: 'space-evenly',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 16,
  },
  logoSkeleton: {
    width: 18,
    height: 18,
  },
  rightContainer: {
    flexGrow: 1,
    alignItems: 'flex-end',
    gap: 6
  },
  amountSkeleton: {
    height: 9,
    width: 54,
  },
  nameSkeleton: {
    height: 10,
    width: 72
  }
});

export default styles;
