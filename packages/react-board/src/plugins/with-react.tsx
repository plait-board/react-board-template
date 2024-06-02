import { type PlaitTextBoard, type TextProps } from '@plait/common';
import type { ComponentRef, PlaitBoard } from '@plait/core';
import { createRoot } from 'react-dom/client';
import { Text } from '@plait/react-text';

export const withReact = (board: PlaitBoard & PlaitTextBoard) => {
  board.renderText = (
    container: Element | DocumentFragment,
    props: TextProps
  ) => {
    const root = createRoot(container);
    root.render(<Text {...props}></Text>);
    let newProps = { ...props };
    const ref: ComponentRef<TextProps> = {
      destroy: () => {
        root.unmount();
      },
      update: (updatedProps: Partial<TextProps>) => {
        newProps = { ...newProps, ...updatedProps };
        root.render(<Text {...newProps}></Text>);
      }
    };
    return ref;
  };
  return board;
};
