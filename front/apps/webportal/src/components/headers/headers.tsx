
import { LedgetLogo } from '@ledget/media'
import { useColorScheme } from '@ledget/ui'

import styled from 'styled-components'

const SignUpFlowStyledHeader = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    background-color: #f5f5f5;

    img {
        height: 1.8em;
    }
`

export const SignUpFlowHeader = () => {
    const { isDark } = useColorScheme()

    return (
        <SignUpFlowStyledHeader>
            <LedgetLogo darkMode={isDark} />
        </SignUpFlowStyledHeader>
    )
}

export const SubHeader = styled.div`
    .subheader {
        display: flex;
        flex-direction: column;
        margin-bottom: 1.5rem;
        width: 90%;

        span {
            opacity: .8;
        }
    }
`
