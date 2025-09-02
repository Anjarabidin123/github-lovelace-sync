import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const LoginPage = () => {
  const { signIn, signInWithUsername, signUp, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    let result;
    if (formData.email.includes('@')) {
      result = await signIn(formData.email, formData.password);
    } else {
      result = await signInWithUsername(formData.email, formData.password);
    }
    
    if (result.error) {
      setError(result.error.message);
    }
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      setIsLoading(false);
      return;
    }

    if (!formData.email || !formData.username || !formData.password || !formData.displayName) {
      setError('Semua field harus diisi');
      setIsLoading(false);
      return;
    }

    const result = await signUp(formData.email, formData.username, formData.password, formData.displayName);
    
    if (result.error) {
      setError(result.error.message);
    } else {
      toast.success('Akun berhasil dibuat! Silakan login dengan username dan password Anda.');
      setIsSignUp(false);
      setFormData({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        displayName: ''
      });
    }
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: { email: resetEmail }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        setError(data.error);
      } else {
        toast.success(data.message);
        setShowForgotPassword(false);
        setResetEmail('');
      }
    } catch (error: any) {
      setError(error.message || 'Terjadi kesalahan saat mengirim email reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Lupa Password</CardTitle>
            <CardDescription>
              Masukkan email untuk reset password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetEmail">Email</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="tokoanjar036@gmail.com atau anjarbdn@gmail.com"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Mengirim...' : 'Kirim Email Reset'}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError('');
                    setResetEmail('');
                  }}
                >
                  Kembali ke Login
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Kasir Toko Anjar</CardTitle>
          <CardDescription>
            {isSignUp ? 'Daftarkan akun baru' : 'Masuk ke sistem kasir'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="displayName">Nama Lengkap</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      displayName: e.target.value 
                    })}
                    placeholder="Nama Lengkap"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      email: e.target.value 
                    })}
                    placeholder="email@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupUsername">Username</Label>
                  <Input
                    id="signupUsername"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      username: e.target.value 
                    })}
                    placeholder="username unik"
                    required
                  />
                </div>
              </>
            )}

            {!isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.email}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    email: e.target.value 
                  })}
                  placeholder="tokoanjar"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Loading...' : (isSignUp ? 'Daftar' : 'Masuk')}
              </Button>
              
              {!isSignUp && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full text-sm" 
                  onClick={() => setShowForgotPassword(true)}
                >
                  Lupa Password?
                </Button>
              )}
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full text-sm" 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setFormData({
                    email: '',
                    username: '',
                    password: '',
                    confirmPassword: '',
                    displayName: ''
                  });
                }}
              >
                {isSignUp ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};