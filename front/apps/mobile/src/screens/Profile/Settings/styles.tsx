import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  radios: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 16,
    gap: 20,
    paddingTop: 16,
    paddingBottom: 48
  },
  phoneImageContainer: {
    paddingHorizontal: 8,
  },
  option: {
    gap: 8,
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 12,
  },
  optionBorder: {
    borderRadius: 12,
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
  optionTextContainer: {
    position: 'absolute',
    bottom: -20,
    left: '50%',
    width: 2,
    height: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: 100,
    position: 'absolute',
  },
  check: {
    position: 'absolute',
    top: 1,
    right: 1,
    opacity: .7
  }
});

export default styles;
