import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/endpoints';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone || '', avatar: user.avatar || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      await userApi.updateProfile(profile);
      toast.success('Profile updated');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    try {
      await userApi.changePassword(passwords);
      toast.success('Password changed');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      <form onSubmit={updateProfile} className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold">Basic Info</h2>
        <input className="w-full border p-2 rounded" placeholder="Name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Phone" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
        <input className="w-full border p-2 rounded" placeholder="Avatar URL" value={profile.avatar} onChange={e => setProfile({...profile, avatar: e.target.value})} />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Update</button>
      </form>
      <form onSubmit={changePassword} className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold">Change Password</h2>
        <input type="password" className="w-full border p-2 rounded" placeholder="Current Password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} />
        <input type="password" className="w-full border p-2 rounded" placeholder="New Password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} />
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Change Password</button>
      </form>
    </div>
  );
};

export default Profile;