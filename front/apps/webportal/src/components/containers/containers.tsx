import styled from 'styled-components';

// Define the interface for the props
interface PageProps {
    dark: boolean;
    size: string;
}

// Define the styled component with props
export const MainDiv = styled.div<PageProps>`
    flex-grow: 1;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;

    background: ${({ dark }) => (dark ? 'var(--main-background-color)' : 'none')};
    background-color: ${({ size }) => (size === 'extra-small' ? 'var(--window)' : 'initial')};

    /* Specific styles for Firefox */
    @-moz-document url-prefix() {
      background: ${({ dark }) => dark && 'var(--main-background-color)'};
    }

    &>div {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;

        &>div {
            width: 100%;
            height: 100%;
            display: grid;
            place-items: center;
        }
    }
`;
