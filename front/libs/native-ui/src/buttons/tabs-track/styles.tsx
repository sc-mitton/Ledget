import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  centeredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsTrackBoxContainer: {
    width: '100%',
  },
  tabsTrackBox: {
    padding: 4,
    borderRadius: 12,
  },
  tabsTrack: {
    width: '100%',
  },
  tab: {
    marginHorizontal: 16,
    paddingVertical: 2,
    flex: 1,
  },
  indicatorContainer: {
    height: '100%',
    position: 'absolute',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: -1,
  },
  indicator: {
    height: '100%',
    width: '100%',
  },
});

export default styles;
