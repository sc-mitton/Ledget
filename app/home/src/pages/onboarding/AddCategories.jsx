import React, { useState, useContext } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from "react-hook-form"
import { object, string } from "yup"

import './styles/Items.css'

import { FormErrorTip } from '@components/pieces'
import { EmojiComboText, AddAlert, EvenDollarInput, PeriodSelect } from '@components/inputs'
import { ItemsProvider, ItemsContext } from './context'
import { BottomButtons, ItemsList } from './Reusables'

const schema = object().shape({
    name: string().required(),
    limit: string().required(),
})

const Form = ({ children }) => {
    const [emoji, setEmoji] = useState('')
    const [dollarLimit, setDollarLimit] = useState('')
    const [alerts, setAlerts] = useState([])
    const { monthItems, setMonthItems, yearItems, setYearItems } = useContext(ItemsContext)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
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
            {children}
        </form>
    )
}

const AddCategories = () => {
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
            <ItemsList />
            <Form >
                <BottomButtons />
            </Form>
        </div>
    )
}

const Enriched = () => {

    return (
        <ItemsProvider>
            <AddCategories />
        </ItemsProvider>
    )
}

export default Enriched
