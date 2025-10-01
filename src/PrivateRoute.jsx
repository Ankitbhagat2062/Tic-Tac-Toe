import { Suspense } from 'react';
import useApp from './hooks/useApp';
import { Navigate } from 'react-router-dom';
// eslint-disable react/prop-types 
const PrivateRoute = ({ children }) => {
  const { token } = useApp();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      {token ? children : <Navigate to={'/login'} />}
    </Suspense>
  );
};

export default PrivateRoute;
