import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const TOKEN_KEY = 'warehouse_auth_token';
const USER_KEY = 'warehouse_auth_user';

// Initialize state from localStorage
const storedToken = localStorage.getItem(TOKEN_KEY);
const storedUser = localStorage.getItem(USER_KEY) ? JSON.parse(localStorage.getItem(USER_KEY)) : null;

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return rejectWithValue(data.message || 'Login failed.');
      }

      // Persist to localStorage
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));

      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error during login.');
    }
  }
);

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token || localStorage.getItem(TOKEN_KEY);
      if (!token) {
        return rejectWithValue('No token found.');
      }

      const response = await fetch('/api/auth/session', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        return rejectWithValue(data.message || 'Session expired.');
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to verify session.');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { getState }) => {
    try {
      const token = getState().auth.token;
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (e) {
      console.warn('Logout API error:', e);
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
    return true;
  }
);

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
  sessionStatus: storedToken ? 'ACTIVE' : 'IDLE',
  session: null,
  tokenExpiresAt: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
    expireSession: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.sessionStatus = 'EXPIRED';
      state.error = 'Session has expired. Please sign in again.';
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.session = action.payload.session;
        state.isAuthenticated = true;
        state.sessionStatus = 'ACTIVE';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Invalid credentials';
        state.isAuthenticated = false;
      })

      // Check Session
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.tokenExpiresAt = action.payload.tokenExpiresAt;
        state.isAuthenticated = true;
        state.sessionStatus = 'ACTIVE';
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.sessionStatus = 'EXPIRED';
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.session = null;
        state.sessionStatus = 'IDLE';
        state.error = null;
      });
  }
});

export const { clearAuthError, expireSession } = authSlice.actions;
export default authSlice.reducer;
