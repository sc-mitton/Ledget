import { StyleSheet } from "react-native";

export default StyleSheet.create({
  header: {
    marginVertical: 8,
    marginLeft: 4
  },
  modalWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 1000,
  },
  placeholderButton: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  defaultSelectedItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    gap: 6,
  },
  searchContainer: {
    marginTop: 8
  },
  searchInput: {
    width: '100%',
    position: 'relative',
    paddingLeft: 24,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 20,
    top: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  searchIcon: {
    position: 'absolute',
    top: -10
  },
  option: {
    paddingVertical: 10,
  },
  scrollView: {
    height: 250,
    maxHeight: '80%',
    paddingHorizontal: 12,
  },
  chevronIconContainer: {
    position: 'absolute',
    right: -2,
    top: 2,
  },
});
