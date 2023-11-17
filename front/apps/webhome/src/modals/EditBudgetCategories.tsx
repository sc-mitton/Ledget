import React, { useState, useRef, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'
import { useTransition, useSpringRef, useSpring, animated } from '@react-spring/web'

import './styles/EditBudgetItems.scss'
import { withModal } from '@ledget/ui'
import { useGetCategoriesQuery, useReorderCategoriesMutation, useRemoveCategoriresMutation } from '@features/categorySlice'
import { GripButton } from '@components/buttons'
import { useSpringDrag, DeleteButton, useLoaded, ExpandableContainer } from '@ledget/ui'
import { SubmitForm } from '@components/pieces'

const itemHeight = 25
const itemPadding = 8

interface Item {
    id: string,
    [key: string]: any
}

const useAnimations = (items: Item[] | undefined) => {

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

    // Initial animation
    useEffect(() => {
        itemsApi.start()
    }, [items])

    return {
        itemsApi,
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

const deleteButtonHandler = (
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

const EditCategoriesModal = withModal((props) => {
    const { data: categories } = useGetCategoriesQuery()
    const { items, setItems, deletedItems, setDeletedItems, order } = useItems(categories)
    const { itemsApi, containerProps, transitions } = useAnimations(items)
    const [showSubmit, setShowSubmit] = useState(false)
    const [
        removeCategories,
        { isSuccess: categoriesAreDeleted, isLoading: submittingDeleteMutation }
    ] = useRemoveCategoriresMutation()
    const [reorderCategories] = useReorderCategoriesMutation()

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (deletedItems?.length) {
            timeout = setTimeout(() => {
                setShowSubmit(true)
            }, 500)
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [deletedItems])

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (categoriesAreDeleted) {
            timeout = setTimeout(() => {
                props.closeModal()
            }, 1000)
        }
        return () => {
            clearTimeout(timeout)
        }
    }, [categoriesAreDeleted])

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
            reorderCategories(newOrder)
        },
        style: {
            padding: itemPadding,
            size: itemHeight,
            axis: 'y',
        }
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (deletedItems?.length) {
            removeCategories(deletedItems.map((item) => item.id))
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="edit-budget-items--container">
                <h2>Edit Categories</h2>
                <animated.div style={containerProps}>
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
                                <div>
                                    {!item?.is_default &&
                                        <DeleteButton
                                            className="show"
                                            stroke={'var(--inner-window-solid)'}
                                            onClick={() => {
                                                deleteButtonHandler(item, setItems, setDeletedItems, order)
                                            }}
                                        />
                                    }
                                </div>
                            </animated.div>
                        ))}
                    </>
                </animated.div>
            </div>
            <ExpandableContainer
                expanded={showSubmit}
                style={{ marginTop: '1em' }}
            >
                <SubmitForm
                    submitting={submittingDeleteMutation}
                    success={categoriesAreDeleted}
                    onCancel={() => { props.closeModal() }}
                />
            </ExpandableContainer>
        </form>
    )
})

const EditBudgetItemsModal = () => {
    const navigate = useNavigate()

    const props = {
        maxWidth: "25em",
        onClose: () => { navigate(-1) }
    }

    return <EditCategoriesModal {...props} />
}

export default EditBudgetItemsModal
