import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user roles and permissions
export type Permission = 
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete'
  | 'roles.view' | 'roles.create' | 'roles.edit' | 'roles.delete'
  | 'departments.view' | 'departments.create' | 'departments.edit' | 'departments.delete'
  | 'processes.view' | 'processes.create' | 'processes.edit' | 'processes.delete'
  | 'files.view' | 'files.upload' | 'files.delete'
  | 'workflows.view' | 'workflows.approve' | 'workflows.reject'
  | 'admin.dashboard' | 'admin.settings';

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'reviewer' | 'user';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  division: string;
  isActive: boolean;
  lastLogin: Date | null;
  permissions: Permission[];
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users database
const mockUsers = [
  {
    id: '1',
    email: 'admin@healthcare.com',
    firstName: 'Dr. Sarah',
    lastName: 'Johnson',
    role: 'super_admin' as UserRole,
    department: 'Administration',
    division: 'Executive',
    isActive: true,
    lastLogin: new Date(),
    permissions: [
      'users.view', 'users.create', 'users.edit', 'users.delete',
      'roles.view', 'roles.create', 'roles.edit', 'roles.delete',
      'departments.view', 'departments.create', 'departments.edit', 'departments.delete',
      'processes.view', 'processes.create', 'processes.edit', 'processes.delete',
      'files.view', 'files.upload', 'files.delete',
      'workflows.view', 'workflows.approve', 'workflows.reject',
      'admin.dashboard', 'admin.settings'
    ] as Permission[]
  },
  {
    id: '2',
    email: 'manager@healthcare.com',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'manager' as UserRole,
    department: 'Quality Assurance',
    division: 'Operations',
    isActive: true,
    lastLogin: new Date(),
    permissions: [
      'users.view', 'departments.view', 'processes.view', 'processes.create', 'processes.edit',
      'files.view', 'files.upload', 'workflows.view', 'workflows.approve'
    ] as Permission[]
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem('hipaa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Mock authentication
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      const authUser = { ...foundUser, lastLogin: new Date() };
      setUser(authUser);
      localStorage.setItem('hipaa_user', JSON.stringify(authUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hipaa_user');
  };

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) || false;
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    hasRole,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}