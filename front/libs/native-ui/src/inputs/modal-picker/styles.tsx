import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  header: {
    marginBottom: 4,
    marginLeft: 4,
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
    height: 100,
    gap: 6,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchInput: {
    width: '100%',
    position: 'relative',
    paddingLeft: 24,
  },
  searchIconContainer: {
    position: 'absolute',
    left: 0,
    top: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  searchIcon: {
    position: 'absolute',
    transform: [{ translateY: 12 }, { translateX: 20 }],
  },
  option: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectedIcon: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 8,
  },
  emptyScrollView: {
    height: 250,
    maxHeight: '80%',
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    paddingHorizontal: 6,
  },
  chevronIconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    top: '50%',
  },
  chevronIcon: {
    position: 'absolute',
  },
  modalOverlayContainer: {
    zIndex: 1000,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  modalOverlay: {
    opacity: 0.7,
    zIndex: 1000,
  },
  clearButton: {
    marginTop: 8,
    marginBottom: -8,
    width: '100%',
    flexDirection: 'row',
  },
});
