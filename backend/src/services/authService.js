const { generateToken, verifyToken } = require('../utils/jwt');

// In-memory demo user store
const DEMO_USERS = [
  {
    id: 'usr_admin_01',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin Operator',
    role: 'Lead Operations Engineer',
    department: 'Smart Warehouse Logistics',
    accessLevel: 'Full System Control (Tier 3)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

// In-memory session tracker
const activeSessions = new Map();

class AuthService {
  login(email, password, clientInfo = {}) {
    const user = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password. Please use admin@example.com / admin123'
      };
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      accessLevel: user.accessLevel
    };

    const token = generateToken(payload);
    const sessionRecord = {
      sessionId: `sess_${Date.now()}`,
      userId: user.id,
      email: user.email,
      loginTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ipAddress: clientInfo.ip || '127.0.0.1 (Localhost)',
      userAgent: clientInfo.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'ACTIVE'
    };

    activeSessions.set(token, sessionRecord);

    return {
      success: true,
      token,
      user: payload,
      session: sessionRecord
    };
  }

  logout(token) {
    if (token && activeSessions.has(token)) {
      const session = activeSessions.get(token);
      session.status = 'TERMINATED';
      session.logoutTime = new Date().toISOString();
      activeSessions.delete(token);
    }
    return { success: true, message: 'Logged out successfully.' };
  }

  getSession(token) {
    const decoded = verifyToken(token);
    if (!decoded) {
      if (token) activeSessions.delete(token);
      return { success: false, message: 'Session expired or invalid.' };
    }

    const session = activeSessions.get(token) || {
      sessionId: `sess_restored_${Date.now()}`,
      userId: decoded.id,
      email: decoded.email,
      loginTime: new Date(decoded.iat * 1000).toISOString(),
      lastActivity: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Localhost)',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      status: 'ACTIVE'
    };

    session.lastActivity = new Date().toISOString();

    return {
      success: true,
      user: decoded,
      session: session,
      tokenExpiresAt: new Date(decoded.exp * 1000).toISOString()
    };
  }

  getActiveSessions() {
    return Array.from(activeSessions.values());
  }
}

const authService = new AuthService();

module.exports = authService;
