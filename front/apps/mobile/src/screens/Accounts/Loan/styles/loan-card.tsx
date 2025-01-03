import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  box: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    marginVertical: 8,
  },
  seperator: {
    width: '200%',
    transform: [{ translateX: -200 }],
  },
  middleRow: {
    paddingVertical: 16,
    gap: 16,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  skeletonMiddleRow: {
    paddingBottom: 0,
    marginBottom: -16,
  },
  middleRowCell: {
    flex: 1,
    alignItems: 'center',
  },
  overdueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  progressBars: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 28,
    paddingHorizontal: 22,
    paddingBottom: 6,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 8,
  },
  dates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  noData: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});

export default styles;
