import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabs: {
    maxWidth: '70%',
  },
  form: {
    flexDirection: 'column',
    width: '100%',
    marginTop: 16,
    overflow: 'hidden',
  },
  formContent: {
    width: '100%',
  },
  textInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    gap: 8,
  },
  nameInputContainer: {
    flex: 1.2,
    flexGrow: 1.2
  },
  nameInput: {
    marginLeft: 30
  },
  moneyInput: {
    flex: 1,
    flexGrow: 1
  },
  emojiButtonContainer: {
    position: 'absolute',
    zIndex: 1,
    left: 28,
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiButton: {
    top: -4,
    position: 'absolute',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 16,
  },
  amount: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  scrollView: {
    maxHeight: 225
  },
  scrollContent: {
    paddingVertical: 12,
  },
  tabsBox: {
    width: '110%',
    alignItems: 'center',
    paddingBottom: 16,
  }
});

export default styles;
