import React from "react";
import { TextProps } from "react-native";
import { createText } from "@shopify/restyle";

export const Text = createText();

export const BodyText = (props: TextProps) => {
  const { children, ...rest } = props;

  return (
    <Text variant="body" {...rest}>{children}</Text>
  );
};

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
