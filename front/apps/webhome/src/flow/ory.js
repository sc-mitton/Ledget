import axios from "axios"

class ApiClient {
    constructor(baseURL) {
        this.instance = axios.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json'
            }
        })
    }

    async createSettingsFlow() {
        try {
            const response = await this.instance.get(
                '/self-service/settings/browser',
                { withCredentials: true },
            )
            return response.data
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    async getSettingsFlow(id) {
        try {
            if (id === null) {
                return this.createSettingsFlow()
            } else {
                return this.instance.get(
                    '/self-service/settings/flows',
                    { params: { id: id }, withCredentials: true }
                )
            }
        } catch {
            console.log(error)
            return null;
        }
    }

    async createBrowserLogoutFlow() {
        try {
            const response = await this.instance.get(
                '/self-service/logout/browser',
                { withCredentials: true }
            )
            return response.data
        } catch (error) {
            console.log(error)
            return null;
        }
    }

    async logout(redirect) {
        const newFlow = await this.createBrowserLogoutFlow()

        await this.instance.get(
            '/self-service/logout',
            {
                params: { token: newFlow.logout_token },
                withCredentials: true
            }
        ).then(response => {
            if (response.status === 204) {
                window.location.href = redirect
            }
        }).catch(error => {
            console.log(error)
        })
    }
}

let baseURL = ''
if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:4000/'
} else {
    baseURL = `https://${process.env.VITE_ORY_PROJECT}.projects.oryapis.com/`
}

const ory = new ApiClient(baseURL)

export { ory }
