import styled from 'styled-components';

export const Window = styled.div`
  box-shadow: var(--window-drop-shadow);
  border-radius: var(--border-radius3);
  padding: var(--window-padding);
  box-sizing: border-box;
  border: 1.25px solid var(--window-border);
  background: var(--window-background);
`

export const Window2 = styled.div`
  border-radius: var(--border-radius3);
  box-shadow: var(--window-drop-shadow);
  padding: var(--window-padding);
  box-sizing: border-box;
  background: var(--window2);
`

export const NestedWindow = styled.div`
  background-color: var(--nested-window);
  border-radius: var(--border-radius2);
  padding: .75em 1em;
  margin: -.125em;
`

export const SmallScreenNestedWindow = styled(NestedWindow)`
  background-color: var(--nested-window-small-screen);
`

export const NestedWindow2 = styled.div`
  background-color: var(--modal-inner-window);
  border-radius: var(--border-radius2);
  padding: .75em;
  margin: -.125em;
`
