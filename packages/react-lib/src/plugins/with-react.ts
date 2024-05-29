import type { ComponentContext, PlaitBoard } from '@plait/core';
import { createRoot } from 'react-dom/client';

export interface ReactBoard extends PlaitBoard {
  renderComponentByContext: <T extends Object>(
    context: ComponentContext<T>
  ) => React.ReactNode;
}

export const withReact = (board: PlaitBoard) => {
  board.renderComponent = <T extends Object>(context: ComponentContext<T>) => {
    const root = createRoot(context.foreignObject);
    root.render((board as ReactBoard).renderComponentByContext(context));
    return {
      destroy: () => {
        root.unmount();
      },
      update: (props: any) => {}
    };
  };
  return board;
};
