
export const formatName = (name: string) => (
    name.split(' ').map((word) => {
        name.charAt(0).toUpperCase() + name.slice(1)
        return word.charAt(0).toUpperCase() + word.slice(1)
    }).join(' ')
)


export const formatCurrency2String = ({ val, withDecimals = true }: { val: number | string | undefined, withDecimals: boolean }) => {
    if (val === undefined || val === null) return ''

    // First get val in integer form
    let value: string
    typeof val === 'string'
        ? val.includes('.') ? value = val : value = `${val}00`
        : value = val.toString()

    const currencyAmount = parseInt(value.replace(/[^0-9]/g, '').replace(/^0+/, ''))

    const regex = /(\d)(?=(\d{3})+(?!\d))/g
    if (withDecimals) {
        return `$${currencyAmount}`.replace(regex, ",")
    } else {
        return `$${currencyAmount / 100}`.replace(regex, ",")
    }
}

// Takes in the dollar value for a currency and returns a formatted string
// ex: 1000 -> $1,000, 25000000 -> $25,000,000
export const formatDollar = (str: string) =>
    `$${str}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")

// Takes in a string currency and returns a formatted string
// ex: 100000 -> $1,000, 25000 -> $250
export const formatRoundedCurrency = (val: number | string) => {
    let str = ''
    typeof val === 'string'
        ? str = val.replace(/[^0-9]/g, '')
        : str = (val / 100).toString()

    return formatDollar(str)
}

// Takes in a string or int currency and returns a formatted string
// ex: 100000 -> $1,000.00, 25000 -> $250.00
export const formatCurrency = (val: number | string | undefined) => {
    if (val === undefined || val === null) return ''

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
export const makeIntCurrencyFromStr = (s: string) => {
    if (s === '$0') { return 0 }
    let newVal
    newVal = parseInt(s.replace(/[^0-9]/g, '').replace(/^0+/, ''))
    return s.includes('.') ? newVal : newVal * 100
}

type Reducable = { reduce: (acc: any, curr: any) => any, [index: number]: any }
type Lengthy = { length: number, [index: string | number]: any }

// For list of objects, returns the length of the longest string
// for the given key
export const getLongestLength = (items: Reducable, key: string) => {
    const longestLength = items.reduce((acc: Lengthy, curr: Lengthy) => {
        if (curr[key] && curr[key].toString().length > acc) {
            return curr[key].toString().length + 5
        } else {
            return acc
        }
    }, 0)
    return longestLength
}

export function shuffleArray(array: any[]) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export const formatDateOrRelativeDate = (unixTimestamp: number) => {
    const currentDate = new Date();
    const inputDate = new Date(unixTimestamp); // Convert Unix timestamp to milliseconds

    const timeDiffInDays = Math.floor((currentDate.getTime() - inputDate.getTime()) / (1000 * 60 * 60 * 24));

    if (timeDiffInDays === 1) {
        return "yesterday";
    } else if (timeDiffInDays === 0) {
        return "today";
    } else if (timeDiffInDays === 2) {
        return "2 days ago";
    } else if (timeDiffInDays === 3) {
        return "3 days ago";
    } else {
        return inputDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
    }
}

export const addDaySuffix = (day: string) => {
    // strip leading zeros
    day = day.replace(/^0+/, '')

    switch (day) {
        case '1':
        case '21':
        case '31':
            return `${day}st`
        case '2':
        case '22':
            return `${day}nd`
        case '3':
        case '23':
            return `${day}rd`
        default:
            return `${day}th`
    }
}

export const clamp = (num: number, min: number, max: number) => {
    return Math.min(Math.max(num, min), max)
}

export const getDaySuffix = (day: number) => {
    if (day > 10 && day < 20) return 'th'
    switch (day % 10) {
        case 1:
            return 'st'
        case 2:
            return 'nd'
        case 3:
            return 'rd'
        default:
            return 'th'
    }
}

export const mapWeekDayNumberToName = (day: number) => {
    switch (day) {
        case 0:
            return 'Sunday'
        case 1:
            return 'Monday'
        case 2:
            return 'Tuesday'
        case 3:
            return 'Wednesday'
        case 4:
            return 'Thursday'
        case 5:
            return 'Friday'
        case 6:
            return 'Saturday'
    }
}
