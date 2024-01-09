import { HTMLProps, useRef, useEffect, useState, forwardRef } from "react";

interface BaseProps extends HTMLProps<HTMLTextAreaElement> {
  divProps?: HTMLProps<HTMLDivElement>
  defaultValue?: string
}

interface AutoResizeProps extends BaseProps {
  autoResize: false
}
interface NonAutoResizeProps extends BaseProps {
  autoResize?: true
  rows?: never
}

type Props = AutoResizeProps | NonAutoResizeProps


export const AutoResizeTextArea = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const { autoResize = true, children, divProps, onChange, ...rest } = props

  const localRef = useRef<HTMLTextAreaElement | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [val, setVal] = useState<string>('')

  // As the value is updated, we need to update the height of the textarea
  useEffect(() => {
    if (autoResize && localRef.current && containerRef.current) {
      // Reset the height to 0px so that it can shrink and we can measure the right value
      localRef.current.style.height = '0px'
      containerRef.current.style.height = '0px'

      localRef.current.style.height = `${localRef.current.scrollHeight}px`
      containerRef.current.style.height = `${localRef.current.scrollHeight}px`
    }
  }, [val, autoResize])

  return (
    <div {...divProps} ref={containerRef}>
      <textarea
        ref={(el) => {
          localRef.current = el
          if (ref) {
            if (typeof ref === 'function') {
              ref(el)
            } else {
              ref.current = el
            }
          }
        }}
        {...rest}
      />
      {children}
    </div>
  )
})

export default AutoResizeTextArea;
