import { useEffect, useState } from 'react';
import { attendanceApi, batchApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Attendance = () => {
  const { user } = useAuth();
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState({});
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (user.role === 'student') {
          const res = await attendanceApi.my();
          setSummary(res.data.data);
        } else {
          const res = await batchApi.list();
          setBatches(res.data.data);
        }
      } catch { toast.error('Failed'); }
      finally { setLoading(false); }
    };
    load();
  }, [user]);

  const loadStudents = async () => {
    if (!selectedBatch) return;
    const res = await batchApi.get(selectedBatch);
    // Fetch enrollments
    const er = await (await import('../api/endpoints')).enrollmentApi.batch(selectedBatch);
    setStudents(er.data.data);
    const init = {};
    er.data.data.forEach(e => init[e.student._id] = 'present');
    setRecords(init);
  };

  useEffect(() => { loadStudents(); }, [selectedBatch]);

  const mark = async () => {
    try {
      await attendanceApi.mark({
        batchId: selectedBatch,
        date,
        records: Object.entries(records).map(([student, status]) => ({ student, status })),
      });
      toast.success('Attendance marked');
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  if (loading) return <Loader />;

  if (user.role === 'student') {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Attendance</h1>
        {summary && (
          <div className="bg-white p-6 rounded-xl shadow grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><p className="text-xs text-gray-500">Total</p><p className="text-2xl font-bold">{summary.summary.total}</p></div>
            <div><p className="text-xs text-gray-500">Present</p><p className="text-2xl font-bold text-green-600">{summary.summary.present}</p></div>
            <div><p className="text-xs text-gray-500">Absent</p><p className="text-2xl font-bold text-red-600">{summary.summary.absent}</p></div>
            <div><p className="text-xs text-gray-500">Late</p><p className="text-2xl font-bold text-yellow-600">{summary.summary.late}</p></div>
            <div><p className="text-xs text-gray-500">Percentage</p><p className="text-2xl font-bold text-indigo-600">{summary.summary.percentage}%</p></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Mark Attendance</h1>
      <div className="bg-white p-6 rounded-xl shadow mb-6 grid md:grid-cols-3 gap-4">
        <select className="border p-2 rounded" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)}>
          <option value="">Select Batch</option>
          {batches.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
        </select>
        <input type="date" className="border p-2 rounded" value={date} onChange={e => setDate(e.target.value)} />
        <button onClick={mark} disabled={!selectedBatch} className="bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50">Submit</button>
      </div>
      {students.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full">
            <thead className="border-b"><tr><th className="text-left py-2">Student</th><th>Status</th></tr></thead>
            <tbody>
              {students.map(e => (
                <tr key={e._id} className="border-b">
                  <td className="py-2">{e.student.name}</td>
                  <td>
                    <select className="border p-1 rounded" value={records[e.student._id] || 'present'}
                      onChange={ev => setRecords({...records, [e.student._id]: ev.target.value})}>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Attendance;