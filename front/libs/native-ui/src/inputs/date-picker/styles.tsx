import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 4
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    fontFamily: 'SourceSans3Regular',
    fontSize: 16,
    width: '100%',
    flex: 1,
    flexGrow: 1,
  },
  rightTextInput: {
    paddingLeft: 32,
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
    justifyContent: 'space-between',
    position: 'relative',
    gap: 24,
    overflow: 'hidden',
  },
  bottomBorderIndicator: {
    position: 'absolute',
    bottom: -2,
    left: 0
  },
  bottomBorderIndicatorBar: {
    height: 5,
    borderRadius: 4,
  },
  middleIconContainer: {
    position: 'absolute',
    left: '50%',
    top: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  }
});

export default styles;
