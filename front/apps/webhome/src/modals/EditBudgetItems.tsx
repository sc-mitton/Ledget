import { useState, useRef, useEffect } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { useTransition, useSpringRef, animated } from '@react-spring/web'

import './styles/EditBudgetItems.scss'
import { withModal } from '@ledget/ui'
import { useGetCategoriesQuery, Category } from '@features/categorySlice'
import { useGetBillsQuery, Bill } from '@features/billSlice'
import { GripButton } from '@components/buttons'
import { useSpringDrag, DeleteButton } from '@ledget/ui'

const itemHeight = 25
const itemPadding = 12

const EditBills = () => {
    return (
        <div>
            <h2>Edit Bills</h2>
        </div>
    )
}

const EditCategories = () => {
    const { data: categories, isSuccess } = useGetCategoriesQuery()
    const [items, setItems] = useState<Category[]>([])
    let order = useRef<string[]>([])

    useEffect(() => {
        if (isSuccess && categories) {
            setItems(categories)
            order.current = categories.map((item) => item.id)
        }
    }, [isSuccess, categories])

    const api = useSpringRef()
    const bind = useSpringDrag({
        order: order,
        api: api,
        onRest: (newOrder) => {
            setItems((items) => items?.sort((a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id)))
        },
        style: {
            padding: itemPadding,
            size: itemHeight,
            axis: 'y',
        }
    })

    const transitions = useTransition(items, {
        from: () => ({ opacity: 1, zIndex: 0, scale: 1 }),
        enter: (item, index) => ({ opacity: 1, y: index * (itemHeight + itemPadding) }),
        update: (item, index) => ({ y: index * (itemHeight + itemPadding) }),
        leave: () => ({ opacity: 0 }),
        config: { duration: 100 },
        ref: api
    })

    return (
        <div className="edit-budget-items--container">
            <h2>Edit Categories</h2>
            <div
                className="inner-window"
                style={{
                    height: items?.length
                        ? (items.length - .25) * (itemHeight + itemPadding)
                        : 0,
                    maxHeight: items?.length
                        ? (items.length - .25) * (itemHeight + itemPadding)
                        : 0
                }}
            >
                <>
                    {transitions((style, item) => (
                        <animated.div
                            className="item"
                            style={style}
                            {...bind(item?.id)}
                        >
                            <GripButton />
                            <div>
                                <div className={`${item?.period}`}>
                                    <span>{item?.emoji}</span>
                                    <span>{`${item?.name.charAt(0).toUpperCase()}${item?.name.slice(1)}`}</span>
                                </div>
                            </div>
                            <div>
                                <DeleteButton className="show" stroke={'var(--inner-window-solid)'} />
                            </div>
                        </animated.div>
                    ))}
                </>
            </div>
        </div>
    )
}

const EditBudgetItems = withModal((props) => {
    const location = useLocation()

    return (
        <>
            {location.pathname.includes('categories') && <EditCategories />}
            {location.pathname.includes('bills') && <EditBills />}
        </>
    )
})

export default function () {
    const navigate = useNavigate()

    return (
        <EditBudgetItems
            maxWidth="25em"
            onClose={() => { navigate(-1) }}
        />
    )
}
