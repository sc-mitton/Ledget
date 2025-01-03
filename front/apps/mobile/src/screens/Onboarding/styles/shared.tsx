import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSplitButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  emptyMessage: {
    marginVertical: 24,
  },
  header: {
    width: '100%',
    marginTop: 48,
    marginBottom: 8,
    marginLeft: 8,
  },
  modal: {
    flex: 1,
    flexGrow: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
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
  emojiButton: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  nameInput: {
    marginLeft: 72,
    marginTop: 8,
  },
  suggestionsFlatListContent: {
    marginTop: 19,
    paddingBottom: 72,
    paddingTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
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
    top: 0,
  },
  bottomMask: {
    bottom: 0,
  },
});

export default styles;
