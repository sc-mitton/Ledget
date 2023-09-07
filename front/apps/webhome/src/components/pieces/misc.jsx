import React from 'react'

import { formatCurrency } from '@ledget/shared-utils'

export const DollarCents = ({ value, ...props }) => {
    const str = formatCurrency(value)

    return (
        <div style={{ textAlign: 'end' }}>
            <span>
                {`${str.split('.')[0]}`}
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
