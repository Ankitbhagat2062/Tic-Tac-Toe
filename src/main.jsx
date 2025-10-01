import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import useApp from './hooks/useApp';
import App from './App.jsx';
import Home from './Components/Home.jsx';
import Login from './Components/Login.jsx';
import Success from './Success.jsx';
import AppContextProvider from './context/AppContext.jsx';
import TicTacToe from './Components/TicTacToe.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import About from './Components/About.jsx';

import './index.css';
import LudoLobby from './Components/LudoLobby.jsx';

// Component to conditionally render App or Home based on token
export const ConditionalHome = () => {
  const { token } = useApp();

  return token ? <Home /> : <App />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <ConditionalHome />,
  },
  {
    path: '/success',
    element: <Success />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/join',
    element:
      <PrivateRoute>
        <LudoLobby />,
      </PrivateRoute>
  },
  {
    path: '/game',
    element: <TicTacToe />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppContextProvider>
        <RouterProvider router={router} />
      </AppContextProvider>
    </Provider>
  </React.StrictMode>
);
