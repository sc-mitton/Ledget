import { Base64Image } from "../base64-image/Base64Image"
import type { Props } from "../base64-image/Base64Image"

export const InstitutionLogo = (props: Props) => {
  return (
    <Base64Image
      shadowColor="quinaryText"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={.5}
      shadowRadius={1}
      size={22}
      style={{ opacity: .8 }}
      {...props}
    />
  )
}
