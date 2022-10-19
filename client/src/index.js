import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import '../node_modules/react-toastify/dist/ReactToastify.min.css';
import '../node_modules/react-image-crop/dist/ReactCrop.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

registerServiceWorker();
