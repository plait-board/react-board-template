import { HelloWorld, Board } from '@bhouston/react-lib';
import type { PlaitBoardOptions, PlaitElement, PlaitPlugin } from '@plait/core';
import React, { useMemo, useState } from 'react';

const Home: React.FC = () => {
  const [serverMessage, setServerMessage] = useState<string>();

  useMemo(() => {
    fetch('/api/message').then(async (res) => {
      const json = await res.json();
      console.log(json);
      return setServerMessage(json.message);
    });
  }, []);

  const value: PlaitElement[] = [];
  const plugins: PlaitPlugin[] = [];
  const options: PlaitBoardOptions = {};

  return <Board value={value} options={options} plugins={plugins}></Board>;
};

export default Home;
