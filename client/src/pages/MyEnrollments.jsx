import { useEffect, useState } from 'react';
import { enrollmentApi, paymentApi } from '../api/endpoints';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const MyEnrollments = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await enrollmentApi.my();
      setItems(res.data.data);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const payNow = async (enrollmentId) => {
    try {
      const { data } = await paymentApi.createOrder(enrollmentId);
      const { orderId, amount, currency, keyId } = data.data;
      const options = {
        key: keyId,
        amount,
        currency,
        name: 'EduBatch',
        description: 'Batch Fee Payment',
        order_id: orderId,
        handler: async (response) => {
          try {
            await paymentApi.verify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              enrollmentId,
            });
            toast.success('Payment successful!');
            load();
          } catch { toast.error('Verification failed'); }
        },
        theme: { color: '#4F46E5' },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment init failed');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Enrollments</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map(e => (
          <div key={e._id} className="bg-white p-5 rounded-xl shadow">
            <h3 className="font-bold text-lg">{e.batch?.name}</h3>
            <p className="text-sm text-gray-600">{e.batch?.subject}</p>
            <p className="text-sm mt-2">Fee: ₹{e.batch?.fee}</p>
            <div className="flex justify-between items-center mt-3">
              <span className={`text-xs px-2 py-1 rounded ${e.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{e.paymentStatus}</span>
              {e.paymentStatus === 'pending' && (
                <button onClick={() => payNow(e._id)} className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm">Pay Now</button>
              )}
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 && <p className="text-center text-gray-500 mt-10">No enrollments yet</p>}
    </div>
  );
};

export default MyEnrollments;