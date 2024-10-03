import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  fontStyle: {
    fontFamily: 'SourceSans3Regular',
    fontSize: 16
  },
  header: {
    flex: 1
  },
  spentOf: {
    marginLeft: -3,
    marginRight: 6
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4
  },
  progressBarContainer: {
    position: 'relative',
    marginVertical: 8,
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
