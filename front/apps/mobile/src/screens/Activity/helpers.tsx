// Sizing (in ems)
const translate = 16
const height = 80;
const expandedGap = 16
const scale = .1
const stackMax = 2

const _getOpacity = (index: number, expanded: boolean) => {
  if (expanded) {
    return 1
  } else {
    return index > stackMax ? 0 : 1
  }
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
    return (index ** 2) * 5 + 30
  }

  if (index === 0 || expanded) {
    return expandedGap * index
  } else {
    if (index > stackMax) {
      return -1 * expandedGap * stackMax
    } else {
      return -1 * (height - expandedGap) * index
    }
  }
}

export {
  _getOpacity,
  _getScale,
  _getY
}
