import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  dragBarContainer: {
    position: 'absolute',
    left: '50%',
    top: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragBar: {
    position: 'absolute',
  },
  blurViewContainer: {
    zIndex: 10,
  },
  blurView: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  floatingAmountInput: {
    width: '100%',
  },
  mask: {
    position: 'absolute',
    width: '100%',
    left: 0,
    right: 0,
    height: 38,
    zIndex: 20,
  },
  topMask: {
    top: 0
  },
  bottomMask: {
    bottom: 0
  },
  modal: {
    flex: 1,
    flexGrow: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  nameInput: {
    marginLeft: 72,
    marginTop: 8
  },
  emojiButton: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  form: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 6,
    paddingBottom: 6,
    paddingTop: 12,
    overflow: 'hidden',
  },
  suggestionsFlatListContainer: {
    marginTop: -16
  },
  flatList: {
    maxHeight: 375,
  },
  tabsBox: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 16
  },
  suggestionsFlatListContent: {
    marginTop: 38,
    paddingBottom: 78,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  suggestionsGrid: {
    width: '100%',
    alignItems: 'center',
  },
  suggestionOption: {
    paddingVertical: 4,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
    zIndex: 20
  },
  customButton: {
    marginTop: -12
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 16,
    marginLeft: 4
  }
});

export default styles;
