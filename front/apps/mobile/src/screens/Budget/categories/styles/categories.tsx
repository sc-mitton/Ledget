import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4
  },
  progressBarContainer: {
    position: 'relative',
    marginVertical: 3,
    borderRadius: 8,
    height: 4,
    overflow: 'hidden'
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    height: '100%',
    borderRadius: 8
  },
  progressBarBack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    borderRadius: 8,
    opacity: .2
  },
  fadedText: {
    opacity: .6
  }
});

export default styles;
