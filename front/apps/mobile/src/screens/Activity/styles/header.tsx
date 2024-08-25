import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerContainer: {
    marginBottom: 12,
    marginTop: 18
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16
  },
  countCountainer: {
    position: 'relative',
    marginRight: 16,
  },
  countBackgroundOuterContainer: {
    position: 'relative'
  },
  countBackgroundContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    left: '50%',
    top: '50%',
  },
  countBackground: {
    borderRadius: 100,
    height: 24,
    width: 24,
    position: 'absolute',
    opacity: 0.3
  }
});
