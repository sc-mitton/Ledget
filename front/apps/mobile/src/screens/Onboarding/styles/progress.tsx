import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
  },
  headerBox: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    bottom: 0
  },
  progressContainer: {
    paddingTop: 16,
    paddingBottom: 12,
    width: '100%',
    justifyContent: 'center',
    gap: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  pillFill: {
    width: '100%',
    height: '100%',
  }
});

export default styles;
