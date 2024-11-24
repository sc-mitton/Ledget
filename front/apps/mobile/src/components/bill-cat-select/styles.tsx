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
  },
  linkGraphic: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  ledgetLogo: {
    borderRadius: 36,
    overflow: 'hidden',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 36
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 16,
  },
  logos: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    flexGrow: 100,
    justifyContent: 'flex-start',
  },
  addAccountButtonContainer: {
    alignItems: 'center',
    flexGrow: 1
  },
  logo: {
    marginLeft: -12,
  }
});
