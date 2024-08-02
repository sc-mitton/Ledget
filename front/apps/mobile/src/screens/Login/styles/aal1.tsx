import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  form: {
    justifyContent: 'center',
    flex: 1
  },
  bottomButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    flexDirection: 'row',
  },
  questionMark: {
    position: 'absolute',
    top: 4,
    left: 8,
    transform: [{ scale: 0.6 }]
  },
  forgotIconContainer: {
    position: 'relative'
  }
})

export default styles;
