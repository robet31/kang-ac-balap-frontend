import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onBack: () => void;
}

export function LoginPage({ onBack }: LoginPageProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
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
      
      if (loginError.message.includes('Invalid login credentials')) {
        // Special message for admin credentials
        if (loginEmail === 'admin@sunest.com') {
          setError('⚠️ Admin user belum dibuat di database! Silakan buka file ADMIN_SETUP.md di project root untuk instruksi lengkap membuat admin user.');
        } else {
          setError('Login gagal: Email atau password yang Anda masukkan salah. Silakan periksa kembali.');
        }
      } else if (loginError.message.includes('Email not confirmed')) {
        setError('Email Anda belum dikonfirmasi. Silakan cek inbox email Anda.');
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
    onBack();
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Validation
    if (!signupEmail || !signupPassword || !signupFullName) {
      setError('Nama lengkap, email, dan password wajib diisi');
      setLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Password yang Anda masukkan tidak cocok. Silakan coba lagi.');
      setLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password minimal harus 6 karakter untuk keamanan akun Anda');
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

    // Switch to login mode
    setMode('login');
    setLoginEmail(signupEmail);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header Section */}
          <div className="bg-gradient-to-br from-primary via-accent to-primary p-8 text-white relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative z-10">
              <Button
                onClick={onBack}
                variant="ghost"
                className="mb-4 -ml-2 text-white hover:bg-white/20"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali ke Beranda
              </Button>

              <h1 className="text-4xl font-bold mb-2">YAMAHA</h1>
              <p className="text-white/90 text-lg">
                Authorized Service Center
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Tab Selector */}
            <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl">
              <button
                onClick={() => setMode('login')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Masuk ke Akun
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-gray-900 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Buat Akun Baru
              </button>
            </div>

            {/* Info Message */}
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.div
                  key="login-info"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 space-y-3"
                >
                  {/* Demo Admin Auto-Fill */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-purple-900 mb-1">
                          🔧 Demo Admin
                        </p>
                        <p className="text-xs text-purple-700">
                          admin@demo.com
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-white border-purple-300 text-purple-700 hover:bg-purple-50 hover:border-purple-400"
                        onClick={() => {
                          setLoginEmail('admin@demo.com');
                          setLoginPassword('password123');
                          toast.info('Admin credentials loaded!');
                        }}
                      >
                        Auto Fill
                      </Button>
                    </div>
                  </div>
                  
                  {/* Demo Customer Auto-Fill */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          👤 Demo Customer
                        </p>
                        <p className="text-xs text-blue-700">
                          customer@demo.com
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-white border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                        onClick={() => {
                          setLoginEmail('customer@demo.com');
                          setLoginPassword('password123');
                          toast.info('Customer credentials loaded!');
                        }}
                      >
                        Auto Fill
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup-info"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-green-50 border-2 border-green-200 rounded-xl p-4"
                >
                  <p className="text-sm text-green-900 leading-relaxed">
                    <strong className="font-semibold">Buat Akun Baru:</strong> Daftar sekarang untuk booking service motor, tracking progress real-time, dan nikmati berbagai promo menarik.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error Alert */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Alert variant="destructive" className="mb-6 border-2">
                    <AlertDescription className="text-sm leading-relaxed">{error}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleLogin}
                  className="space-y-5"
                >
                  <div>
                    <Label htmlFor="login-email" className="text-base font-semibold text-gray-800 mb-2 block">
                      Alamat Email
                    </Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Contoh: nama@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="h-12 text-base border-2 focus:border-primary rounded-xl"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Gunakan email yang terdaftar</p>
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="text-base font-semibold text-gray-800 mb-2 block">
                      Password
                    </Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Masukkan password Anda"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="h-12 text-base border-2 focus:border-primary rounded-xl"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Minimal 6 karakter</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity rounded-xl font-bold shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sedang memproses...
                      </>
                    ) : (
                      'Masuk ke Dashboard'
                    )}
                  </Button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSignup}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="signup-name" className="text-base font-semibold text-gray-800 mb-2 block">
                      Nama Lengkap
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Contoh: Budi Santoso"
                      value={signupFullName}
                      onChange={(e) => setSignupFullName(e.target.value)}
                      className="h-12 text-base border-2 focus:border-primary rounded-xl"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Nama ini akan muncul di profil Anda</p>
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-base font-semibold text-gray-800 mb-2 block">
                      Alamat Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Contoh: budi@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="h-12 text-base border-2 focus:border-primary rounded-xl"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Gunakan email aktif untuk notifikasi service</p>
                  </div>

                  <div>
                    <Label htmlFor="signup-phone" className="text-base font-semibold text-gray-800 mb-2 block">
                      Nomor Telepon <span className="text-gray-400 text-sm font-normal">(Opsional)</span>
                    </Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={signupPhone}
                      onChange={(e) => setSignupPhone(e.target.value)}
                      className="h-12 text-base border-2 focus:border-primary rounded-xl"
                    />
                    <p className="text-xs text-gray-500 mt-1.5">Kami akan hubungi Anda jika ada update penting</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="signup-password" className="text-base font-semibold text-gray-800 mb-2 block">
                        Password
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Min. 6 karakter"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="h-12 text-base border-2 focus:border-primary rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="signup-confirm-password" className="text-base font-semibold text-gray-800 mb-2 block">
                        Ulangi Password
                      </Label>
                      <Input
                        id="signup-confirm-password"
                        type="password"
                        placeholder="Sama dengan di kiri"
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        className="h-12 text-base border-2 focus:border-primary rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Password harus sama di kedua kolom</p>

                  <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mt-4">
                    <p className="text-sm text-amber-900 leading-relaxed">
                      <strong className="font-semibold">Catatan Penting:</strong> Anda akan terdaftar sebagai customer. Akun teknisi hanya bisa dibuat oleh admin bengkel melalui dashboard.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity rounded-xl font-bold shadow-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sedang membuat akun...
                      </>
                    ) : (
                      'Daftar Sekarang'
                    )}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}