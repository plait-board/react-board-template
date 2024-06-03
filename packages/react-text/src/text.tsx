import {
  Editor,
  Operation,
  createEditor,
  type Descendant,
  type Element
} from 'slate';
import { Editable, Slate, withReact, ReactEditor } from 'slate-react';
import type { TextData, TextProps } from '@plait/common';
import { useMemo, useCallback } from 'react';
import { withHistory } from 'slate-history';
import { measureDiv } from '@plait/common';

export type TextComponentProps = TextProps;

export const Text: React.FC<TextComponentProps> = (
  props: TextComponentProps
) => {
  const {
    text,
    readonly,
    onChange,
    onComposition,
    onExitEdit,
    registerGetSize
  } = props;
  const renderElement = useCallback(
    (props: any) => <ParagraphElement {...props} />,
    []
  );
  const initialValue: Descendant[] = [text];
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value: Descendant[]) => {
        if (
          editor.operations.every((op) => Operation.isSelectionOperation(op))
        ) {
          return;
        }
        const size = getSize(editor);
        const data: TextData = {
          ...size,
          newText: value[0] as Element
        } as TextData;
        onChange && onChange(data);
      }}
    >
      <Editable
        className="slate-editable-container plait-text-container"
        renderElement={renderElement}
        readOnly={readonly === undefined ? true : readonly}
        onKeyDown={(event) => {
          // for (const hotkey in HOTKEYS) {
          //   if (isHotkey(hotkey, event as any)) {
          //     event.preventDefault();
          //     const mark = HOTKEYS[hotkey];
          //     toggleMark(editor, mark);
          //   }
          // }
        }}
      />
    </Slate>
  );
};

const ParagraphElement = (props: {
  attributes: any;
  children: any;
  element: any;
}) => {
  const { attributes, children, element } = { ...props };
  const style = { textAlign: element.align };
  return (
    <div style={style} {...attributes}>
      {children}
    </div>
  );
};

export const getSize = (editor: ReactEditor) => {
  // TODO rotate
  // const transformMatrix = this.g.getAttribute('transform');
  // this.g.setAttribute('transform', '');
  const paragraph = ReactEditor.toDOMNode(editor, editor.children[0]);
  const { width, height } = measureDiv(paragraph);
  // if (transformMatrix) {
  //     this.g.setAttribute('transform', transformMatrix);
  // }
  return { width, height };
};
