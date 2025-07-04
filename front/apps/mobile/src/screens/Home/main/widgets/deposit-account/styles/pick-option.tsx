import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-evenly',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 8,
    flex: 1,
  },
  logoSkeleton: {
    width: 18,
    height: 18,
  },
  rightContainer: {
    flexGrow: 1,
    alignItems: 'flex-start',
    gap: 6,
  },
  amountSkeleton: {
    height: 9,
    width: 36,
  },
  nameSkeleton: {
    height: 10,
    width: 72,
  },
  chartContainer: {
    flexGrow: 2,
    marginHorizontal: -14,
  },
});

export default styles;
