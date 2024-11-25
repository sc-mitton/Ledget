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
  modal: {
    flex: 1,
    flexGrow: 1,
    overflow: 'hidden',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10
  },
  tabs: {
    maxWidth: '60%',
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
    overflow: 'hidden',
  },
  bottomFormButtons: {
    flexDirection: 'row',
    width: '101%',
    marginTop: 8,
    transform: [{ translateX: -4 }],
    justifyContent: 'space-between'
  },
  table: {
    width: '100%',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    paddingLeft: 8,
    paddingTop: 16,
    paddingBottom: 10,
    transform: [{ translateY: -4 }],
    gap: 16,
  },
  amount: {
    flexGrow: 1,
    paddingRight: 4,
    alignItems: 'flex-end',
  },
  editAmount: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  scrollView: {
    maxHeight: 290,
  },
  tabsBox: {
    width: '110%',
    alignItems: 'center',
    paddingBottom: 16,
  },
  suggestionsScrollView: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionsGrid: {
    width: '100%',
  },
  sectionHeader: {
    width: '100%',
  },
  suggestionOption: {
    marginVertical: 4
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    marginTop: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 16,
    marginLeft: 4
  }
});

export default styles;
