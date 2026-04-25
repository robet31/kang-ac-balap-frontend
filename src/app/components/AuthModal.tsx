import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Wrench, Mail, Lock, User, Phone, AlertCircle, Loader2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function AuthModal({ onClose, defaultTab = 'login' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!loginEmail || !loginPassword) {
      setError('Email dan password harus diisi');
      setLoading(false);
      return;
    }

    const { error: loginError } = await signIn(loginEmail, loginPassword);

    if (loginError) {
      console.error('Login error:', loginError);
      
      // Provide helpful error messages
      if (loginError.message.includes('Invalid login credentials')) {
        setError('❌ Login gagal: Email atau password salah.');
      } else if (loginError.message.includes('Email not confirmed')) {
        setError('❌ Email belum dikonfirmasi.');
      } else {
        setError(loginError.message || 'Login gagal. Periksa email dan password Anda.');
      }
      
      setLoading(false);
      return;
    }

    toast.success('Login berhasil!', {
      description: 'Selamat datang kembali di YAMAHA Service Center',
    });
    
    setLoading(false);
    onClose();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!signupEmail || !signupPassword || !signupFullName) {
      setError('Semua field wajib diisi');
      setLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Password tidak cocok');
      setLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password minimal 6 karakter');
      setLoading(false);
      return;
    }

    const { error: signupError } = await signUp(
      signupEmail,
      signupPassword,
      signupFullName,
      'customer' // Always customer, technician added by admin
    );

    if (signupError) {
      setError(signupError.message || 'Registrasi gagal. Coba lagi.');
      setLoading(false);
      return;
    }

    toast.success('Registrasi berhasil!', {
      description: 'Akun Anda telah dibuat. Silakan login.',
    });

    // Switch to login tab
    setActiveTab('login');
    setLoginEmail(signupEmail);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-[95vw] sm:max-w-md md:max-w-lg my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border-0 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:rotate-90 duration-300"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <CardHeader className="text-center bg-gradient-to-br from-primary via-accent to-primary text-white pb-6 pt-8 sm:pb-8 sm:pt-10">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.1, damping: 15 }}
                className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mb-3 sm:mb-4 shadow-lg"
              >
                <Wrench className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CardTitle className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">MotoCare Pro</CardTitle>
                <CardDescription className="text-gray-100 text-sm sm:text-base">
                  Platform bengkel digital terpercaya
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="p-4 sm:p-6 md:p-8 overflow-y-auto">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 p-1 bg-gray-100">
                  <TabsTrigger 
                    value="login"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm sm:text-base py-2"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-sm sm:text-base py-2"
                  >
                    Daftar
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <Alert variant="destructive" className="mb-3 sm:mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Login Tab */}
                <TabsContent value="login">
                  <motion.form
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleLogin}
                    className="space-y-3 sm:space-y-5"
                  >
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="login-email" className="text-xs sm:text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="email@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-9 sm:pl-11 h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="login-password" className="text-xs sm:text-sm font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-9 sm:pl-11 h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity mt-4 sm:mt-6"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        'Login'
                      )}
                    </Button>

                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 text-center">Demo Accounts</p>
                      <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-xs text-gray-600">
                        <div className="flex justify-between items-center bg-white/60 px-2 sm:px-3 py-1.5 sm:py-2 rounded gap-2">
                          <span className="font-medium whitespace-nowrap">Customer:</span>
                          <span className="font-mono text-right truncate">customer@demo.com</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/60 px-2 sm:px-3 py-1.5 sm:py-2 rounded gap-2">
                          <span className="font-medium whitespace-nowrap">Admin:</span>
                          <span className="font-mono text-right truncate">admin@demo.com</span>
                        </div>
                        <p className="text-center text-gray-500 pt-1 text-[10px] sm:text-xs">Password: <code className="bg-white px-1.5 sm:px-2 py-0.5 rounded">password123</code></p>
                      </div>
                    </div>
                  </motion.form>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <motion.form
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleSignup}
                    className="space-y-3 sm:space-y-4"
                  >
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="signup-name" className="text-xs sm:text-sm font-medium">Nama Lengkap</Label>
                      <div className="relative">
                        <User className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={signupFullName}
                          onChange={(e) => setSignupFullName(e.target.value)}
                          className="pl-9 sm:pl-11 h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="signup-email" className="text-xs sm:text-sm font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="email@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-9 sm:pl-11 h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="signup-phone" className="text-xs sm:text-sm font-medium">No. Telepon <span className="text-gray-400 text-[10px] sm:text-xs">(Opsional)</span></Label>
                      <div className="relative">
                        <Phone className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="08123456789"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          className="pl-9 sm:pl-11 h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="signup-password" className="text-xs sm:text-sm font-medium">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            className="pl-9 sm:pl-11 h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="signup-confirm-password" className="text-xs sm:text-sm font-medium">Konfirmasi</Label>
                        <div className="relative">
                          <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                          <Input
                            id="signup-confirm-password"
                            type="password"
                            placeholder="••••••••"
                            value={signupConfirmPassword}
                            onChange={(e) => setSignupConfirmPassword(e.target.value)}
                            className="pl-9 sm:pl-11 h-10 sm:h-12 text-sm sm:text-base border-2 focus:border-primary"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                      <p className="text-xs text-blue-800">
                        <strong>Info:</strong> Akun teknisi dibuat oleh admin. Silakan daftar sebagai customer terlebih dahulu.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 sm:h-12 text-sm sm:text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity mt-4 sm:mt-6"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        'Daftar Sekarang'
                      )}
                    </Button>
                  </motion.form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}