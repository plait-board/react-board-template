import rough from 'roughjs/bin/rough';
import { RoughSVG } from 'roughjs/bin/svg';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil, tap } from 'rxjs/operators';
import {
  BOARD_TO_AFTER_CHANGE,
  BOARD_TO_CONTEXT,
  BOARD_TO_ELEMENT_HOST,
  BOARD_TO_HOST,
  BOARD_TO_MOVING_POINT,
  BOARD_TO_MOVING_POINT_IN_BOARD,
  BOARD_TO_ON_CHANGE,
  BOARD_TO_ROUGH_SVG,
  BoardTransforms,
  HOST_CLASS_NAME,
  IS_BOARD_ALIVE,
  IS_CHROME,
  IS_FIREFOX,
  IS_SAFARI,
  ListRender,
  PlaitBoardContext,
  PlaitElement,
  Viewport,
  WritableClipboardOperationType,
  ZOOM_STEP,
  createBoard,
  deleteFragment,
  getClipboardData,
  hasInputOrTextareaTarget,
  initializeViewBox,
  initializeViewportContainer,
  initializeViewportOffset,
  isFromViewportChange,
  isPreventTouchMove,
  setFragment,
  setIsFromViewportChange,
  toHostPoint,
  toViewBoxPoint,
  updateViewportByScrolling,
  updateViewportOffset,
  withBoard,
  withHandPointer,
  withHistory,
  withHotkey,
  withMoving,
  withOptions,
  withRelatedFragment,
  withSelection,
  withViewport,
  PlaitBoard,
  type PlaitPlugin,
  type PlaitBoardOptions,
  type PlaitChildrenContext
} from '@plait/core';
import type { BoardChangeData } from './plugins/board';
import { useRef, useEffect, useState } from 'react';
import React from 'react';
import useBoardPluginEvent from './hooks/use-plugin-event';
import useBoardEvent from './hooks/use-board-event';
import { withReact } from './plugins/with-react';
import { withImage, withText } from '@plait/common';

export type BoardProps = {
  value: PlaitElement[];
  options: PlaitBoardOptions;
  plugins: PlaitPlugin[];
  viewport?: Viewport;
  onChange?: (data: BoardChangeData) => void;
  style?: React.CSSProperties;
  afterInitialize?: (board: PlaitBoard) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const Board: React.FC<BoardProps> = (props: BoardProps) => {
  let initialized = false;
  const hostRef = useRef<SVGSVGElement>(null);
  const elementLowerHostRef = useRef<SVGGElement>(null);
  const elementHostRef = useRef<SVGGElement>(null);
  const elementUpperHostRef = useRef<SVGGElement>(null);
  const elementActiveHostRef = useRef<SVGGElement>(null);
  const viewportContainerRef = useRef<HTMLDivElement>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);

  const [board, setBoard] = useState<PlaitBoard>({} as PlaitBoard);

  const [className, setClassName] = useState<string>(
    `plait-board plait-board-container`
  );

  useEffect(() => {
    let board = initializeBoard(props.value, props.options, props.plugins);
    const roughSVG = rough.svg(hostRef.current!, {
      options: { roughness: 0, strokeWidth: 1 }
    });
    BOARD_TO_ROUGH_SVG.set(board, roughSVG);
    BOARD_TO_HOST.set(board, hostRef.current!);
    IS_BOARD_ALIVE.set(board, true);
    BOARD_TO_ELEMENT_HOST.set(board, {
      lowerHost: elementLowerHostRef.current!,
      host: elementHostRef.current!,
      upperHost: elementUpperHostRef.current!,
      activeHost: elementActiveHostRef.current!,
      container: boardContainerRef.current!,
      viewportContainer: viewportContainerRef.current!
    });
    const listRender = initializeListRender(board);
    BOARD_TO_ON_CHANGE.set(board, () => {
      listRender.update(board.children, initializeChildrenContext(board));
    });
    BOARD_TO_AFTER_CHANGE.set(board, () => {
      const data: BoardChangeData = {
        children: board.children,
        operations: board.operations,
        viewport: board.viewport,
        selection: board.selection,
        theme: board.theme
      };
      props.onChange && props.onChange(data);
      setClassName(
        `plait-board plait-board-container ${getBoardDynamicClassName(board)}`
      );
    });
    const context = new PlaitBoardContext();
    BOARD_TO_CONTEXT.set(board, context);
    setBoard(board);

    initializeViewportContainer(board);
    initializeViewBox(board);
    initializeViewportOffset(board);

    if (props.afterInitialize && !initialized) {
      props.afterInitialize(board);
    }

    initialized = true;

    setClassName(
      `plait-board plait-board-container ${getBoardDynamicClassName(board)}`
    );

    return () => {
      BOARD_TO_CONTEXT.delete(board);
      BOARD_TO_AFTER_CHANGE.delete(board);
      BOARD_TO_ON_CHANGE.delete(board);
      BOARD_TO_ELEMENT_HOST.delete(board);
      IS_BOARD_ALIVE.delete(board);
      BOARD_TO_HOST.delete(board);
      BOARD_TO_ROUGH_SVG.delete(board);
      listRender.destroy();
    };
  }, []);

  useBoardPluginEvent({ board, hostRef });

  useBoardEvent({ board, hostRef });

  return (
    <div className={className} ref={boardContainerRef}>
      <div
        className="viewport-container"
        ref={viewportContainerRef}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
      >
        <svg
          ref={hostRef}
          width="100%"
          height="100%"
          style={{ position: 'relative' }}
          className="board-host-svg"
        >
          <g className="element-lower-host" ref={elementLowerHostRef}></g>
          <g className="element-host" ref={elementHostRef}></g>
          <g className="element-upper-host" ref={elementUpperHostRef}></g>
          <g className="element-active-host" ref={elementActiveHostRef}></g>
        </svg>
      </div>
    </div>
  );
};

const initializeListRender = (board: PlaitBoard) => {
  const listRender = new ListRender(board);
  listRender.initialize(board.children, initializeChildrenContext(board));
  return listRender;
};

const initializeChildrenContext = (board: PlaitBoard): PlaitChildrenContext => {
  return {
    board: board,
    parent: board,
    parentG: PlaitBoard.getElementHost(board)
  };
};

const initializeBoard = (value: any, options: any, plugins: any) => {
  let board = withRelatedFragment(
    withHotkey(
      withHandPointer(
        withHistory(
          withSelection(
            withMoving(
              withBoard(
                withViewport(
                  withOptions(
                    withReact(withImage(withText(createBoard(value, options))))
                  )
                )
              )
            )
          )
        )
      )
    )
  );
  plugins.forEach((plugin: any) => {
    board = plugin(board);
  });

  // if (this.plaitViewport) {
  //   this.board.viewport = this.plaitViewport;
  // }

  // if (this.plaitTheme) {
  //   this.board.theme = this.plaitTheme;
  // }
  return board;
};

const getBrowserClassName = () => {
  if (IS_SAFARI) {
    return 'safari';
  }
  if (IS_CHROME) {
    return 'chrome';
  }
  if (IS_FIREFOX) {
    return 'firefox';
  }
  return '';
};

const getBoardDynamicClassName = (board: PlaitBoard) => {
  let result = `${getBrowserClassName()}`;
  if (PlaitBoard.isFocus(board)) {
    result += ` focused`;
  }
  if (board.options?.readonly) {
    result += ` readonly`;
  }
  if (board.options?.disabledScrollOnNonFocus && !PlaitBoard.isFocus(board)) {
    result += ` disabled-scroll`;
  }
  result += ` theme-${board.theme?.themeColorMode}`;
  return result;
};
