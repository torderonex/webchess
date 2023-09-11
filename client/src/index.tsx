import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AuthStore from './store/AuthStore'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';


const darkTheme = createTheme({
  palette:{
    mode:'dark',
  },
});

interface Store{
    store: AuthStore,
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const store = new AuthStore();

export const Context = createContext<Store>({
 store,
});

root.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline>
      <BrowserRouter>
      <Context.Provider value={{
        store
      }
      }>
        <App />
      </Context.Provider>
      </BrowserRouter>
      </CssBaseline>
  </ThemeProvider>
);

reportWebVitals();
