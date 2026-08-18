import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading, selectSessionStatus } from '../../features/auth/authSelectors';
import { checkSession } from '../../features/auth/authSlice';

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const sessionStatus = useSelector(selectSessionStatus);

  useEffect(() => {
    // Re-verify session on protected route entry if token exists
    if (isAuthenticated && sessionStatus !== 'EXPIRED') {
      dispatch(checkSession());
    }
  }, [dispatch, isAuthenticated, sessionStatus]);

  if (!isAuthenticated || sessionStatus === 'EXPIRED') {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
