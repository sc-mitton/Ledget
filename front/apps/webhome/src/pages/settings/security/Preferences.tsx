import { useState, useEffect } from 'react'

import { BakedSwitch, NestedWindow, useIsMount } from '@ledget/ui'
import { useGetMeQuery, useUpdateUserSettingsMutation } from '@features/userSlice'

const Preferences = () => {
    const isMount = useIsMount()
    const { data: me } = useGetMeQuery()
    const [logoutAutomatically, setLogoutAutomatically] = useState(me?.settings.automatic_logout ?? false)
    const [updateUserSettings] = useUpdateUserSettingsMutation()

    useEffect(() => {
        if (isMount) return
        updateUserSettings({ automatic_logout: logoutAutomatically })
    }, [logoutAutomatically])

    return (
        <section>
            <h4>Preferences</h4>
            <NestedWindow id='security-preferences'>
                <BakedSwitch as='div' checked={logoutAutomatically} onChange={setLogoutAutomatically}>
                    Logout Automatically
                </BakedSwitch>
            </NestedWindow>
        </section>
    )
}

export default Preferences
