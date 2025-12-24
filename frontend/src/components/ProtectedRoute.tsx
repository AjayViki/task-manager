import { Navigate } from "react-router-dom";
import { useAppSelector } from "../store/hooks";
import { ReactElement } from "react";

interface Props {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: Props): ReactElement => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
