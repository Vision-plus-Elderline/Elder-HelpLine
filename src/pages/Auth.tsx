import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Phone, Shield, Users } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [emailOrEmpId, setEmailOrEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [empId, setEmpId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [resetEmailOrEmpId, setResetEmailOrEmpId] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { user, signIn, signUp, resetPassword, updatePassword, isRecovering } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Sync with global recovery state from Supabase
    if (isRecovering) {
      setIsUpdatingPassword(true);
    }
  }, [isRecovering]);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isUpdatingPassword) {
        const { error } = await updatePassword(newPassword);
        if (error) {
          toast({
            title: "Update failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Password updated!",
            description: "You can now login with your new password."
          });
          setIsUpdatingPassword(false);
          setIsLogin(true);
          navigate('/auth');
        }
        return;
      }

      if (isForgotPassword) {
        const { error } = await resetPassword(resetEmailOrEmpId);
        if (error) {
          toast({
            title: "Reset failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Reset link sent!",
            description: "Check your email for the password reset link."
          });
          setIsForgotPassword(false);
        }
        return;
      }

      if (isLogin) {
        const { error, isAdmin } = await signIn(emailOrEmpId, password);
        if (error) {
          toast({
            title: "Login failed",
            description: error.message,
            variant: "destructive"
          });
        } else {
          toast({
            title: "Welcome back!",
            description: "You have successfully logged in."
          });
          if (isAdmin) {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }
      } else {
        if (!fullName.trim()) {
          toast({
            title: "Name required",
            description: "Please enter your full name.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        if (!empId.trim()) {
          toast({
            title: "Employee ID required",
            description: "Please enter your unique Employee ID.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(emailOrEmpId, password, fullName, empId);
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Please login instead.",
              variant: "destructive"
            });
          } else if (error.message.includes('Email not confirmed') || error.message.includes('confirm your email')) {
            toast({
              title: "Account created!",
              description: "Please check your email to confirm your account before logging in.",
            });
            setIsLogin(true);
          } else {
            toast({
              title: "Signup failed",
              description: error.message,
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Welcome!",
            description: "Your account has been created and you are now logged in."
          });
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-gradient-to-br from-blue-400 to-green-400 backdrop-blur-2xl' 
    style={{
            backgroundImage: 'url(/logo/train.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat',

          }}
    
    >
      <div className="min-h-screen flex ">
        {/* Left Column - Background Image */}
        <div
          className="hidden p-5 lg:flex lg:w-1/2 relative rounded-xl h-[100vh] "
          style={{
            // backgroundImage: 'url(/logo/train.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',

          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0  backdrop-blur-xs " />
          
          {/* <h1 className="text-teal-600 border-white  text-6xl font-bold absolute top-20 left-20" style={{objectFit: 'contain', position: 'absolute', top: '90%', left: '40%', transform: 'translate(-50%, -50%)'}}>
            Vision Plus</h1> */}
{/*             
<img src="/logo/vision.png" alt="Vpsc" className="w-[100%] h-40 mb-4 item-center border-white" 
style={{objectFit: 'contain', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}} />
          */}
          {/* Logo and branding on left side */}

        </div>

        {/* Right Column - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-6  ">
          {/* <div className="w-full lg:w-1/2 flex items-center justify-center p-4 bg-gradient-to-br from-[#a95b47] via-[#8a7068] to-[#068d90]"> */}

          <div className="w-full max-w-md">
            {/* Mobile Logo - Only visible on small screens */}
            <div className=" text-center mb-8">
              <div className='flex items-center justify-center gap-3 '>
                <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-emerald-500 border border-green-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-5xl font-display font-bold text-teal-600 items-baseline">
                  Elder Line
                </h1>
                
              </div>
              {/* <img src="/logo/vision.png" alt="" className="w-25 h-12" /> */}
              
              </div>
             
              <p className="text-teal-400 text-2xl font-bold">Training Assessment Portal</p>
            
            </div>

            <Card className="bg-white border-gray-200   shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold text-green-600">
                  {isUpdatingPassword ? 'Set New Password' : (isForgotPassword ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account'))}
                </CardTitle>
                <CardDescription className="text-gray-500">
                  {isUpdatingPassword
                    ? 'Enter your new password below'
                    : (isForgotPassword
                      ? 'Enter your Email or Employee ID to receive a reset link'
                      : (isLogin
                        ? 'Login to access your assessment'
                        : 'Register to take the training assessment'))}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isUpdatingPassword ? (
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-gray-900">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 pr-10"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : isForgotPassword ? (
                    <div className="space-y-2">
                      <Label htmlFor="resetEmail" className="text-gray-900">Email or Employee ID</Label>
                      <Input
                        id="resetEmail"
                        type="text"
                        placeholder="Enter email or employee ID"
                        value={resetEmailOrEmpId}
                        onChange={(e) => setResetEmailOrEmpId(e.target.value)}
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                        required
                      />
                    </div>
                  ) : (
                    <>
                      {!isLogin && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="fullName" className="text-gray-900">Full Name</Label>
                            <Input
                              id="fullName"
                              type="text"
                              placeholder="Enter your full name"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                              required={!isLogin}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="empId" className="text-gray-900">Employee ID</Label>
                            <Input
                              id="empId"
                              type="text"
                              placeholder="Enter unique Employee ID"
                              value={empId}
                              onChange={(e) => setEmpId(e.target.value)}
                              className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                              required={!isLogin}
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-900">
                          {isLogin ? 'Email or Employee ID' : 'Email'}
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          data-testid="login-input"
                          type={isLogin ? 'text' : 'email'}
                          placeholder={isLogin ? "Enter email or employee ID" : "Enter your email"}
                          value={emailOrEmpId}
                          onChange={(e) => setEmailOrEmpId(e.target.value)}
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password" className="text-gray-900">Password</Label>
                          {isLogin && (
                            <button
                              type="button"
                              onClick={() => setIsForgotPassword(true)}
                              className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
                            >
                              Forgot Password?
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 pr-10"
                            required
                            minLength={6}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Please wait...' : (isUpdatingPassword ? 'Update Password' : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Login' : 'Create Account')))}
                  </Button>

                  {(isForgotPassword || isUpdatingPassword) && (
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full text-gray-600"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setIsUpdatingPassword(false);
                      }}
                    >
                      Back to Login
                    </Button>
                  )}
                </form>

                {!(isForgotPassword || isUpdatingPassword) && (
                  <div className="mt-6 text-center space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-emerald-600 hover:text-emerald-700 text-sm transition-colors"
                    >
                      {isLogin
                        ? "Don't have an account? Create one"
                        : "Already have an account? Login"}
                    </button>
                    {isLogin && (
                      <div className="pt-2 border-t border-gray-100">
                        <p className="text-xs text-gray-500 mb-1">Forgot your Employee ID?</p>
                        <p className="text-xs text-gray-600 font-medium">Please contact your administrator for recovery.</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Features */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-md">
                <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Secure Assessment</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-center shadow-md">
                <Users className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">One Attempt Only</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  );
};

export default Auth;
