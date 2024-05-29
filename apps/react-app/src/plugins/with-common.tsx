import type {
  ComponentContext,
  PlaitBoard,
  PlaitOptionsBoard
} from '@plait/core';
import type { WithCommonPluginOptions } from '@plait/common';
import { WithCommonPluginKey } from '@plait/common';
import { Editable, Slate, withReact } from 'slate-react';
import { HelloWorld, type ReactBoard } from '@bhouston/react-lib';
import { useMemo } from 'react';
import { createEditor } from 'slate';

export const withCommon = (board: PlaitBoard) => {
  const newBoard = board as PlaitBoard & ReactBoard;

  (board as PlaitOptionsBoard).setPluginOptions<WithCommonPluginOptions>(
    WithCommonPluginKey,
    {
      textComponentType: 'text'
    }
  );

  newBoard.renderComponentByContext = (context: ComponentContext<Object>) => {
    const editor = withReact(createEditor());
    const initialValue = [(context.props as any).text];
    return (
      <Slate editor={editor} initialValue={initialValue}>
        <Editable className="text-container" readOnly={true} placeholder="" />
      </Slate>
    );
  };

  return newBoard;
};
