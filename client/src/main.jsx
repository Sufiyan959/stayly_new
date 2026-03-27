import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { persistor, store } from './redux/store.js';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const LoadingComponent = () => (
  <div className='flex items-center justify-center h-screen'>
    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700'></div>
    <span className='ml-2'>Loading...</span>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={<LoadingComponent />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);