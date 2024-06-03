import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ErrorPage from './ErrorPage.js';
import Editor from './editor.js';

// import '@plait/core/styles/styles.scss';

import './styles/core/styles.scss';
import './styles/text/index.scss';

const container = document.querySelector('#root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Editor />} />
        <Route
          path="*"
          element={<ErrorPage errorCode={404} errorMessage="Page Not Found" />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
