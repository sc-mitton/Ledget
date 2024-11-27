import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  saveButton: {
    marginTop: 12
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
  moneyInputs: {
    flexDirection: 'row',
    gap: 12
  },
  checkBoxContainer: {
    marginLeft: 4
  },
  suggestionsFlatListContent: {
    marginTop: 19,
    paddingBottom: 54,
    paddingHorizontal: 6,
  },
  flatList: {
    maxHeight: 400,
    paddingRight: 12,
    marginRight: -12,
  },
  form: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 12,
    paddingBottom: 6,
    overflow: 'hidden',
  },
  suggestionOptionContainer: {
    width: '100%',
  },
  nameContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flexGrow: 1,
    flex: 1
  },
  name: {
    width: '100%',
  },
  suggestionOptionBox: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  suggestionOption: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  suggestionOptionContent: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between'
  },
  loadingDotsContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -12 }]
  },
  loadingDots: {
    position: 'absolute',
  },
  rightActions: {
    width: 75,
    marginLeft: -12,
    justifyContent: 'center',
    paddingRight: 16,
    alignItems: 'flex-end'
  },
  swipeable: {
    borderRadius: 12
  },
  bottomButtons: {
    flexDirection: 'row',
    width: '100%',
    paddingRight: 16,
    paddingLeft: 8,
    justifyContent: 'space-between'
  }
});

export default styles;
