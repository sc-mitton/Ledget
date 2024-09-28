import React from 'react';
import { render } from '@testing-library/react-native';

import NativeEmojiPicker from './native-emoji-picker';

describe('NativeEmojiPicker', () => {
  it('should render successfully', () => {
    const { root } = render(< NativeEmojiPicker />);
    expect(root).toBeTruthy();
  });
});
