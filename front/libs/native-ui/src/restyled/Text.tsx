import { TextProps, View } from "react-native";
import { createText } from "@shopify/restyle";
import { formatCurrency } from '@ledget/helpers';
import {
  ColorProps,
  TextProps as RestyledTextProps,
  color,
  typography,
  composeRestyleFunctions,
  useRestyle
} from '@shopify/restyle';

import { Box } from './Box';
import { Theme } from "../theme";

type RestyledColorProps = ColorProps<Theme> & RestyledTextProps<Theme>;

const restyledFunctions = composeRestyleFunctions<Theme, RestyledColorProps>([color, typography]);


export const Text = createText();

export const Header = (props: TextProps) => {
  const { children, ...rest } = props;

  return (
    <Text variant="header" {...rest}>{children}</Text>
  );
}

export const Header2 = (props: TextProps) => {
  const { children, ...rest } = props;

  return (
    <Text variant="header2" {...rest}>{children}</Text>
  );
}

export const BoxHeader = (props: TextProps) => {
  const { children, ...rest } = props;

  return (
    <Text variant="boxHeader" {...rest}>{children}</Text>
  );
}

export const SubHeader = (props: TextProps) => {
  const { children, ...rest } = props;

  return (
    <Text variant="subheader" {...rest}>{children}</Text>
  );
}

export const SubHeader2 = (props: TextProps) => {
  const { children, ...rest } = props;

  return (
    <Text variant="subheader2" {...rest}>{children}</Text>
  );
}

export const InputLabel = (props: TextProps) => {
  const { children, ...rest } = props;

  return (
    <Text variant="label" {...rest}>{children}</Text>
  );
}

export const DollarCents = ({
  value = 0,
  withCents = true,
  ...rest
}: {
  value: string | number;
  withCents?: boolean;
} & RestyledColorProps) => {
  let str = formatCurrency(typeof value === 'string' ? value.replace(/^-/, '') : Math.abs(value));
  const isDebit = Number(value) < 0;
  const props = useRestyle(restyledFunctions, rest);
  const { fontSize, ...restStyle } = (props as any).style[0] || {};

  return (
    <Box flexDirection="row">
      <Text>
        <Text {...props} >
          {`${isDebit ? '+' : ''}${str.split('.')[0]}`}
        </Text>
        {withCents && (
          <Text {...props} style={{ ...restStyle }} fontSize={((props as any).style[0]?.fontSize || 16) * .75}>
            {`.${str.split('.')[1]}`}
          </Text>
        )}
      </Text>
    </Box>
  );
}
