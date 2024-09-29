import { PortalHost, PortalProvider } from "@gorhom/portal";
import React from "react";

interface IProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export function EmojiPickerProvider({ children }: IProviderProps) {
  return (
    <PortalProvider>
      <PortalHost name="EmojiPicker" />
      {children}
    </PortalProvider>
  )
}
