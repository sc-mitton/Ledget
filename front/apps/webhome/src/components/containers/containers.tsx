import styled from 'styled-components'

export const MainWindow = styled.div<{ size?: string }>`
    overflow: auto;
    scrollbar-width: none;
    max-width: 55rem;
    width: ${props => props.size === 'extra-small' ? 'calc(100% - 2em)' : 'calc(100% - 4em)'};
    padding: 2em;
`
