import type { PlaitBoard, PlaitOptionsBoard } from '@plait/core';
import type { WithCommonPluginOptions } from '@plait/common';
import { WithCommonPluginKey } from '@plait/common';

export const withCommon = (board: PlaitBoard) => {
  const newBoard = board as PlaitBoard;

  (board as PlaitOptionsBoard).setPluginOptions<WithCommonPluginOptions>(
    WithCommonPluginKey,
    {
      // textComponentType: PlaitRichtextComponent
    }
  );

  return newBoard;
};
