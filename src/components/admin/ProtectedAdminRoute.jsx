import { Navigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';

export default function ProtectedAdminRoute({ children }) {
  const { isAdminAuthenticated } = useAdmin();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
