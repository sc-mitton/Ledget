import styled from 'styled-components';
import { useScreenContext } from '../utils/context/ScreenContext';

export const Window = styled.div<{ size?: string }>`
  border-radius: var(--border-radius3);
  box-sizing: border-box;
  border: 1.25px solid var(--window-border);

  box-shadow: ${props => props.size === 'extra-small' ? 'none' : 'var(--window-drop-shadow)'};
  padding: 1em 1.5em;
  background: var(--window-background);

  @-moz-document url-prefix() {
    background: var(--window);
  }
`

export const UnPaddedWindow = styled(Window)`
  padding: 0;
`

const StyledPortalWindow = styled.div<{ size?: string, maxWidth?: number }>`
  font-size: .875rem;
  border-radius: var(--border-radius3);
  border: 1.5px solid var(--window-border);
  padding: 2em;
  margin: 1rem 0 2rem 0;
  position: relative;
  max-width: ${props => props.maxWidth ? `${props.maxWidth}em` : '24em'};
  width: ${props => props.size === 'extra-small' ? '100%' : '85%;'};
  box-shadow: ${props => props.size === 'extra-small' ? 'none' : 'var(--window-portal-drop-shadow)'};
  background-color: ${props => props.size === 'extra-small' ? 'transparent' : 'var(--window-portal)'};

  height: ${props => props.size === 'extra-small' ? 'calc(100% - 2em)' : 'auto'};
  max-height: ${props => props.size === 'extra-small' ? '40em' : 'none'};
  display: ${props => props.size === 'extra-small' ? 'flex' : 'block'};
  flex-direction: ${props => props.size === 'extra-small' ? 'column' : 'row'};
  justify-content: ${props => props.size === 'extra-small' ? 'space-between' : 'flex-start'};
`

export const PortalWindow = ({ children, maxWidth, ...rest }: React.HTMLAttributes<HTMLDivElement> & { maxWidth?: number }) => {
  const { screenSize } = useScreenContext()
  return (
    <StyledPortalWindow {...rest} size={screenSize} maxWidth={maxWidth}>
      {children}
    </StyledPortalWindow>
  )
}

export const MinimalPortalWindow = styled.div<{ size?: string, maxWidth?: number }>`
  border-radius: var(--border-radius3);
  border: 1.5px solid var(--window-border);
  box-shadow: ${props => props.size === 'extra-small' ? 'none' : 'var(--window-portal-drop-shadow)'};
  background-color: ${props => props.size === 'extra-small' ? 'transparent' : 'var(--window-portal)'};
`

export const Window2 = styled.div`
  border-radius: var(--border-radius3);
  box-shadow: var(--window-drop-shadow);
  padding: 1em 1.5em;
  box-sizing: border-box;
  background: var(--window2);
`

export const BlueWindow = styled.div`
  border-radius: var(--border-radius3);
  box-shadow: var(--window-drop-shadow);
  padding: 1.25em 1.5em;
  box-sizing: border-box;
  background: var(--blue-window-background);
`

const StylesNestedWindow = styled.div`
  background-color: var(--nested-window-background-color);
  border-radius: var(--border-radius2);
  padding: .75em 1em;
  width: 100%;
  box-sizing: border-box;
`

export const NestedWindow = ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => {
  const { screenSize } = useScreenContext()
  return (
    <StylesNestedWindow
      {...rest}
      style={{
        backgroundColor: screenSize === 'extra-small'
          ? 'var(--nested-window-background-color-small-screen'
          : 'var(--nested-window-background-color)'
      }}
    >
      {children}
    </StylesNestedWindow >
  )
}

export const NestedWindow2 = styled.div`
  background-color: var(--modal-inner-window);
  border-radius: var(--border-radius2);
  padding: .75em;
`

export const NestedWindowSlimmer = styled(NestedWindow)`
  padding: .25em .5em;
`

export const WindowCorner = styled.div`
  display: inline-flex;
  align-items: center;
  border-radius: .25em;
  position: absolute;
  top: 1em;
  right: 3.5em;
  z-index: 10;

  &>div {
      position: absolute;
      right: 0;
      bottom: 0;
      // transform: translateX(50%);
  }

  hr {
      margin: .375em 0;
  }

  button {
      display: flex;
      gap: .75em;
  }
`
