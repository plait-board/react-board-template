import { createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import type { TextProps } from '@plait/common';

export type TextComponentProps = TextProps;

export const Text: React.FC<TextComponentProps> = (
  props: TextComponentProps
) => {
  const editor = withReact(createEditor());
  const initialValue = [props.text];
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        className="slate-editable-container"
        readOnly={true}
        placeholder=""
      />
    </Slate>
  );
};
