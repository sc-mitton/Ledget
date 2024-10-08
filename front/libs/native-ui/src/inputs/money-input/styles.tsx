import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  textInput: {
    fontFamily: 'SourceSans3Regular',
    fontSize: 16,
    width: '100%',
    flex: 1,
  },
  dash: {
    marginRight: 16,
    marginLeft: 4,
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
  }
});

export default styles;
