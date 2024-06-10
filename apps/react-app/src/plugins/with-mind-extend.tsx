import type { PlaitBoard, PlaitOptionsBoard } from '@plait/core';
import {
  WithMindPluginKey,
  type EmojiProps,
  type PlaitMindBoard,
  type PlaitMindEmojiBoard,
  type WithMindOptions
} from '@plait/mind';
import { createRoot } from 'react-dom/client';
import { Emoji } from '../components/emoji';
import type { RenderComponentRef } from '@plait/common';

export const withMindExtend = (board: PlaitBoard) => {
  const newBoard = board as PlaitBoard & PlaitMindBoard & PlaitMindEmojiBoard;

  (board as PlaitOptionsBoard).setPluginOptions<WithMindOptions>(
    WithMindPluginKey,
    {
      isMultiple: true,
      emojiPadding: 0,
      spaceBetweenEmojis: 4
    }
  );

  newBoard.renderEmoji = (
    container: Element | DocumentFragment,
    props: EmojiProps
  ) => {
    const root = createRoot(container);
    root.render(<Emoji {...props}></Emoji>);
    let newProps = { ...props };
    const ref: RenderComponentRef<EmojiProps> = {
      destroy: () => {
        root.unmount();
      },
      update: (updatedProps: Partial<EmojiProps>) => {
        newProps = { ...newProps, ...updatedProps };
        root.render(<Emoji {...newProps}></Emoji>);
      }
    };
    return ref;
  };

  return newBoard;
};
