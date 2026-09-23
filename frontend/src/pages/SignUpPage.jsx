import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Mail, Phone, Lock, Eye, EyeOff, Check, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { referralAPI } from '../services/api';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [referrerValid, setReferrerValid] = useState(false);
  const [positionValid, setPositionValid] = useState(false);
  const [checkingReferrer, setCheckingReferrer] = useState(false);
  
  // Get referral info from URL params
  const referrerUsername = searchParams.get('ref') || searchParams.get('referrer') || '';
  const position = searchParams.get('pos') || searchParams.get('position') || 'left';
  
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referred_by: referrerUsername,
    position: position,
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});

  // Validate referrer on component mount
  useEffect(() => {
    const validateReferrer = async () => {
      if (!formData.referred_by) return;
      
      setCheckingReferrer(true);
      try {
        // Validate referrer exists
        const response = await referralAPI.validate(formData.referred_by);
        if (response.success && response.exists) {
          setReferrerValid(true);
          
          // Check if position is available
          const posResponse = await referralAPI.checkPosition(formData.referred_by, formData.position);
          if (posResponse.success) {
            setPositionValid(posResponse.available);
            if (!posResponse.available) {
              setErrors(prev => ({ ...prev, position: `${formData.position} position already filled` }));
            }
          }
        } else {
          setReferrerValid(false);
          setErrors(prev => ({ ...prev, referred_by: 'Invalid referrer username' }));
        }
      } catch (err) {
        setReferrerValid(false);
        setErrors(prev => ({ ...prev, referred_by: 'Could not validate referrer' }));
      } finally {
        setCheckingReferrer(false);
      }
    };

    validateReferrer();
  }, [formData.referred_by, formData.position]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/[^0-9]/g, ''))) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.referred_by.trim()) {
      newErrors.referred_by = 'Referrer username is required';
    } else if (!referrerValid) {
      newErrors.referred_by = 'Invalid referrer username';
    }

    if (!['left', 'right'].includes(formData.position)) {
      newErrors.position = 'Position must be left or right';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const registrationData = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile.replace(/[^0-9]/g, ''),
        password: formData.password,
        confirm_password: formData.confirmPassword,
        referred_by: formData.referred_by,
        position: formData.position
      };

      const result = await signup(registrationData);
      
      if (result.success) {
        alert('Account created successfully!');
        navigate('/account');
      } else {
        setErrors({ submit: result.error || 'Registration failed' });
      }
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-8 md:py-12">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-gray-900 mb-3 md:mb-4">
              Create Account
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Join Karuda and start your fashion journey
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Error Message */}
              {errors.submit && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Referral Info */}
              {formData.referred_by && (
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Referred by: {formData.referred_by}</p>
                      <p className="text-xs text-gray-600 mt-1">Position: {formData.position === 'left' ? 'Left Leg' : 'Right Leg'}</p>
                      {checkingReferrer && <p className="text-xs text-primary-600 mt-1">Validating referrer...</p>}
                      {referrerValid && <p className="text-xs text-green-600 mt-1">✓ Referrer validated</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a unique username"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base ${
                    errors.username ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                  }`}
                  required
                />
                {errors.username && (
                  <p className="mt-1 text-xs text-red-600">{errors.username}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Min 3 characters, no spaces</p>
              </div>

              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base ${
                    errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base ${
                    errors.mobile ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                  }`}
                  required
                />
                {errors.mobile && (
                  <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
                )}
              </div>

              {/* Referrer Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Users className="w-4 h-4" />
                  Referred By * {referrerValid && <span className="text-green-600 text-xs">✓</span>}
                </label>
                <input
                  type="text"
                  name="referred_by"
                  value={formData.referred_by}
                  onChange={handleChange}
                  placeholder="Referrer's username"
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base ${
                    errors.referred_by ? 'border-red-300 focus:border-red-500' : 
                    referrerValid ? 'border-green-300 focus:border-green-500 bg-green-50' :
                    'border-gray-200 focus:border-primary-500'
                  } ${referrerUsername ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  required
                  disabled={!!referrerUsername}
                  readOnly={!!referrerUsername}
                />
                {errors.referred_by && (
                  <p className="mt-1 text-xs text-red-600">{errors.referred_by}</p>
                )}
                {referrerUsername && (
                  <p className="mt-1 text-xs text-gray-500">🔒 Locked from referral link</p>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Position *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-colors ${
                    formData.position === 'left' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
                  } ${referrerUsername ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-primary-300'}`}>
                    <input
                      type="radio"
                      name="position"
                      value="left"
                      checked={formData.position === 'left'}
                      onChange={handleChange}
                      disabled={!!referrerUsername}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">Left Leg</span>
                  </label>
                  <label className={`flex items-center justify-center gap-2 p-3 border-2 rounded-lg transition-colors ${
                    formData.position === 'right' ? 'border-primary-600 bg-primary-50' : 'border-gray-200'
                  } ${referrerUsername ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-primary-300'}`}>
                    <input
                      type="radio"
                      name="position"
                      value="right"
                      checked={formData.position === 'right'}
                      onChange={handleChange}
                      disabled={!!referrerUsername}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">Right Leg</span>
                  </label>
                </div>
                {errors.position && (
                  <p className="mt-1 text-xs text-red-600">{errors.position}</p>
                )}
                {referrerUsername && (
                  <p className="mt-1 text-xs text-gray-500">🔒 Locked from referral link</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base ${
                      errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className={`w-full px-4 py-3 pr-12 border-2 rounded-lg focus:outline-none transition-colors text-sm md:text-base ${
                      errors.confirmPassword ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-primary-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${
                      errors.agreeToTerms ? 'border-red-300' : 'border-gray-300 peer-checked:border-primary-600 peer-checked:bg-primary-600'
                    }`}>
                      {formData.agreeToTerms && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:underline font-medium">
                      Terms and Conditions
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="mt-1 text-xs text-red-600">{errors.agreeToTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-accent-600 text-white py-4 rounded-lg font-bold text-sm md:text-base hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                Create Account
              </button>

              {/* Divider */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs md:text-sm">
                  <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                </div>
              </div>

              {/* Login Link */}
              <Link
                to="/account"
                className="block w-full text-center py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm md:text-base hover:border-primary-600 hover:text-primary-600 transition-colors"
              >
                Sign In
              </Link>
            </form>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-xs md:text-sm text-gray-500">
              By creating an account, you'll enjoy exclusive benefits, faster checkout, and order tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
