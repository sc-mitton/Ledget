
export const formatName = (name) => (
    name.split(' ').map((word) => {
        name.charAt(0).toUpperCase() + name.slice(1)
        return word.charAt(0).toUpperCase() + word.slice(1)
    }).join(' ')
)

// Takes in the dollar value for a currency and returns a formatted string
// ex: 1000 -> $1,000, 25000000 -> $25,000,000
export const formatDollar = (str) =>
    `$${str}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

// Takes in a string currency and returns a formatted string
// ex: 100000 -> $1,000, 25000 -> $250
export const formatRoundedCurrency = (val) => {
    let str = ''
    typeof val === 'string'
        ? str = val.replace(/[^0-9]/g, '')
        : str = val.toString() / 100

    return formatDollar(str)
}

// Takes in a string currency and returns a formatted string
// ex: 100000 -> $1,000.00, 25000 -> $250.00
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

// Takes in a string currency and returns an integer
// by removing all non-numeric characters and leading zeros
// ex: $1,000.00 -> 100000, $250 -> 25000
export const makeIntCurrencyFromStr = (s) => {
    let newVal
    newVal = parseInt(s.replace(/[^0-9]/g, '').replace(/^0+/, ''))
    return s.includes('.') ? newVal : newVal * 100
}

// For list of objects, returns the length of the longest string
// for the given key
export const getLongestLength = (items, key) => {
    const longestLength = items.reduce((acc, curr) => {
        if (curr[key] && curr[key].toString().length > acc) {
            return curr[key].toString().length
        } else {
            return acc
        }
    }, 0)
    return longestLength
}
