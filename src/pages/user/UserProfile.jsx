import React, { useState, useEffect, useRef } from 'react';
import UserPanelLayout from '../../components/user/UserPanelLayout';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';
import { 
  FaUser, FaCamera, FaUpload, FaTrash, FaEdit, FaSave, 
  FaTimes, FaLock, FaEye, FaEyeSlash 
} from 'react-icons/fa';
import '../../styles/UserProfile.css';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    profile_photo: null,
    date_of_birth: '',
    gender: '',
    city: '',
    state: '',
    pincode: '',
    address: ''
  });

  const [originalData, setOriginalData] = useState({});
  
  // Photo states
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Password states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  });

  // Confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationType, setConfirmationType] = useState('');
  const [confirmationData, setConfirmationData] = useState(null);

  // Messages
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load user profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.username) return;
      
      try {
        setLoading(true);
        const response = await userAPI.getProfile(user.username);
        if (response.success && response.user) {
          const userData = response.user;
          setProfileData({
            name: userData.name || '',
            email: userData.email || '',
            mobile: userData.mobile || '',
            profile_photo: userData.profile_photo || null,
            date_of_birth: userData.date_of_birth || '',
            gender: userData.gender || '',
            city: userData.city || '',
            state: userData.state || '',
            pincode: userData.pincode || '',
            address: userData.address || ''
          });
          setOriginalData({ ...userData });
          setPhotoPreview(userData.profile_photo);
        }
      } catch (error) {
        showMessage('error', 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.username]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Photo upload from file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setConfirmationType('error');
      setConfirmationData({
        title: 'Invalid File Type',
        message: 'Please upload an image file (JPG, PNG, or WEBP).'
      });
      setShowConfirmModal(true);
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setConfirmationType('error');
      setConfirmationData({
        title: 'Photo Too Large',
        message: `File size: ${(file.size / 1024 / 1024).toFixed(2)} MB. Maximum: 10 MB.`
      });
      setShowConfirmModal(true);
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      setConfirmationType('photo-upload');
      setConfirmationData({
        photo: reader.result,
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2)
      });
      setShowConfirmModal(true);
    };
    reader.readAsDataURL(file);
  };

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setShowCamera(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      setConfirmationType('error');
      setConfirmationData({
        title: 'Camera Access Required',
        message: 'Please enable camera access in your browser settings.'
      });
      setShowConfirmModal(true);
    }
  };

  // Capture photo from camera
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const photoData = canvas.toDataURL('image/jpeg', 0.8);
    stopCamera();
    
    setConfirmationType('photo-capture');
    setConfirmationData({ photo: photoData });
    setShowConfirmModal(true);
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // Remove photo
  const handleRemovePhoto = () => {
    setConfirmationType('photo-remove');
    setConfirmationData({});
    setShowConfirmModal(true);
  };

  // Handle confirmation actions
  const handleConfirm = () => {
    if (confirmationType === 'photo-upload' || confirmationType === 'photo-capture') {
      setPhotoPreview(confirmationData.photo);
      setProfileData(prev => ({ ...prev, profile_photo: confirmationData.photo }));
    } else if (confirmationType === 'photo-remove') {
      setPhotoPreview(null);
      setProfileData(prev => ({ ...prev, profile_photo: null }));
    } else if (confirmationType === 'profile-update') {
      saveProfile();
    } else if (confirmationType === 'password-change') {
      changePassword();
    } else if (confirmationType === 'discard-changes') {
      setProfileData(originalData);
      setPhotoPreview(originalData.profile_photo);
      setIsEditing(false);
    }
    setShowConfirmModal(false);
    setConfirmationData(null);
  };

  // Update profile
  const handleUpdateProfile = () => {
    // Get changes
    const changes = [];
    if (profileData.name !== originalData.name) changes.push(`Name: ${originalData.name} → ${profileData.name}`);
    if (profileData.city !== originalData.city) changes.push(`City: ${originalData.city || 'Not set'} → ${profileData.city}`);
    if (profileData.state !== originalData.state) changes.push(`State: ${originalData.state || 'Not set'} → ${profileData.state}`);
    if (profileData.address !== originalData.address) changes.push('Address: Updated');
    if (profileData.date_of_birth !== originalData.date_of_birth) changes.push('Date of Birth: Updated');
    if (profileData.gender !== originalData.gender) changes.push('Gender: Updated');
    if (profileData.pincode !== originalData.pincode) changes.push('Pincode: Updated');
    if (profileData.profile_photo !== originalData.profile_photo) changes.push('Profile Photo: Updated');

    if (changes.length === 0) {
      showMessage('info', 'No changes to save');
      return;
    }

    setConfirmationType('profile-update');
    setConfirmationData({ changes });
    setShowConfirmModal(true);
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      const response = await userAPI.updateProfile(user.username, profileData);
      
      if (response.success) {
        setOriginalData({ ...profileData });
        updateUser(response.user);
        setIsEditing(false);
        showMessage('success', 'Profile updated successfully!');
      } else {
        showMessage('error', response.message || 'Update failed');
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Change password
  const handleChangePassword = () => {
    if (!passwordData.old_password || !passwordData.new_password || !passwordData.confirm_password) {
      showMessage('error', 'Please fill all password fields');
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }

    setConfirmationType('password-change');
    setConfirmationData({});
    setShowConfirmModal(true);
  };

  const changePassword = async () => {
    try {
      setSaving(true);
      const response = await userAPI.changePassword(
        user.username,
        passwordData.old_password,
        passwordData.new_password
      );
      
      if (response.success) {
        setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
        setShowPasswordModal(false);
        showMessage('success', 'Password changed successfully!');
      } else {
        showMessage('error', response.message || 'Password change failed');
      }
    } catch (error) {
      showMessage('error', error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  // Cancel edit
  const handleCancel = () => {
    const hasChanges = JSON.stringify(profileData) !== JSON.stringify(originalData);
    
    if (hasChanges) {
      setConfirmationType('discard-changes');
      const changes = [];
      if (profileData.name !== originalData.name) changes.push('Name');
      if (profileData.city !== originalData.city) changes.push('City');
      if (profileData.profile_photo !== originalData.profile_photo) changes.push('Photo');
      setConfirmationData({ changes });
      setShowConfirmModal(true);
    } else {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <UserPanelLayout>
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </UserPanelLayout>
    );
  }

  return (
    <UserPanelLayout>
      <div className="profile-container">
        {/* Message Toast */}
        {message.text && (
          <div className={`message-toast ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Header */}
        <div className="profile-header">
          <div>
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">Manage your personal information</p>
          </div>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="btn-edit">
              <FaEdit /> Edit Profile
            </button>
          ) : (
            <div className="btn-group">
              <button onClick={handleCancel} className="btn-cancel">
                <FaTimes /> Cancel
              </button>
              <button onClick={handleUpdateProfile} className="btn-save" disabled={saving}>
                {saving ? 'Saving...' : <><FaSave /> Save</>}
              </button>
            </div>
          )}
        </div>

        {/* Photo Section */}
        <div className="photo-section">
          <div className="photo-wrapper">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="profile-photo" />
            ) : (
              <div className="profile-avatar">
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : <FaUser />}
              </div>
            )}
          </div>
          
          {isEditing && (
            <div className="photo-actions">
              <button onClick={() => fileInputRef.current?.click()} className="btn-photo">
                <FaUpload /> Upload
              </button>
              <button onClick={startCamera} className="btn-photo">
                <FaCamera /> Camera
              </button>
              {photoPreview && (
                <button onClick={handleRemovePhoto} className="btn-photo danger">
                  <FaTrash /> Remove
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          )}
          
          <div className="photo-info">
            <h2>{profileData.name || 'User'}</h2>
            <p>{profileData.email}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="profile-form">
          <h3 className="form-title">Personal Information</h3>
          
          <div className="form-grid">
            <div className="form-field">
              <label>Full Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-field">
              <label>Email Address <span className="required">*</span></label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                disabled
                title="Email cannot be changed"
              />
            </div>

            <div className="form-field">
              <label>Phone Number <span className="required">*</span></label>
              <input
                type="tel"
                name="mobile"
                value={profileData.mobile}
                disabled
                title="Phone cannot be changed"
              />
            </div>

            <div className="form-field">
              <label>Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={profileData.date_of_birth}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>

            <div className="form-field">
              <label>Gender</label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>City <span className="required">*</span></label>
              <input
                type="text"
                name="city"
                value={profileData.city}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-field">
              <label>State <span className="required">*</span></label>
              <input
                type="text"
                name="state"
                value={profileData.state}
                onChange={handleInputChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-field">
              <label>Pincode</label>
              <input
                type="text"
                name="pincode"
                value={profileData.pincode}
                onChange={handleInputChange}
                disabled={!isEditing}
                maxLength="6"
              />
            </div>

            <div className="form-field full-width">
              <label>Full Address</label>
              <textarea
                name="address"
                value={profileData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Change Password Section */}
        <div className="password-section">
          <h3 className="form-title">Change Password</h3>
          <button onClick={() => setShowPasswordModal(true)} className="btn-password">
            <FaLock /> Change Password
          </button>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="modal-overlay" onClick={stopCamera}>
            <div className="modal-content camera-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Capture Photo</h3>
              <video ref={videoRef} autoPlay playsInline className="camera-preview" />
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              <div className="modal-actions">
                <button onClick={stopCamera} className="btn-secondary">Cancel</button>
                <button onClick={capturePhoto} className="btn-primary">Capture</button>
              </div>
            </div>
          </div>
        )}

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Change Password</h3>
              <div className="password-form">
                <div className="form-field">
                  <label>Current Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.old ? 'text' : 'password'}
                      value={passwordData.old_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, old_password: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                      className="toggle-password"
                    >
                      {showPasswords.old ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label>New Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.new ? 'text' : 'password'}
                      value={passwordData.new_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="toggle-password"
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="form-field">
                  <label>Confirm New Password</label>
                  <div className="password-input">
                    <input
                      type={showPasswords.confirm ? 'text' : 'password'}
                      value={passwordData.confirm_password}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="toggle-password"
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-actions">
                <button onClick={() => setShowPasswordModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleChangePassword} className="btn-primary" disabled={saving}>
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <ConfirmationModal
            type={confirmationType}
            data={confirmationData}
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirmModal(false)}
          />
        )}
      </div>
    </UserPanelLayout>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({ type, data, onConfirm, onCancel }) => {
  const getModalContent = () => {
    switch (type) {
      case 'photo-upload':
        return {
          title: 'Upload This Photo?',
          content: (
            <>
              <img src={data.photo} alt="Upload preview" className="confirm-photo" />
              <p className="confirm-text">File: {data.fileName}</p>
              <p className="confirm-text">Size: {data.fileSize} MB</p>
            </>
          ),
          confirmText: 'Upload',
          confirmClass: 'btn-primary'
        };
      
      case 'photo-capture':
        return {
          title: 'Use This Photo?',
          content: <img src={data.photo} alt="Captured" className="confirm-photo" />,
          confirmText: 'Use This',
          confirmClass: 'btn-primary'
        };
      
      case 'photo-remove':
        return {
          title: 'Remove Photo?',
          content: <p className="confirm-text">Are you sure you want to remove your profile photo? You can upload a new one anytime.</p>,
          confirmText: 'Remove',
          confirmClass: 'btn-danger'
        };
      
      case 'profile-update':
        return {
          title: 'Confirm Profile Update',
          content: (
            <>
              <p className="confirm-text">Review your changes:</p>
              <ul className="confirm-list">
                {data.changes.map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            </>
          ),
          confirmText: 'Update',
          confirmClass: 'btn-primary'
        };
      
      case 'password-change':
        return {
          title: 'Confirm Password Change',
          content: <p className="confirm-text">Are you sure you want to change your password? This will log you out from all devices.</p>,
          confirmText: 'Confirm',
          confirmClass: 'btn-primary'
        };
      
      case 'discard-changes':
        return {
          title: 'Discard Changes?',
          content: (
            <>
              <p className="confirm-text">You have unsaved changes. Are you sure you want to leave without saving?</p>
              <ul className="confirm-list">
                {data.changes.map((change, idx) => (
                  <li key={idx}>{change} (edited)</li>
                ))}
              </ul>
            </>
          ),
          confirmText: 'Discard',
          confirmClass: 'btn-danger'
        };
      
      case 'error':
        return {
          title: data.title,
          content: <p className="confirm-text">{data.message}</p>,
          confirmText: 'Understood',
          confirmClass: 'btn-primary',
          hideCancel: true
        };
      
      default:
        return null;
    }
  };

  const content = getModalContent();
  if (!content) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{content.title}</h3>
        <div className="confirm-content">{content.content}</div>
        <div className="modal-actions">
          {!content.hideCancel && (
            <button onClick={onCancel} className="btn-secondary">Cancel</button>
          )}
          <button onClick={onConfirm} className={content.confirmClass}>
            {content.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
