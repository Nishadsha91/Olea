import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AdminRoute({ children }) {

  const { isLoggedIn, user } = useContext(AuthContext);
  
  const isAdmin = isLoggedIn && user?.role === 'admin';
  return isAdmin ? children : <Navigate to="/" />;
  
}
 