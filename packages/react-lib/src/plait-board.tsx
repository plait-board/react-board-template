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
  type PlaitBoardOptions
} from '@plait/core';
import type { BoardChangeData } from './interfaces/board';
import { useRef, useEffect } from 'react';

export type BoardProps = {
  value: PlaitElement[];
  options: PlaitBoardOptions;
  plugins: PlaitPlugin[];
  plaitViewport: Viewport;
  onChange?: (data: BoardChangeData) => void;
  style?: React.CSSProperties;
  readOnly?: boolean;
  initializeCompleted?: (board: PlaitBoard) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export const board = (props: BoardProps) => {
  const hostRef = useRef<SVGSVGElement>(null);
  const elementLowerHostRef = useRef<SVGGElement>(null);
  const elementHostRef = useRef<SVGGElement>(null);
  const elementUpperHostRef = useRef<SVGGElement>(null);
  const elementActiveHostRef = useRef<SVGGElement>(null);
  const viewportContainerRef = useRef<HTMLDivElement>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const board = initializeBoard(props.value, props.options, props.plugins);
    const roughSVG = rough.svg(hostRef.current!, {
      options: { roughness: 0, strokeWidth: 1 }
    });
    BOARD_TO_ROUGH_SVG.set(board, roughSVG as any);
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
    BOARD_TO_ON_CHANGE.set(board, () => {
      // updateListRender();
    });
    BOARD_TO_AFTER_CHANGE.set(board, () => {
      const changeEvent: BoardChangeData = {
        children: board.children,
        operations: board.operations,
        viewport: board.viewport,
        selection: board.selection,
        theme: board.theme
      };
      // this.plaitChange.emit(changeEvent);
    });
    const context = new PlaitBoardContext();
    BOARD_TO_CONTEXT.set(board as any, context);
  }, []);

  return (
    <div className="plait-board plait-board-container" ref={boardContainerRef}>
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

const initializeBoard = (value: any, options: any, plugins: any) => {
  let board = withRelatedFragment(
    withHotkey(
      withHandPointer(
        withHistory(
          withSelection(
            withMoving(
              withBoard(withViewport(withOptions(createBoard(value, options))))
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
