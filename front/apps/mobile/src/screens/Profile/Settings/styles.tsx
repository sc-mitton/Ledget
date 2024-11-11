import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  radios: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    marginTop: 16,
    paddingTop: 16,
    paddingBottom: 48
  },
  option: {
    gap: 8,
    alignItems: 'center',
    position: 'relative',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  optionBorder: {
    borderRadius: 16,
  },
  optionBorderMain: {
    borderWidth: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  optionBorderSecondary: {
    borderWidth: 1.5,
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
  },
  optionText: {
    position: 'absolute',
    bottom: -32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  check: {
    position: 'absolute',
    top: 1,
    right: 1,
    opacity: .7
  }
});

export default styles;
