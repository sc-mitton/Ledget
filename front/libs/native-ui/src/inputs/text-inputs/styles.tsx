import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  textInput: {
    fontFamily: 'SourceSans3Regular',
    fontSize: 16,
    width: '100%',
  },
  textInputLabelContainer: {
    gap: 4,
  },
  textInputContainer2: {
    width: '100%',
    borderRadius: 14,
    marginBottom: 12,
    position: 'relative',
  },
  textInputContainer1: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    position: 'relative',
  },
  passwordMask: {
    letterSpacing: 4,
    fontSize: 18,
  },
  visibilityButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
  },
});

export default styles;
