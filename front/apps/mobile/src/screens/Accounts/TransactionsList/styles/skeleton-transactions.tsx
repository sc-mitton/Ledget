import { StyleSheet } from "react-native";

export default StyleSheet.create({
  skeletonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginVertical: 12,
  },
  lc: {
    flex: 2,
    gap: 12,
  },
  // Left column top row
  lctr: {
    width: '70%',
    height: 12,
    borderRadius: 4
  },
  // Left column bottom row
  lcbr: {
    width: '33%',
    height: 12,
    borderRadius: 4
  },
  // Right column top row
  rctr: {
    width: '33%',
    height: 12,
    borderRadius: 4,
  },
  rc: {
    flex: 1,
    alignItems: 'flex-end'
  }
});
