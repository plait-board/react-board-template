import {
  BoardTransforms,
  PlaitBoard,
  ZOOM_STEP,
  initializeViewBox,
  initializeViewportContainer,
  isFromViewportChange,
  setIsFromViewportChange,
  updateViewportByScrolling,
  updateViewportOffset
} from '@plait/core';
import { useEffect } from 'react';
import { useEventListener } from 'ahooks';

const useBoardEvent = (props: {
  board: PlaitBoard;
  hostRef: React.RefObject<SVGSVGElement>;
}) => {
  useEventListener(
    'scroll',
    (event) => {
      if (isFromViewportChange(props.board)) {
        setIsFromViewportChange(props.board, false);
      } else {
        const { scrollLeft, scrollTop } = event.target as HTMLElement;
        updateViewportByScrolling(props.board, scrollLeft, scrollTop);
      }
    },
    { target: PlaitBoard.getViewportContainer(props.board) }
  );

  useEventListener(
    'wheel',
    (event) => {
      // Credits to excalidraw
      // https://github.com/excalidraw/excalidraw/blob/b7d7ccc929696cc17b4cc34452e4afd846d59f4f/src/components/App.tsx#L9060
      if (event.metaKey || event.ctrlKey) {
        event.preventDefault();
        const { deltaX, deltaY } = event;
        const zoom = props.board.viewport.zoom;
        const sign = Math.sign(deltaY);
        const MAX_STEP = ZOOM_STEP * 100;
        const absDelta = Math.abs(deltaY);
        let delta = deltaY;
        if (absDelta > MAX_STEP) {
          delta = MAX_STEP * sign;
        }
        let newZoom = zoom - delta / 100;
        // increase zoom steps the more zoomed-in we are (applies to >100% only)
        newZoom +=
          Math.log10(Math.max(1, zoom)) *
          -sign *
          // reduced amplification for small deltas (small movements on a trackpad)
          Math.min(1, absDelta / 20);
        BoardTransforms.updateZoom(props.board, newZoom, false);
      }
    },
    { target: PlaitBoard.getViewportContainer(props.board), passive: false }
  );

  useEffect(() => {
    if (!PlaitBoard.getBoardContainer(props.board)) {
      return;
    }
    const resizeObserver = new ResizeObserver(() => {
      initializeViewportContainer(props.board);
      initializeViewBox(props.board);
      updateViewportOffset(props.board);
    });
    resizeObserver.observe(PlaitBoard.getBoardContainer(props.board));
    return () => {
      resizeObserver && resizeObserver.disconnect();
    };
  }, [props.board]);
};

export default useBoardEvent;
