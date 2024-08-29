import { StyleSheet } from "react-native";

export default StyleSheet.create({
  selectedBillCats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    flexGrow: 1,
    width: '100%',
  },
  leftIcon: {
    width: '100%',
  },
  downIconWrapper: {
    position: 'absolute',
    right: 16,
    top: '12.5%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  downIcon: {
    position: 'absolute',
    top: '100%',
    left: '50%'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 16,
    marginVertical: 2
  },
  selectedOption: {
    marginVertical: 1,
  }
});
