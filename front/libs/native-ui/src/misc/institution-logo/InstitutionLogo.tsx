import { Base64Image } from "../base64-image/Base64Image"
import type { Props } from "../base64-image/Base64Image"

export const InstitutionLogo = (props: Props) => {
  return (
    <Base64Image
      borderRadius={20}
      shadowColor="logoShadow"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={.8}
      shadowRadius={1}
      borderColor='lightseperator'
      borderWidth={.5}
      size={22}
      {...props}
    />
  )
}
