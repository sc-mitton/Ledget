
export const formatName = (name) => (
    name.split(' ').map((word) => {
        name.charAt(0).toUpperCase() + name.slice(1)
        return word.charAt(0).toUpperCase() + word.slice(1)
    }).join(' ')
)

export const formatDollar = (str) =>
    `$${str}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export const formatRoundedCurrency = (val) => {
    let str = ''
    typeof val === 'string'
        ? str = val.replace(/[^0-9]/g, '')
        : str = val.toString() / 100

    return formatDollar(str)
}

export const formatCurrency = (val) => {
    if (!val) return

    let str = ''
    typeof val === 'string'
        ? str = val.replace(/[^0-9]/g, '').replace(/^0+/, '')
        : str = val.toString()

    const dollar = str.slice(0, str.length - 2) || '0'
    let cents = str.slice(str.length - 2)
    if (cents.length === 0) cents = '00'
    if (cents.length === 1) cents = `0${cents}`

    return `${formatDollar(dollar)}.${cents}`
}

export const makeIntCurrencyFromStr = (s) =>
    parseInt(s.replace(/[^0-9]/g, '').replace(/^0+/, ''))

export const getLongest = (items, key) => {
    const longestLength = items.reduce((acc, curr) => {
        if (curr[key].toString().length > acc) {
            return curr[key].toString().length
        } else {
            return acc
        }
    }, 0)
    return longestLength
}
