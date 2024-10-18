import { StyleSheet } from "react-native";

export default StyleSheet.create({
  headerContainer: {
    marginBottom: 0,
    marginTop: 12
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginRight: 4,
    marginBottom: 12
  },
  countCountainer: {
    position: 'relative',
    marginRight: 12,
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
    opacity: 0.2
  }
});
