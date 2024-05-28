import { ComponentPropsWithoutRef, useEffect, useRef, useState } from "react";

import { animated, useTransition, useSpring, useSpringRef } from '@react-spring/web';

import './styles/Options.scss'
import { useScreenContext, useSpringDrag, CloseButton } from '@ledget/ui'
import { useAccountsContext } from "../context";
import { useUpdateAccountsMutation } from "@features/accountsSlice";
import SelectOption from "./SelectOption";

type Props = ComponentPropsWithoutRef<'div'> & { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }

const optionHeight = 69
const optionPadding = 16

const Options = (props: Props) => {
    const { screenSize } = useScreenContext()
    const { open, setOpen, children, ...rest } = props;
    const [updateOrder] = useUpdateAccountsMutation()
    const { accounts, setAccounts } = useAccountsContext()
    const [localOpen, setLocalOpen] = useState(false)

    let order = useRef<string[]>([])

    // Update order on accounts change
    useEffect(() => {
        const newOrder = accounts?.map((item) => item.account_id)
        if (newOrder) {
            order.current = newOrder
        }
    }, [accounts])

    const containerStyles = useSpring({
        opacity: open ? 1 : 0,
        height: open ? 'calc(100% + 2em)' : '0%',
    })

    const optionsApi = useSpringRef()
    const optionTransitions = useTransition(accounts, {
        from: (item, index) => ({
            opacity: 0,
            zIndex: index,
            y: index * (optionHeight + optionPadding) - 25 * (index ** 2)
        }),
        enter: (item: any, index: any) => ({
            opacity: 1,
            y: index * (optionHeight + optionPadding),
        }),
        leave: (item, index) => ({
            opacity: 0,
            y: index * (optionHeight + optionPadding) - 25 * (index ** 2)
        }),
        update: (item: any, index: any) => ({ opacity: 1 }),
        config: { mass: 1, tension: 300, friction: 20 },
        ref: optionsApi
    })

    const bind = useSpringDrag({
        order: order,
        api: optionsApi,
        indexCol: 'account_id',
        onRest: (newOrder) => {
            if (order.current !== newOrder) {
                updateOrder(
                    newOrder.map((id, index) => ({
                        account: id,
                        order: index
                    }))
                )
            }
            setAccounts((prev) => prev?.sort((a, b) => newOrder.indexOf(a.account_id) - newOrder.indexOf(b.account_id)))
        },
        style: {
            padding: optionPadding,
            size: optionHeight,
            axis: 'y',
        }
    })

    useEffect(() => {
        if (!localOpen && open) {
            optionsApi.start()
            setLocalOpen(true)
        } else if (!open) {
            optionsApi.start((index: number) => ({
                opacity: 0,
                y: index * (optionHeight + optionPadding) - 25 * (index ** 2),
                onRest: () => { setLocalOpen(false) }
            }))
        }
    }, [open])

    useEffect(() => { optionsApi.start() }, [])

    return (
        <animated.div
            style={containerStyles}
            className={`select-account-options ${screenSize}`}
            {...rest}
        >
            <CloseButton onClick={() => setOpen(false)} />
            {localOpen &&
                <ul>
                    {optionTransitions((s, item) => (
                        item &&
                        <animated.li style={s} {...bind(item?.account_id)}>
                            <SelectOption account={item} />
                        </animated.li>
                    ))}
                </ul>}
        </animated.div>
    )
}

export default Options;
