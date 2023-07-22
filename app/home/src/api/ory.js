import { Configuration, FrontendApi } from "@ory/client"

export const ory = new FrontendApi(
    new Configuration({
        basePath: import.meta.env.VITE_ORY_TUNNEL,
        baseOptions: {
            withCredentials: true,
        },
    })
)
