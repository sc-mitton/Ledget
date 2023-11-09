import React, { useState, useRef, useEffect } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'
import { useTransition, useSpringRef, useSpring, animated, useChain } from '@react-spring/web'

import './styles/EditBudgetItems.scss'
import { withModal } from '@ledget/ui'
import { useGetCategoriesQuery, useUpdateCategoriesMutation, useDeleteCategoriesMutation } from '@features/categorySlice'
import { useGetBillsQuery } from '@features/billSlice'
import { GripButton } from '@components/buttons'
import { BellOff, Bell } from '@ledget/media'
import { useSpringDrag, DeleteButton, useLoaded } from '@ledget/ui'
import { SubmitForm } from '@components/pieces'

const itemHeight = 25
const itemPadding = 8

interface Item {
    id: string,
    [key: string]: any
}

const useAnimations = (
    items: Item[] | undefined,
    setItems: React.Dispatch<React.SetStateAction<Item[] | undefined>>,
    order: React.MutableRefObject<string[]>,
) => {

    const loaded = useLoaded(1000)
    const itemsApi = useSpringRef()

    const containerProps = useSpring({
        height: items?.length
            ? (items.length - .25) * (itemHeight + itemPadding)
            : 0,
        maxHeight: items?.length
            ? (items.length - .25) * (itemHeight + itemPadding)
            : 0,
        immediate: !loaded,
    })

    const transitions = useTransition(items, {
        enter: (item, index) => ({
            zIndex: 0,
            opacity: 1,
            y: index * (itemHeight + itemPadding),
            maxHeight: itemHeight * 2,
            scale: 1,
        }),
        update: (item, index) => ({
            y: index * (itemHeight + itemPadding),
            maxHeight: itemHeight * 2,
        }),
        ref: itemsApi
    })


    const bind = useSpringDrag({
        order: order,
        api: itemsApi,
        onRest: (newOrder) => {
            setItems((prev) => {
                const newItems = prev ? [...prev] : []
                newItems.sort((a, b) =>
                    newOrder.findIndex((item) => item === a.id)
                    - newOrder.findIndex((item) => item === b.id)
                )
                return newItems
            })
        },
        style: {
            padding: itemPadding,
            size: itemHeight,
            axis: 'y',
        }
    })

    // Initial animation
    useEffect(() => {
        itemsApi.start()
    }, [items])

    return {
        bind,
        containerProps,
        transitions,
    }
}

const useItems = (
    itemsData: Item[] | undefined,
) => {
    const order = useRef<string[]>([])
    const [items, setItems] = useState<Item[]>()
    const [deletedItems, setDeletedItems] = useState<Item[]>()

    // Set initial categories
    useEffect(() => {
        if (itemsData) {
            setItems(itemsData);
            order.current = [...itemsData.map((item) => item.id)]
        }
    }, [itemsData])

    return {
        items,
        setItems,
        deletedItems,
        setDeletedItems,
        order,
    }
}

const deleteHandler = (
    item: Item | undefined,
    setItems: React.Dispatch<React.SetStateAction<Item[] | undefined>>,
    setDeletedItems: React.Dispatch<React.SetStateAction<Item[] | undefined>>,
    order?: React.MutableRefObject<string[]>,
) => {
    setItems(prev => prev?.filter((prevItem) => prevItem.id !== item?.id))
    setDeletedItems(prev => prev ? [...prev, item as Item] : [item as Item])
    if (order) {
        order.current = order.current.filter((id) => id !== item?.id)
    }
}

const EditCategories = () => {
    const { data: categories } = useGetCategoriesQuery()
    const { items, setItems, deletedItems, setDeletedItems, order } = useItems(categories)
    const { bind, containerProps, transitions } = useAnimations(items, setItems, order)

    return (
        <div className="edit-budget-items--container">
            <h2>Edit Categories</h2>
            <animated.div className="inner-window" style={containerProps}>
                <>
                    {transitions((style, item) => (
                        <animated.div className="item" style={style} {...bind(item?.id)}>
                            <GripButton />
                            <div>
                                <div className={`${item?.period}`}>
                                    <span>{item?.emoji}</span>
                                    <span>{`${item?.name.charAt(0).toUpperCase()}${item?.name.slice(1)}`}</span>
                                </div>
                            </div>
                            <div className={`${item?.alerts && item.alerts.length > 0 ? 'on' : 'off'}`}>
                                {(item?.alerts && item.alerts.length < 0) &&
                                    <span>{item.alerts.length}</span>}
                                {(item?.alerts && item.alerts.length < 0)
                                    ? <Bell size={'1.5em'} />
                                    : <BellOff size={'1.5em'} />}
                            </div>
                            <div>
                                <DeleteButton
                                    className="show"
                                    stroke={'var(--inner-window-solid)'}
                                    onClick={() => {
                                        deleteHandler(item, setItems, setDeletedItems, order)
                                    }}
                                />
                            </div>
                        </animated.div>
                    ))}
                </>
            </animated.div>
        </div>
    )
}

const EditBills = () => {
    return (
        <div>
            <h2>Edit Bills</h2>
        </div>
    )
}

const EditBudgetItems = withModal((props) => {
    const location = useLocation()

    return (
        <>
            {location.pathname.includes('categories') && <EditCategories />}
            {location.pathname.includes('bills') && <EditBills />}
            <SubmitForm
                submitting={false}
                success={false}
                onCancel={() => { props.closeModal() }}
            />
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
