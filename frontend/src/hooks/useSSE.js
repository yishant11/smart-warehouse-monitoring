import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateLiveMetrics,
  setConnectionStatus,
  setConnectionError
} from '../features/dashboard/dashboardSlice';
import { selectIsLive } from '../features/dashboard/dashboardSelectors';
import { API_BASE_URL } from '../config/apiConfig';

export function useSSE(streamUrl = '/api/stream') {
  const dispatch = useDispatch();
  const isLive = useSelector(selectIsLive);
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);

  const fullUrl = streamUrl.startsWith('http') ? streamUrl : `${API_BASE_URL}${streamUrl}`;

  useEffect(() => {
    let isMounted = true;

    function connect() {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      dispatch(setConnectionStatus(retryCountRef.current > 0 ? 'RECONNECTING' : 'CONNECTING'));

      try {
        const eventSource = new EventSource(fullUrl);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          if (!isMounted) return;
          retryCountRef.current = 0;
          dispatch(setConnectionStatus(isLive ? 'CONNECTED' : 'PAUSED'));
        };

        eventSource.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(event.data);
            dispatch(updateLiveMetrics(data));
          } catch (e) {
            console.error('[SSE JSON Parse Error]', e);
          }
        };

        eventSource.onerror = (err) => {
          if (!isMounted) return;
          console.warn('[SSE Connection Error]', err);
          eventSource.close();
          dispatch(setConnectionStatus('RECONNECTING'));
          dispatch(setConnectionError('Connection lost. Reconnecting to telemetry stream...'));

          // Exponential backoff with jitter (1s to max 8s)
          const delay = Math.min(8000, 1000 * Math.pow(1.5, retryCountRef.current));
          retryCountRef.current += 1;

          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMounted) {
              connect();
            }
          }, delay);
        };
      } catch (err) {
        console.error('[SSE Creation Error]', err);
        dispatch(setConnectionStatus('DISCONNECTED'));
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      dispatch(setConnectionStatus('DISCONNECTED'));
    };
  }, [streamUrl, dispatch]);

  return { isLive };
}
