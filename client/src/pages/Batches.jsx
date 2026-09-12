import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { batchApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Batches = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '', subject: '', description: '', startDate: '', endDate: '',
    schedule: { days: [], startTime: '', endTime: '' }, capacity: 30, fee: 0, status: 'upcoming'
  });

  const load = async () => {
    try {
      const res = await batchApi.list();
      setBatches(res.data.data);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await batchApi.create(form);
      toast.success('Batch created');
      setShowForm(false);
      load();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Batches</h1>
        {user.role === 'admin' && (
          <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg">
            {showForm ? 'Cancel' : '+ New Batch'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow mb-6 grid grid-cols-2 gap-4">
          <input required placeholder="Name" className="border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input required placeholder="Subject" className="border p-2 rounded" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
          <input required type="date" className="border p-2 rounded" value={form.startDate} onChange={e => setForm({...form, startDate: e.target.value})} />
          <input required type="date" className="border p-2 rounded" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})} />
          <input required type="number" placeholder="Capacity" className="border p-2 rounded" value={form.capacity} onChange={e => setForm({...form, capacity: +e.target.value})} />
          <input required type="number" placeholder="Fee (INR)" className="border p-2 rounded" value={form.fee} onChange={e => setForm({...form, fee: +e.target.value})} />
          <textarea placeholder="Description" className="border p-2 rounded col-span-2" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <button className="col-span-2 bg-indigo-600 text-white py-2 rounded-lg">Create Batch</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map(b => (
          <Link to={`/batches/${b._id}`} key={b._id} className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{b.name}</h3>
              <span className={`text-xs px-2 py-1 rounded ${b.status === 'active' ? 'bg-green-100 text-green-700' : b.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-700'}`}>{b.status}</span>
            </div>
            <p className="text-gray-600 text-sm mt-1">{b.subject}</p>
            <p className="text-gray-500 text-sm">Fee: ₹{b.fee}</p>
            <p className="text-gray-500 text-sm">Capacity: {b.capacity}</p>
          </Link>
        ))}
      </div>
      {batches.length === 0 && <p className="text-center text-gray-500 mt-10">No batches yet</p>}
    </div>
  );
};

export default Batches;