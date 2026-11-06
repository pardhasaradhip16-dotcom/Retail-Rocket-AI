import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { isDbConnected } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'retailrocket-secret-key-hackathon-2026';

// Pre-configured in-memory demo accounts for Judges & offline mode
const DEMO_ACCOUNTS = [
  {
    id: 'demo-1',
    name: 'Judge Evaluator',
    email: 'judge@retailrocket.ai',
    passwordHash: bcrypt.hashSync('judge123', 10),
    visitor_id: '1000294',
    role: 'judge'
  },
  {
    id: 'demo-2',
    name: 'Alex Rivera',
    email: 'alex@retailrocket.ai',
    passwordHash: bcrypt.hashSync('audio123', 10),
    visitor_id: '1000290',
    role: 'shopper'
  },
  {
    id: 'demo-3',
    name: 'David Chen',
    email: 'david@retailrocket.ai',
    passwordHash: bcrypt.hashSync('tech123', 10),
    visitor_id: '1000291',
    role: 'shopper'
  }
];

export async function register(req, res) {
  try {
    const { name, email, password, visitor_id } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ detail: "Name, email, and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ detail: "Password must be at least 6 characters" });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const assignedVisitorId = visitor_id || String(1000290 + Math.floor(Math.random() * 45));

    // Check MongoDB if connected
    if (isDbConnected()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ detail: "An account with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        visitor_id: assignedVisitorId,
        role: cleanEmail.includes('judge') ? 'judge' : 'shopper'
      });

      const token = jwt.sign(
        { userId: newUser._id, email: newUser.email, visitorId: newUser.visitor_id },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        status: "success",
        message: "Account created successfully",
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          visitor_id: newUser.visitor_id,
          role: newUser.role
        }
      });
    }

    // In-Memory Fallback
    const existingDemo = DEMO_ACCOUNTS.find(u => u.email === cleanEmail);
    if (existingDemo) {
      return res.status(400).json({ detail: "An account with this email already exists" });
    }

    const newDemoUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      passwordHash: bcrypt.hashSync(password, 10),
      visitor_id: assignedVisitorId,
      role: 'shopper'
    };
    DEMO_ACCOUNTS.push(newDemoUser);

    const token = jwt.sign(
      { userId: newDemoUser.id, email: newDemoUser.email, visitorId: newDemoUser.visitor_id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      status: "success",
      message: "Account created successfully",
      token,
      user: {
        id: newDemoUser.id,
        name: newDemoUser.name,
        email: newDemoUser.email,
        visitor_id: newDemoUser.visitor_id,
        role: newDemoUser.role
      }
    });
  } catch (error) {
    console.error('[Register Error]', error);
    return res.status(500).json({ detail: error.message || "Failed to register" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ detail: "Email and password are required" });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    // 1. Try DB user if connected
    if (isDbConnected()) {
      const user = await User.findOne({ email: cleanEmail });
      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const token = jwt.sign(
            { userId: user._id, email: user.email, visitorId: user.visitor_id },
            JWT_SECRET,
            { expiresIn: '7d' }
          );

          return res.json({
            status: "success",
            message: "Login successful",
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              visitor_id: user.visitor_id,
              role: user.role
            }
          });
        }
      }
    }

    // 2. Check Demo Accounts
    const demoUser = DEMO_ACCOUNTS.find(u => u.email === cleanEmail);
    if (demoUser) {
      const isMatch = bcrypt.compareSync(password, demoUser.passwordHash);
      if (isMatch) {
        const token = jwt.sign(
          { userId: demoUser.id, email: demoUser.email, visitorId: demoUser.visitor_id },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return res.json({
          status: "success",
          message: "Login successful (Demo Account)",
          token,
          user: {
            id: demoUser.id,
            name: demoUser.name,
            email: demoUser.email,
            visitor_id: demoUser.visitor_id,
            role: demoUser.role
          }
        });
      }
    }

    return res.status(401).json({ detail: "Invalid email or password" });
  } catch (error) {
    console.error('[Login Error]', error);
    return res.status(500).json({ detail: error.message || "Failed to login" });
  }
}

export async function getMe(req, res) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ detail: "Not authenticated" });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (isDbConnected()) {
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        return res.json({
          status: "success",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            visitor_id: user.visitor_id,
            role: user.role
          }
        });
      }
    }

    const demoUser = DEMO_ACCOUNTS.find(u => u.id === decoded.userId || u.email === decoded.email);
    if (demoUser) {
      return res.json({
        status: "success",
        user: {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          visitor_id: demoUser.visitor_id,
          role: demoUser.role
        }
      });
    }

    return res.status(404).json({ detail: "User not found" });
  } catch (error) {
    return res.status(401).json({ detail: "Invalid or expired token" });
  }
}

// Quick endpoint returning pre-configured demo credentials for Judges
export function getDemoCredentials(req, res) {
  res.json({
    credentials: [
      {
        role: "Judge / Evaluator",
        email: "judge@retailrocket.ai",
        password: "judge123",
        visitor_id: "1000294",
        persona: "Sarah - Creative Pro (Mac & Productivity)"
      },
      {
        role: "Shopper (Audio Tech)",
        email: "alex@retailrocket.ai",
        password: "audio123",
        visitor_id: "1000290",
        persona: "Alex - Audio Enthusiast (Sony XM5, Bose, JBL)"
      },
      {
        role: "Shopper (Work & Computing)",
        email: "david@retailrocket.ai",
        password: "tech123",
        visitor_id: "1000291",
        persona: "David - IT Computing (Keychron, Logitech MX)"
      }
    ]
  });
}

