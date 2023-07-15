import { Configuration, FrontendApi } from "@ory/client"

export const ory = new FrontendApi(
    new Configuration({
        basePath: process.env.REACT_APP_ORY_TUNNEL,
        baseOptions: {
            withCredentials: true,
        },
    })
)
