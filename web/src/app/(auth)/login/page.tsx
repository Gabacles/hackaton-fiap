"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "../../../hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { user, login, register, error, loading, initialise } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'TEACHER' | 'STUDENT'>('TEACHER');

  useEffect(() => {
    initialise();
  }, [initialise]);

  useEffect(() => {
    if (user) {
      // Redirect based on role
      if (user.role === 'TEACHER') {
        router.push('/dashboard');
      } else {
        router.push('/student');
      }
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      await register(email, password, role);
    } else {
      await login(email, password);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="bg-white shadow-md rounded-md p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isRegister ? 'Register' : 'Login'} to EduShare
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="mt-1 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {isRegister && (
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                className="mt-1 w-full px-3 py-2 border rounded-md"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="TEACHER">Teacher</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  );
}