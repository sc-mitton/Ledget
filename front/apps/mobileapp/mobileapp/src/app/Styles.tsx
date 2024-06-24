import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    main: {
        flex: 1,
        position: 'relative',
        zIndex: 0,
        paddingTop: 80,
        paddingLeft: 24,
        paddingRight: 24,
    },
    navBlurView: {
        position: 'absolute',
        zIndex: 100,
        bottom: 0,
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 24,
        paddingBottom: 40,
        left: 0,
        right: 0,
    },
    navBack: {
        position: 'absolute',
        opacity: .5,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    nav: {
        position: 'relative',
        zIndex: 101,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});
