'use client';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import Section from '@/components/ui/Section';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(s => s.login);
  const signup = useAuthStore(s => s.signup);
  const router = useRouter();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    if (isSignup) {
      const { error } = await signup(email, password, name);
      if (error) { setError(error); setLoading(false); return; }
    } else {
      const { error } = await login(email, password);
      if (error) { setError(error); setLoading(false); return; }
    }
    setLoading(false);
    router.push('/account');
  };

  return (
    <Section className="py-16">
      <div className='max-w-md mx-auto bg-white p-10 rounded-2xl border border-blush/30 shadow-sm'>
        <h2 className="font-heading text-3xl mb-8 text-center text-primary">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-3 rounded-xl">{error}</p>}
        
        {isSignup && (
          <Input placeholder='Full Name' value={name} onChange={(e: any) => setName(e.target.value)} className='mb-4' />
        )}
        <Input placeholder='Email' type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} className='mb-4' />
        <Input placeholder='Password' type='password' value={password} onChange={(e: any) => setPassword(e.target.value)} className='mb-6' />
        <Button className='w-full mb-4' onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Login')}
        </Button>
        
        <p className="text-center text-secondary text-sm">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => { setIsSignup(!isSignup); setError(''); }} className="text-gold font-medium hover:underline">
            {isSignup ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </Section>
  );
}
