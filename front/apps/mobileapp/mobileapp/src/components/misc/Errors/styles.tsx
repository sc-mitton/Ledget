import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  errorTip: {
    position: 'absolute',
    top: -8,
    right: -4
  },
  formErrors: {
    marginBottom: 4,
    marginLeft: 4,
    gap: 2
  },
  formError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4
  }
});

export default styles;
