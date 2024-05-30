import type { PlaitTextBoard, TextProps } from '@plait/common';
import type { ComponentRef, PlaitBoard } from '@plait/core';
import { createRoot } from 'react-dom/client';
import { createEditor } from 'slate';
import { Editable, Slate, withReact as withReactForSlate } from 'slate-react';

export const withReact = (board: PlaitBoard & PlaitTextBoard) => {
  board.renderText = (
    container: Element | DocumentFragment,
    props: TextProps
  ) => {
    const editor = withReactForSlate(createEditor());
    const initialValue = [props.text];
    const root = createRoot(container);
    root.render(
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          className="slate-editable-container"
          readOnly={true}
          placeholder=""
        />
      </Slate>
    );
    const ref: ComponentRef<TextProps> = {
      destroy: () => {
        root.unmount();
      },
      update: (props: Partial<TextProps>) => {}
    };
    return ref;
  };
  return board;
};
