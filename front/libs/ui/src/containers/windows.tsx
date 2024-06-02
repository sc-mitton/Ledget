import styled from 'styled-components';

export const Window = styled.div<{ size?: string }>`
  border-radius: var(--border-radius3);
  box-sizing: border-box;
  border: 1.25px solid var(--window-border);

  box-shadow: ${props => props.size === 'extra-small' ? 'none' : 'var(--window-drop-shadow)'};
  padding: var(--window-padding);
  background: var(--window-background);
`

export const UnPaddedWindow = styled(Window)`
  padding: 0;
  background: ${props => props.size === 'extra-small' ? 'transparent' : 'var(--window-background)'};
`

export const PortalWindow = styled.div<{ size?: string, maxWidth?: number }>`
  font-size: .875rem;
  border-radius: var(--border-radius3);
  border: 1.5px solid var(--window-border);
  padding: 2em;
  margin: 1rem 0;
  position: relative;
  max-width: ${props => props.maxWidth ? `${props.maxWidth}em` : '24em'};
  width: ${props => props.size === 'extra-small' ? '100%' : '85%;'};
  box-shadow: ${props => props.size === 'extra-small' ? 'none' : 'var(--window-portal-drop-shadow)'};
  background-color: ${props => props.size === 'extra-small' ? 'transparent' : 'var(--window-portal)'};

  height: ${props => props.size === 'extra-small' ? 'calc(100% - 4em)' : 'auto'};
  max-height: ${props => props.size === 'extra-small' ? '40em' : 'none'};
  display: ${props => props.size === 'extra-small' ? 'flex' : 'block'};
  flex-direction: ${props => props.size === 'extra-small' ? 'column' : 'row'};
  justify-content: ${props => props.size === 'extra-small' ? 'space-between' : 'flex-start'};
`

export const MinimalPortalWindow = styled.div<{ size?: string, maxWidth?: number }>`
  border-radius: var(--border-radius3);
  border: 1.5px solid var(--window-border);
  box-shadow: ${props => props.size === 'extra-small' ? 'none' : 'var(--window-portal-drop-shadow)'};
  background-color: ${props => props.size === 'extra-small' ? 'transparent' : 'var(--window-portal)'};
`

export const Window2 = styled.div`
  border-radius: var(--border-radius3);
  box-shadow: var(--window-drop-shadow);
  padding: var(--window-padding);
  box-sizing: border-box;
  background: var(--window2);
`

export const BlueWindow = styled.div`
  border-radius: var(--border-radius3);
  box-shadow: var(--window-drop-shadow);
  padding: var(--window-padding);
  box-sizing: border-box;
  background: var(--blue-window-background);
`

export const NestedWindow = styled.div`
  background-color: var(--nested-window);
  border-radius: var(--border-radius2);
  padding: .75em 1em;
  width: 100%;
  box-sizing: border-box;
`

export const NestedWindowLight = styled(NestedWindow)`
  padding: .25em .5em;
`

export const NestedWindow2 = styled.div`
  background-color: var(--modal-inner-window);
  border-radius: var(--border-radius2);
  padding: .75em;
`
