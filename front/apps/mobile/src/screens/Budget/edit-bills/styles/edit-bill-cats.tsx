import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  nestedContainer: {
    width: '100%',
    maxHeight: '70%',
    marginVertical: 8,
    minHeight: 300,
  },
  panel: {
    width: '100%',
  },
  tabsTrack: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  tabsTrackContent: {
    maxWidth: '80%',
    marginBottom: 12,
  },
});

export default styles;
