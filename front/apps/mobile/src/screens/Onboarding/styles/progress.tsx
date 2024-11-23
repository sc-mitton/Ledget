import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    gap: 12,
    paddingHorizontal: 16,
    alignItems: 'flex-start'
  },
  progressContainer: {
    width: '100%',
    justifyContent: 'center',
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    height: 6,
    borderRadius: 24
  },
  pillFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 24
  },
  pillFillBack: {
    width: '100%',
  }
});

export default styles;
