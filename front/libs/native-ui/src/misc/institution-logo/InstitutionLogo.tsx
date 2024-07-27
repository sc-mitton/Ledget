import { Base64Image } from "../base64-image/Base64Image"
import type { Props } from "../base64-image/Base64Image"

export const InstitutionLogo = (props: Props) => {
  return (
    <Base64Image {...props} style={{ opacity: .8 }} />
  )
}
