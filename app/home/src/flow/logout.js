
import { ory } from "./ory"

const getLogoutFlow = async () => {
    try {
        console.log("Logging out")
        const { data: flow } = await ory.createBrowserLogoutFlow()
        return flow
    }
    catch (err) {
        console.log(err)
    }
}

const logout = async () => {
    try {
        const flow = await getLogoutFlow()
        if (flow === undefined) {
            return false
        }
        await ory.updateLogoutFlow({ token: flow.logout_token })
        return true
    }
    catch (err) {
        console.log(err)
        return false
    }
}

export default logout
