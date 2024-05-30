import {
  PlaitElement,
  PlaitOperation,
  Viewport,
  Selection,
  type PlaitTheme
} from '@plait/core';

export interface BoardChangeData {
  children: PlaitElement[];
  operations: PlaitOperation[];
  viewport: Viewport;
  selection: Selection | null;
  theme: PlaitTheme;
}
