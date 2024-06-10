import {
  type PlaitTextBoard,
  type RenderComponentRef,
  type TextProps
} from '@plait/common';
import type { PlaitBoard } from '@plait/core';
import { createRoot } from 'react-dom/client';
import { Text } from '@plait/react-text';
import { ReactEditor } from 'slate-react';
import type { ReactBoard } from './board';

export const withReact = (board: PlaitBoard & PlaitTextBoard) => {
  const newBoard = board as PlaitBoard & PlaitTextBoard & ReactBoard;

  // newBoard.renderComponent = <T extends object>(
  //   children: React.ReactNode,
  //   container: Element | DocumentFragment,
  //   props: T
  // ) => {
  //   const root = createRoot(container);
  //   root.render(children);
  //   let newProps = { ...props };
  //   const ref: RenderComponentRef<T> = {
  //     destroy: () => {
  //       root.unmount();
  //     },
  //     update: (updatedProps: Partial<T>) => {
  //       newProps = { ...newProps, ...updatedProps };
  //       root.render(<Text {...newProps}></Text>);
  //     }
  //   };
  //   return ref;
  // };

  newBoard.renderText = (
    container: Element | DocumentFragment,
    props: TextProps
  ) => {
    const root = createRoot(container);
    let currentEditor: ReactEditor;
    const text = (
      <Text
        {...props}
        afterInit={(editor) => {
          currentEditor = editor as ReactEditor;
          props.afterInit && props.afterInit(editor);
        }}
      ></Text>
    );
    root.render(text);
    let newProps = { ...props };
    const ref: RenderComponentRef<TextProps> = {
      destroy: () => {
        root.unmount();
      },
      update: (updatedProps: Partial<TextProps>) => {
        const readonly = ReactEditor.isReadOnly(currentEditor);
        newProps = { ...newProps, ...updatedProps };
        root.render(<Text {...newProps}></Text>);

        if (readonly === true && newProps.readonly === false) {
          setTimeout(() => {
            ReactEditor.focus(currentEditor);
          }, 0);
        } else if (readonly === false && newProps.readonly === true) {
          ReactEditor.blur(currentEditor);
        }
      }
    };
    return ref;
  };

  return newBoard;
};
