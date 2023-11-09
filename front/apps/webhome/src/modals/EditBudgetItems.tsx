import { useState, useRef, useEffect } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { useTransition, useSpringRef, animated } from '@react-spring/web'

import './styles/EditBudgetItems.scss'
import { withModal } from '@ledget/ui'
import { useGetCategoriesQuery, Category } from '@features/categorySlice'
import { useGetBillsQuery, Bill } from '@features/billSlice'
import { GripButton } from '@components/buttons'
import { useSpringDrag } from '@ledget/ui'

const itemHeight = 25
const itemPadding = 8

const EditBills = () => {
    return (
        <div>
            <h2>Edit Bills</h2>
        </div>
    )
}

const EditCategories = () => {
    const { data: categories, isSuccess } = useGetCategoriesQuery()
    const [items, setItems] = useState<Category[]>()
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
        from: { opacity: 0, height: 0 },
        enter: { opacity: 1, height: itemHeight },
        leave: { opacity: 0, height: 0 },
        update: { height: itemHeight },
    })

    return (
        <div className="edit-budget-items--container">
            <h2>Edit Categories</h2>
            <div className="inner-window">
                <>
                    {transitions((style, item) => (
                        <animated.div style={style} {...bind(item?.id)} >
                            <GripButton />
                            <div>
                                <div className={`${item?.period}`}>
                                    <span>{item?.emoji}</span>
                                    <span>{`${item?.name.charAt(0).toUpperCase()}${item?.name.slice(1)}`}</span>
                                </div>
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
