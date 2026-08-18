import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSummary } from '../features/dashboard/dashboardSlice';
import { fetchAlerts } from '../features/alerts/alertsSlice';
import { selectRefreshInterval } from '../features/settings/settingsSlice';

export function usePolling() {
  const dispatch = useDispatch();
  const refreshIntervalSeconds = useSelector(selectRefreshInterval) || 10;
  const timerRef = useRef(null);

  useEffect(() => {
    // Initial fetch on mount
    dispatch(fetchSummary());
    dispatch(fetchAlerts());

    // Recurring periodic polling interval
    const intervalMs = Math.max(3000, refreshIntervalSeconds * 1000);

    timerRef.current = setInterval(() => {
      dispatch(fetchSummary());
      dispatch(fetchAlerts());
    }, intervalMs);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [dispatch, refreshIntervalSeconds]);
}
