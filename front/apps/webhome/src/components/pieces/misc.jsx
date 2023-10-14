import { formatCurrency } from '@ledget/utils'

export const DollarCents = ({ value, isDebit, style, ...rest }) => {
    const str = formatCurrency(value)

    return (
        <div
            style={{ textAlign: 'end', ...style }}
            {...rest}
        >
            <span style={{ fontSize: 'inherit' }}>
                {`${isDebit ? '+' : ''}${str.split('.')[0]}`}
            </span>
            <span style={{ fontSize: '.7em' }}>
                {`.${str.split('.')[1]}`}
            </span>
        </div>
    )
}

export const DollarCentsRange = ({ lower, upper }) => {

    return (
        <>
            {lower && <DollarCents value={lower} />}
            {lower && <span>&nbsp;&nbsp;&ndash;&nbsp;&nbsp;</span>}
            <DollarCents value={upper} />
        </>
    )
}
