import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  boxContainer: {
    position: 'absolute',
    left: -16,
    right: -16,
    bottom: 0,
  },
  mainBackgroundBox: {
    paddingHorizontal: 0,
  },
  box: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginHorizontal: 16,
    height: '100%',
    position: 'relative',
  },
  backgroundSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '100%',
    width: '100%',
    zIndex: -1,
  },
  dragBar: {
    width: 40,
    height: 5,
    position: 'absolute',
    top: 8,
    left: '50%',
    transform: [{ translateX: -18 }, { translateY: -1.5 }],
  },
  dragBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 24,
  },
  transactionsScrollView: {
    paddingRight: 20,
    paddingLeft: 60,
    paddingTop: 4,
  },
  sectionHeader: {
    marginLeft: -48,
    justifyContent: 'center',
    left: 0,
    right: 0,
    position: 'relative',
    zIndex: -1,
  },
  loadingIndicatorContainer: {
    position: 'absolute',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    position: 'absolute',
  },
});
