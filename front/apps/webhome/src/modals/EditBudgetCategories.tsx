import React, { useState, useRef, useEffect } from 'react'

import { Tab } from '@headlessui/react'
import { useTransition, useSpringRef, useSpring, animated } from '@react-spring/web'

import styles from './styles/edit-budget-items.module.scss'
import {
    useGetCategoriesQuery,
    useReorderCategoriesMutation,
    useRemoveCategoriesMutation,
    Category
} from '@features/categorySlice'
import { SubmitForm } from '@components/pieces'
import {
    useSpringDrag,
    DeleteButton,
    useLoaded,
    ExpandableContainer,
    withModal,
    TabNavList,
    BillCatLabel,
    NestedWindow2,
    GripButton
} from '@ledget/ui'

const itemHeight = 28
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
        maxHeight: 283,
        immediate: !loaded
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
    period: Category['period']
) => {
    const order = useRef<string[]>([])
    const [items, setItems] = useState<Item[]>()

    // Set initial categories
    useEffect(() => {
        if (itemsData) {
            setItems(itemsData.filter((item) => item.period === period))
            order.current = [...itemsData.filter((item) => item.period === period).map((item) => item.id)]
        }
    }, [itemsData])

    return {
        items,
        setItems,
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

const Categories = ({ period, setDeletedItems }: {
    period: Category['period'],
    setDeletedItems: React.Dispatch<React.SetStateAction<Item[] | undefined>>,
}) => {

    const { data: categories } = useGetCategoriesQuery()
    const { items, setItems, order } = useItems(categories, period)
    const { itemsApi, containerProps, transitions } = useAnimations(
        items?.filter((item) => item.period === period))

    const [reorderCategories] = useReorderCategoriesMutation()

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

    return (
        <animated.div style={containerProps}>
            <>
                {transitions((style, item) => (
                    <animated.div className={styles.budgetItem} style={style} {...bind(item?.id)}>
                        <GripButton />
                        <div>
                            <BillCatLabel
                                as='div'
                                labelName={item?.name}
                                emoji={item?.emoji}
                                color={item?.period === 'month' ? 'blue' : 'green'}
                                slim={true}
                                hoverable={false}
                            />
                        </div>
                        <div>
                            {!item?.is_default &&
                                <DeleteButton
                                    visible={true}
                                    stroke={'var(--m-text)'}
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
    )
}

const EditCategoriesModal = withModal((props) => {
    const [showSubmit, setShowSubmit] = useState(false)
    const [deletedItems, setDeletedItems] = useState<Item[]>()

    useEffect(() => {
        let timeout: NodeJS.Timeout
        if (deletedItems?.length) {
            timeout = setTimeout(() => {
                setShowSubmit(true)
            }, 500)
        }
        return () => { clearTimeout(timeout) }
    }, [deletedItems])

    const [
        removeCategories,
        { isSuccess: categoriesAreDeleted, isLoading: submittingDeleteMutation }
    ] = useRemoveCategoriesMutation()

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (deletedItems?.length) {
            removeCategories(deletedItems.map((item) => item.id))
        }
    }

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

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Categories</h2>
            <Tab.Group
                as={NestedWindow2}
                data-submittable={showSubmit}
                className={styles.reorderCategories}
            >
                {({ selectedIndex }) => (
                    <>
                        <div>
                            <TabNavList selectedIndex={selectedIndex} labels={['Month', 'Year']} />
                        </div>
                        <Tab.Panels as={'div'} className={styles.editBudgetItemsContainer}>
                            <Tab.Panel as={React.Fragment}>
                                <Categories period={'month'} setDeletedItems={setDeletedItems} />
                            </Tab.Panel>
                            <Tab.Panel as={React.Fragment}>
                                <Categories period={'year'} setDeletedItems={setDeletedItems} />
                            </Tab.Panel>
                        </Tab.Panels>
                    </>
                )}
            </Tab.Group>
            <ExpandableContainer expanded={showSubmit}>
                <SubmitForm
                    submitting={submittingDeleteMutation}
                    success={categoriesAreDeleted}
                    onCancel={() => { props.closeModal() }}
                />
            </ExpandableContainer>
        </form>
    )
})

const EditBudgetCategoriesModal = ({ onClose }: { onClose: () => void }) => {
    const props = { maxWidth: "25em", onClose }
    return <EditCategoriesModal {...props} />
}

export default EditBudgetCategoriesModal
