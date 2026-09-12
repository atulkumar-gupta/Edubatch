import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { batchApi, enrollmentApi } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const BatchDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [batch, setBatch] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await batchApi.get(id);
        setBatch(res.data.data);
        if (user.role === 'admin' || user.role === 'teacher') {
          const er = await enrollmentApi.batch(id);
          setEnrollments(er.data.data);
        }
      } catch { toast.error('Failed'); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  if (loading) return <Loader />;
  if (!batch) return <p className="p-8">Not found</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{batch.name}</h1>
            <p className="text-gray-600 mt-1">{batch.subject}</p>
          </div>
          <span className="px-3 py-1 rounded bg-indigo-100 text-indigo-700">{batch.status}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div><p className="text-xs text-gray-500">Fee</p><p className="font-bold">₹{batch.fee}</p></div>
          <div><p className="text-xs text-gray-500">Capacity</p><p className="font-bold">{batch.capacity}</p></div>
          <div><p className="text-xs text-gray-500">Enrolled</p><p className="font-bold">{batch.enrolledCount || 0}</p></div>
          <div><p className="text-xs text-gray-500">Teacher</p><p className="font-bold">{batch.teacher?.name || 'N/A'}</p></div>
        </div>
        {batch.description && <p className="mt-4 text-gray-700">{batch.description}</p>}
      </div>

      {(user.role === 'admin' || user.role === 'teacher') && (
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">Enrolled Students ({enrollments.length})</h2>
          <table className="w-full text-left">
            <thead className="border-b">
              <tr><th className="py-2">Name</th><th>Email</th><th>Payment</th></tr>
            </thead>
            <tbody>
              {enrollments.map(e => (
                <tr key={e._id} className="border-b">
                  <td className="py-2">{e.student?.name}</td>
                  <td>{e.student?.email}</td>
                  <td><span className={`px-2 py-1 rounded text-xs ${e.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{e.paymentStatus}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BatchDetail;