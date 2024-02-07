
import './pieces.css'
import { LedgetLogo } from '@ledget/media'

function SignUpFlowHeader() {

    return (
        <div className="signup-container-header">
            <div>
                <LedgetLogo darkMode={isDark} />
            </div>
        </div>
    )
}

export default SignUpFlowHeader
