import React, { FC, useState, useEffect } from 'react'

import { animated } from '@react-spring/web'
import dayjs from 'dayjs'
import { Check } from '@geist-ui/icons'

import styles from './styles/new-item.module.scss'
import { Ellipsis } from "@ledget/media"
import { InsitutionLogo } from '@components/pieces'
import {
    NarrowButton,
    IconButtonHalfGray,
    Tooltip,
    DollarCents,
    BillCatLabel,
    formatDateOrRelativeDate
} from "@ledget/ui"
import { SplitCategory } from '@features/categorySlice'
import { Bill, isBill } from '@features/billSlice'
import type { Transaction } from '@features/transactionsSlice'

const NewItem: FC<{
    item: Transaction
    style: React.CSSProperties
    onEllipsis: (e: any, item: Transaction) => void
    onBillCat: (e: any, item: Transaction) => void
    handleConfirm: (transaction: Transaction) => void
    updatedBillCat?: SplitCategory[] | Bill
    tabIndex: number
}> = (props) => {
    const { item, style, updatedBillCat, onEllipsis, onBillCat, handleConfirm, tabIndex } = props
    const [name, setName] = useState<string>(
        item.predicted_category
            ? `${item.predicted_category?.name.charAt(0).toUpperCase()}${item.predicted_category?.name.slice(1)}`
            : ''
    )
    const [color, setColor] = useState<'blue' | 'green' | 'green-split' | 'blue-split' | 'green-blue-split'>(
        item.predicted_category?.period === 'month' ? 'blue' : 'green'
    )

    useEffect(() => {
        if (isBill(updatedBillCat)) {
            updatedBillCat.period === 'month' ? setColor('blue') : setColor('green')
            updatedBillCat
                ? setName(updatedBillCat.name.charAt(0).toUpperCase() + updatedBillCat.name.slice(1))
                : setName(`${item.predicted_category?.name.charAt(0).toUpperCase()}${item.predicted_category?.name.slice(1)}`)
        } else if (typeof updatedBillCat !== 'undefined') {
            // If all the categories are the 'month' period, then color can be set
            if (updatedBillCat.every(cat => cat.period === 'month')) {
                setColor('blue-split')
            } else if (updatedBillCat.every(cat => ['once', 'year'].includes(cat.period))) {
                setColor('green-split')
            } else {
                setColor('green-blue-split')
            }

            setName(`${updatedBillCat[0].name.charAt(0).toUpperCase()}${updatedBillCat[0].name.slice(1)}`)
        }
    }, [updatedBillCat])

    return (
        <animated.div
            key={`item-${item.transaction_id}`}
            className={styles.newItem}
            style={style}
        >
            <div className={styles.newItemData}>
                <div>
                    <InsitutionLogo accountId={item.account} />
                </div>
                <div>
                    <div>
                        <span>{item.name}</span>
                    </div>
                    <div className={item.amount! < 0 ? styles.greenText : ''}>
                        <DollarCents value={item.amount!} />
                        <span>{formatDateOrRelativeDate(dayjs(item.datetime! || item.date).valueOf())}</span>
                    </div>
                </div>
            </div>
            <div className={styles.newItemIcons}>
                <BillCatLabel
                    labelName={name}
                    slim={true}
                    as='button'
                    color={color}
                    aria-label="Choose budget category"
                    tabIndex={tabIndex}
                    onClick={(e) => { onBillCat(e, item) }}
                    aria-controls={'select-new-item-bill-category'}
                />
                <Tooltip
                    msg="Confirm"
                    ariaLabel="Confirm"
                >
                    <IconButtonHalfGray
                        onClick={() => { handleConfirm(item) }}
                        aria-label="Confirm"
                        tabIndex={tabIndex}
                        className={styles.confirmButton}
                    >
                        <Check className="icon" strokeWidth={2} />
                    </IconButtonHalfGray>
                </Tooltip>
                <NarrowButton
                    tabIndex={tabIndex}
                    onClick={(e) => { onEllipsis(e, item) }}
                    aria-label="More options"
                    aria-haspopup="menu"
                    aria-controls={'new-item-menu'}
                >
                    <Ellipsis />
                </NarrowButton>
            </div>
        </animated.div>
    )
}

export default NewItem
