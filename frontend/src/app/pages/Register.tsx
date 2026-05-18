import { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

interface RegisterProps {
  onRegister: (name: string, email: string) => void;
  onSwitchToLogin: () => void;
}

export function Register({ onRegister, onSwitchToLogin }: RegisterProps) {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setSubmitError('');

    if (!name || name.trim().length < 2) {
      setSubmitError('Full name must be at least 2 characters');
      return;
    }

    if (!email || !password || password.length < 6 || password !== confirmPassword) {
      setSubmitError('Please fill all fields correctly and use a password with at least 6 characters');
      return;
    }

    try {

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: name,
          email,
          password,
        }),
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        const backendError = data?.errors ? Object.values(data.errors).flat().join(', ') : data?.message;
        throw new Error(backendError || 'Registration failed');
      }

      alert("Registration Successful");

      onRegister(name, email);

    } catch (error) {

      console.log(error);

      setSubmitError(error instanceof Error ? error.message : 'Registration failed');

    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-[#2563EB] mb-2">
            Pragyan
          </h1>

          <p className="text-[#475569]">
            Create your account to get started
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-[#E2E8F0] p-8">

          <form onSubmit={handleSubmit} className="space-y-5">

            {submitError && (
              <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
                {submitError}
              </div>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              trailingSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              }
            />

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              trailingSlot={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              }
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>

          </form>

          <div className="mt-6 text-center">

            <p className="text-[#475569]">
              Already have an account?{' '}

              <button
                onClick={onSwitchToLogin}
                className="text-[#2563EB] hover:underline"
              >
                Sign in
              </button>

            </p>

          </div>

        </div>

      </div>
    </div>
  );
}