import { Board } from '@plait/react-board';
import type { PlaitBoardOptions, PlaitElement, PlaitPlugin } from '@plait/core';
import React, { useMemo, useState } from 'react';
import { withGroup } from '@plait/common';
import { withDraw } from '@plait/draw';

const Editor: React.FC = () => {
  const [serverMessage, setServerMessage] = useState<string>();

  useMemo(() => {
    fetch('/api/message').then(async (res) => {
      const json = await res.json();
      console.log(json);
      return setServerMessage(json.message);
    });
  }, []);

  const value = [
    {
      id: 'GMKAE',
      type: 'geometry',
      shape: 'terminal',
      angle: 0,
      opacity: 1,
      textHeight: 20,
      text: {
        children: [
          {
            text: '结束'
          }
        ],
        align: 'center'
      },
      points: [
        [-107, 443.9999999999999],
        [13, 503.9999999999999]
      ],
      strokeWidth: 2
    }
  ] as PlaitElement[];
  const plugins: PlaitPlugin[] = [withDraw, withGroup];
  const options: PlaitBoardOptions = {};

  return <Board value={value} options={options} plugins={plugins}></Board>;
};

export default Editor;
