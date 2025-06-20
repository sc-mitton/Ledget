import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  toastItemContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  toastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    position: 'absolute',
    opacity: 0.99,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  messageContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
