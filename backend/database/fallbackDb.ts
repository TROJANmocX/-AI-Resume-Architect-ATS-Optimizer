import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const FALLBACK_DB_PATH = path.join(__dirname, 'db_fallback.json');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Helper to check if Mongoose is connected
export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  subscriptionStatus: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  createdAt: string;
}

interface ResumeData {
  _id: string;
  userId: string;
  resumeData: any;
  jdText?: string;
  analysis?: any;
  lastModified: string;
}

interface TemplateData {
  _id: string;
  name: string;
  description: string;
  resumeData: any;
  createdAt: string;
}

interface FallbackDb {
  users: UserData[];
  resumes: ResumeData[];
  templates: TemplateData[];
}

function loadDb(): FallbackDb {
  try {
    if (!fs.existsSync(FALLBACK_DB_PATH)) {
      const initial: FallbackDb = { users: [], resumes: [], templates: [] };
      fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(initial, null, 2));
      return initial;
    }
    const data = fs.readFileSync(FALLBACK_DB_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    if (!parsed.templates) {
      parsed.templates = [];
    }
    return parsed;
  } catch (err) {
    console.error('Error loading fallback DB, resetting...', err);
    const initial: FallbackDb = { users: [], resumes: [], templates: [] };
    return initial;
  }
}

function saveDb(db: FallbackDb) {
  try {
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving fallback DB:', err);
  }
}

// Generate a random string ID
function generateId(): string {
  return 'fallback-' + Math.random().toString(36).substr(2, 9);
}

// Fallback registration
export async function fallbackRegister(reqBody: any) {
  const { name, email, password } = reqBody;
  const db = loadDb();

  const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('An account with this email already exists');
  }

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser: UserData = {
    _id: generateId(),
    name,
    email: email.toLowerCase(),
    passwordHash,
    subscriptionStatus: 'none',
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    stripePriceId: null,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDb(db);

  const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      subscriptionStatus: newUser.subscriptionStatus
    }
  };
}

// Fallback login
export async function fallbackLogin(reqBody: any) {
  const { email, password } = reqBody;
  const db = loadDb();

  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      subscriptionStatus: user.subscriptionStatus
    }
  };
}

// Fallback getUser
export async function fallbackGetUser(userId: string) {
  const db = loadDb();
  const user = db.users.find(u => u._id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    subscriptionStatus: user.subscriptionStatus
  };
}

// Fallback save resume
export async function fallbackSaveResume(reqBody: any) {
  const { userId, resumeData, jdText, analysis } = reqBody;
  const db = loadDb();

  let resume = db.resumes.find(r => r.userId === userId);
  if (resume) {
    resume.resumeData = resumeData;
    resume.jdText = jdText;
    resume.analysis = analysis;
    resume.lastModified = new Date().toISOString();
  } else {
    resume = {
      _id: generateId(),
      userId,
      resumeData,
      jdText,
      analysis,
      lastModified: new Date().toISOString()
    };
    db.resumes.push(resume);
  }

  saveDb(db);
  return resume;
}

// Fallback templates helper - get all registered templates
export async function fallbackGetTemplates() {
  const db = loadDb();
  return db.templates || [];
}

// Fallback templates helper - register a template
export async function fallbackRegisterTemplate(reqBody: any) {
  const { name, description, resumeData } = reqBody;
  const db = loadDb();

  const newTemplate: TemplateData = {
    _id: generateId(),
    name,
    description,
    resumeData,
    createdAt: new Date().toISOString(),
  };

  if (!db.templates) {
    db.templates = [];
  }

  db.templates.push(newTemplate);
  saveDb(db);

  return newTemplate;
}
