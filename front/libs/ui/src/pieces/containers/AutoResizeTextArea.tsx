import React, {
  HTMLProps,
  forwardRef,
  useRef,
  useEffect,
  useState,
  createContext,
  useContext,
} from 'react';

const context = createContext<{
  areaRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  containerRef: React.RefObject<HTMLDivElement>;
} | null>(null);

interface BaseProps extends HTMLProps<HTMLTextAreaElement> {
  defaultValue?: string;
}

interface AutoResizeProps extends BaseProps {
  autoResize: false;
}

interface NonAutoResizeProps extends BaseProps {
  autoResize?: true;
  rows?: never;
}

type AreaProps = AutoResizeProps | NonAutoResizeProps;

const useTextAreaContext = () => {
  const ctx = useContext(context);
  if (!ctx) {
    throw new Error('TextArea must be used within a TextArea');
  }
  return ctx;
};

const TextArea = ({ children }: { children: React.ReactNode }) => {
  const areaRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <context.Provider value={{ areaRef, containerRef }}>
      {children}
    </context.Provider>
  );
};

const Area = (props: HTMLProps<HTMLDivElement>) => {
  const { containerRef } = useTextAreaContext();

  return <div {...props} ref={containerRef} />;
};

const Text = forwardRef<HTMLTextAreaElement, AreaProps>((props, ref) => {
  const { areaRef, containerRef } = useTextAreaContext();
  const { autoResize = true, children, onChange, onFocus, ...rest } = props;

  const [val, setVal] = useState<string>(props.defaultValue || '');

  // As the value is updated, we need to update the height of the textarea
  useEffect(() => {
    if (autoResize && areaRef.current && containerRef.current) {
      // Reset the height to 0px so that it can shrink and we can measure the right value
      areaRef.current.style.height = '0px';
      containerRef.current.style.height = '0px';

      areaRef.current.style.height = `${areaRef.current.scrollHeight}px`;
      containerRef.current.style.height = `${areaRef.current.scrollHeight}px`;
    }
  }, [val, props.value, autoResize]);

  return (
    <>
      <textarea
        ref={(el) => {
          areaRef.current = el;
          if (ref) {
            if (typeof ref === 'function') {
              ref(el);
            } else {
              ref.current = el;
            }
          }
        }}
        value={val}
        onFocus={(e) => {
          e.target.setSelectionRange(
            e.target.value.length,
            e.target.value.length
          );
          onFocus && onFocus(e);
        }}
        onChange={(e) => {
          setVal(e.target.value);
          onChange && onChange(e);
        }}
        {...rest}
      />
      {children}
    </>
  );
});

TextArea.Area = Area;
TextArea.Text = Text;

export default TextArea;
