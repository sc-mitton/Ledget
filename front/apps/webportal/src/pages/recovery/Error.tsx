import { FormError } from '@ledget/ui'

const Error = ({ msg }: { msg?: string }) => (
    <div className="recovery-error--container">
        {msg
            ? <FormError msg={msg} />
            : <FormError msg={"Something went wrong, please try again later."} />
        }
    </div>
)

export default Error
