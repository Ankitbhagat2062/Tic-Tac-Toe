import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import { store } from './store/store';
import useApp from './hooks/useApp';
import App from './App.jsx';
import Success from './Success.jsx';
import AppContextProvider from './context/AppContext.jsx';
import PrivateRoute from './PrivateRoute.jsx';
import About from './Pages/About.jsx';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import LudoLobby from './Pages/LudoLobby.jsx';
import TicTacToe from './Components/TicTacToe.jsx';

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
