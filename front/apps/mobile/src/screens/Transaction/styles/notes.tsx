import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  notesBoxContainer: {
    flex: 1,
  },
  fullWidthView: {
    width: '100%',
    flex: 1,
  },
  noteRow: {
    flexDirection: 'row',
    gap: 20,
    paddingVertical: 4,
    marginLeft: 6,
    position: 'relative',
  },
  noteSeperator: {
    width: '300%',
    position: 'absolute',
    top: -12,
  },
  notesBox: {
    position: 'relative',
  },
  notesContainer: {
    flex: 1,
  },
  textInput: {
    fontFamily: 'SourceSans3Regular',
    fontSize: 16,
    width: '100%',
    height: '100%',
  },
  focusedNoteContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 200,
    top: '50%',
    transform: [{ translateY: -150 }],
    justifyContent: 'flex-start',
  },
  focusedNote: {
    width: '100%',
    height: '100%',
  },
  editedFootnote: {
    position: 'absolute',
    left: 12,
    bottom: 6,
  },
  confirmIconButton: {
    position: 'absolute',
    right: 5,
    bottom: 0,
  },
  addNoteButton: {
    paddingVertical: 4,
    marginLeft: 2,
    marginBottom: 8,
  },
  trashIcon: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
    flexDirection: 'row',
    zIndex: -1,
    right: 12,
    top: '50%',
  },
  modalOverlay: {
    position: 'absolute',
    width: '100%',
    height: '300%',
  },
});

export default styles;
