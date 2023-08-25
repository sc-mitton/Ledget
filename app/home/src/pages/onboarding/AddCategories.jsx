import React, { useState, useContext, useEffect } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"
import { Tab } from '@headlessui/react'
import { animated } from '@react-spring/web'

import './styles/Items.css'
import { BottomButtons, TabView } from './Reusables'
import { ItemsProvider, ItemsContext } from './context'
import { useItemsDrag } from './hooks'
import Bell from '@assets/icons/Bell'
import BellOff from '@assets/icons/BellOff'
import Grip from '@assets/icons/Grip'
import { ShadowedContainer, FormErrorTip } from '@components/pieces'
import { DeleteButton } from '@components/buttons'
import { EmojiComboText, AddAlert, EvenDollarInput, PeriodSelect } from '@components/inputs'
import { formatName, formatDollar } from '@utils'

const schema = object().shape({
    name: string().required(),
    limit: string().required(),
})

const ItemsColumn = ({ period }) => {
    const context = useContext(ItemsContext)[period]

    const {
        items,
        setItems,
        flexBasis,
        transitions,
        api,
        containerProps,
    } = context

    const bind = useItemsDrag(items, setItems, api)

    const handleDelete = (toDelete) => {
        setItems(items.filter((category) => category !== toDelete))
    }

    return (
        <ShadowedContainer style={{ height: 'auto' }}>
            <animated.div style={containerProps} >
                {transitions((style, item, index) =>
                    <animated.div
                        className="budget-item"
                        style={style}
                        {...bind(item)}
                    >
                        <div
                            className="budget-item-name--container"
                            style={{ flexBasis: flexBasis }}
                        >
                            <button
                                className="btn grip-btn"
                                aria-label="Move"
                                draggable-item="true"
                            >
                                <Grip />
                            </button>
                            <div className="budget-item-name">
                                <span>{item.emoji}</span>
                                <span>{formatName(item.name)}</span>
                            </div>
                        </div>
                        <div >
                            {`${formatDollar(item.limit_amount)}`}
                        </div >
                        <div >
                            <div style={{ opacity: item.alerts.length > 0 ? '1' : '.5' }}>
                                {item.alerts.length > 0
                                    ? <Bell numberOfAlerts={item.alerts.length} />
                                    : <BellOff />}
                            </div>
                        </div>
                        <DeleteButton onClick={() => handleDelete(item)} />
                    </animated.div>
                )}
            </animated.div>
        </ShadowedContainer>
    )
}

const CategoriesList = () => {
    const { itemsEmpty } = useContext(ItemsContext)

    return (
        <div
            id="budget-items--container"
            className={`${itemsEmpty ? '' : 'expand'}`}
        >
            <TabView>
                <Tab.Panel>
                    <ItemsColumn period={'month'} />
                </Tab.Panel>
                <Tab.Panel>
                    <ItemsColumn period={'year'} />
                </Tab.Panel>
            </TabView>
        </div>
    )
}

const Form = ({ children }) => {
    const [emoji, setEmoji] = useState('')
    const [dollarLimit, setDollarLimit] = useState('')
    const [alerts, setAlerts] = useState([])
    const [readyToSubmit, setReadyToSubmit] = useState(false)
    const { items: monthItems, setItems: setMonthItems } = useContext(ItemsContext).month
    const { items: yearItems, setItems: setYearItems } = useContext(ItemsContext).year

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm({
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
    })

    const resetForm = () => {
        setEmoji('')
        setAlerts([])
        setDollarLimit('')
        reset()
    }

    useEffect(() => {
        isValid && setReadyToSubmit(true)
    }, [isValid])

    const submit = (e) => {
        e.preventDefault()

        const formData = new FormData(e.target)
        let body = Object.fromEntries(formData)

        body.limit_amount = Number(body.limit.replace(/[^0-9]/g, '')) * 100
        delete body.limit
        body.name = body.name.toLowerCase()

        let alerts = []
        for (const [key, value] of Object.entries(body)) {
            if (key.includes('alert')) {
                alerts.push({ percent_amount: Number(value.replace(/[^0-9]/g, '')) })
                delete body[key]
            }
        }
        body.alerts = alerts

        if (body.period === 'month') {
            setMonthItems([...monthItems, body])
        } else {
            setYearItems([...yearItems, body])
        }

        resetForm()
    }

    return (
        <form onSubmit={handleSubmit((data, e) => submit(e))}>
            <div>
                <div>
                    <PeriodSelect />
                </div>
                <div>
                    <EmojiComboText
                        name="name"
                        placeholder="Name"
                        emoji={emoji}
                        setEmoji={setEmoji}
                        register={register}
                        error={[errors.name]}
                    />
                </div>
                <div>
                    <EvenDollarInput
                        name="limit"
                        dollarLimit={dollarLimit}
                        setDollarLimit={setDollarLimit}
                        register={register}
                    >
                        < FormErrorTip errors={[errors.limit]} />
                    </EvenDollarInput>
                </div>
                <div>
                    <AddAlert
                        limit={dollarLimit}
                        alerts={alerts}
                        setAlerts={setAlerts}
                    />
                </div>
            </div>
            {children(readyToSubmit)}
        </form>
    )
}

const Window = () => {
    const { itemsEmpty } = useContext(ItemsContext)

    return (
        <div className="window2">
            <h2 className="spaced-header2">Budget Categories</h2>
            {itemsEmpty &&
                <>
                    <h4 >Add your personalized categories</h4>
                    <hr className="spaced-header" />
                </>
            }
            <CategoriesList />
            <Form >
                {(readyToSubmit) => (
                    <BottomButtons expanded={readyToSubmit || !itemsEmpty} />
                )}
            </Form>
        </div>
    )
}

const AddCategories = () => {

    return (
        <ItemsProvider>
            <Window />
        </ItemsProvider>
    )
}

export default AddCategories
