import { createEditor, type Descendant, type Element } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import type { TextData, TextProps } from '@plait/common';
import { useMemo, useCallback } from 'react';
import { withHistory } from 'slate-history';

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
        const data: TextData = {
          newText: value[0] as Element
          // TODO
        } as TextData;
        // onChange(data);
      }}
    >
      <Editable
        className="slate-editable-container"
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
