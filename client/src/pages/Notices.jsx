import { useEffect, useState } from 'react';
import { noticeApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Notices = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });

  const load = async () => {
    try {
      const res = await noticeApi.list();
      setNotices(res.data.data);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await noticeApi.create(form);
      toast.success('Notice posted');
      setForm({ title: '', body: '' });
      setShowForm(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Notices</h1>
        {(user.role === 'admin' || user.role === 'teacher') && (
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            {showForm ? 'Cancel' : '+ New Notice'}
          </button>
        )}
      </div>
      {showForm && (
        <form onSubmit={submit} className="bg-white p-6 rounded-xl shadow mb-6 space-y-3">
          <input required placeholder="Title" className="w-full border p-2 rounded" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
          <textarea required placeholder="Body" className="w-full border p-2 rounded" rows="4" value={form.body} onChange={e => setForm({...form, body: e.target.value})} />
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Post</button>
        </form>
      )}
      <div className="space-y-3">
        {notices.map(n => (
          <div key={n._id} className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-bold text-lg">{n.title}</h3>
            <p className="text-gray-700 mt-1">{n.body}</p>
            <p className="text-xs text-gray-500 mt-2">
              {n.batch?.name || 'Global'} • {n.createdBy?.name} • {new Date(n.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {notices.length === 0 && <p className="text-center text-gray-500 mt-10">No notices</p>}
    </div>
  );
};

export default Notices;