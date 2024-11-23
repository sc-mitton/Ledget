import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  progressContainer: {
    position: 'absolute',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
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
