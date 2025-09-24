import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
const useApp = () => useContext(AppContext);
export default useApp;
