import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backPanel: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  fontStyle: {
    fontFamily: 'SourceSans3Regular',
    fontSize: 18,
  },
  headerContainer: {
    zIndex: 10,
  },
  header: {
    flex: 1,
  },
  spentOf: {
    marginTop: 2,
    marginHorizontal: 6,
    fontSize: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    paddingTop: 6,
  },
  progressBarContainer: {
    position: 'relative',
    marginVertical: 8,
    borderRadius: 8,
    height: 5,
    overflow: 'hidden',
  },
  progressBar: {
    position: 'absolute',
    left: 0,
    height: '100%',
    width: '100%',
    borderRadius: 8,
    opacity: 0.9,
  },
  progressBarBack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '100%',
    borderRadius: 8,
    opacity: 0.2,
  },
  fadedText: {
    opacity: 0.6,
  },
});

export default styles;
