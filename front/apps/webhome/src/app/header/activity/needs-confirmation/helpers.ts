// Sizing (in ems)
const translate = 1
const expandedTranslate = 6.125;
const expandedHeight = 25
const collapsedHeight = 8
const scale = .1
const stackMax = 2

const _getContainerHeight = (length: number, expanded: boolean) => {
    if (expanded) {
        return `${Math.min(length * expandedTranslate + 1, expandedHeight)}em`
    } else if (length > stackMax) {
        return `${collapsedHeight}em`
    } else if (length > 0) {
        return `${collapsedHeight - ((stackMax - length) * translate)}em`
    } else {
        return `0em`
    }
}

const _getOpacity = (index: number, expanded: boolean) => {
    const belowStackMax = index > stackMax
    return (!expanded && belowStackMax && index !== 0) ? 0 : 1
}

const _getScale = (index: number, expanded: boolean, loaded = true,) => {

    if (!loaded) {
        return 1 - ((index + 1) * scale * 2)
    }

    if (expanded) {
        return 1
    } else {
        if (index > stackMax) {
            return 1 - (stackMax * scale)
        } else {
            return 1 - (index * scale)
        }
    }
}

const _getY = (index: number, expanded: boolean, loaded = true) => {
    if (!loaded) {
        return `${(index ** 2) * .3125 + 1.875}em`
    }

    if (index === 0 || expanded) {
        return `${index * expandedTranslate + .5}em`
    } else {
        if (index > stackMax) {
            return `${stackMax * translate + .5}em`
        } else {
            return `${index * translate + .5}em`
        }
    }
}

const _getBackGroundColor = (index: number, expanded: boolean, darkMode: boolean) => {
    let lightness: number

    if (index === 0 || expanded) {
        lightness = darkMode ? 10 : 100
    } else {
        lightness = darkMode ? 10 - (index * 1) : 100 - (index * 1.5)
    }

    return `hsl(240, 3%, ${lightness}%)`
}

export {
    _getContainerHeight,
    _getOpacity,
    _getScale,
    _getY,
    _getBackGroundColor
}
