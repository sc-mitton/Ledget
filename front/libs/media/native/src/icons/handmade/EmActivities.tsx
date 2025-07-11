import * as React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

function SvgComponent(props: SvgProps) {
  return (
    <Svg id="Layer_1" x="0px" y="0px" viewBox="0 0 88 88" {...props}>
      <Path
        d="M44 1.8C20.8 1.8 1.8 20.8 1.8 44s19 42.2 42.2 42.2S86.2 67.4 86.2 44 67.2 1.8 44 1.8zM32.1 79.3c-5.4-1.8-10.3-4.8-14.5-8.9-.4-.4-.8-1-1.4-1.4l-1.8-3.6-1.8-4.8c0-.2-.2-.6-.2-.8l8.9-5.2c3.4 2.2 7.1 4.2 10.7 5.7 1 .4 1.8.8 2.8 1.2L39.4 75c-2.3 1.7-4.7 3.1-7.3 4.3 0-.2 0-.2 0 0zm8.7-67.8c.2.4.6.6.8 1 1.6 2 3 4 4.4 6.1l-8.3 14.5h-.6c-4.4.6-8.9 1.4-13.3 2.6-.2 0-.4 0-.6.2L16.3 25c.4-.8.8-1.4 1.2-2.2C19 20 21 17.2 23 14.7l17.8-3.2zm-15.2.2c6.1-3.6 13.3-5.2 20.2-5-1.6.6-3.2 1.2-4.8 2-.2 0-.2.2-.4.2l-15 2.8zm22.6 8.1c4.8 0 9.3.4 14.1 1.4h.2L71 37.3c-.4.6-.6 1.2-1 2-1.8 3.4-3.8 6.7-5.9 9.9l-17.6-1.8c-.8-1.8-1.8-3.4-2.6-5.2-1.4-2.6-2.6-5-4-7.5l8.3-14.9zM21.6 37.9c-1 4.8-1.4 9.5-1.4 14.5v.2L11.1 58c-.4-.4-.6-.8-.8-1.2-1-1.4-1.8-2.8-2.6-4.2-1.6-6.9-1.2-14.1 1.2-20.8 1.6-1.8 3.4-3.2 5.4-4.4.2 0 .2-.2.4-.2l6.9 10.7zm15.7 22.2l2.6-2.6c2-2.4 4.2-4.6 6.1-6.9.2-.2.4-.6.6-.8l17.2 1.8c1 2.2 1.8 4.4 2.6 6.5.4 1.2.8 2.6 1.2 3.8L55.7 75.3c-1.6.2-3.2 0-4.8 0-2.6-.2-5.2-.4-7.9-.8-.4 0-.6-.2-1-.2l-4.7-14.2zm32.3 3.5c.4-.2.8-.2 1.2-.4 2.6-1 5-2.4 7.1-3.8-1.8 4-4.4 7.7-7.5 11.1-3.6 3.6-7.7 6.3-12.3 8.1 0-.6 0-1.2-.2-1.8l11.7-13.2zm3.7-27.1l-8.9-16.6c.6-2 1-4 1.4-6.1 1.6 1.2 3 2.4 4.6 3.8C76.9 24 80.5 32.3 81.1 41c-.2-.2-.4-.4-.8-.6-2.2-1.6-4.4-2.7-7-3.9z"
        fill="#c6c6c6"
      />
    </Svg>
  );
}

export default SvgComponent;
