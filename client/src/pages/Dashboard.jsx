import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dashboardApi } from '../api/endpoints';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await dashboardApi[user.role]();
        setData(res.data.data);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetch();
  }, [user]);

  if (loading) return <Loader />;
  if (!data) return <p className="p-8">No data</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {user.role === 'admin' && (
          <>
            <StatCard title="Total Students" value={data.totalStudents} />
            <StatCard title="Total Teachers" value={data.totalTeachers} />
            <StatCard title="Active Batches" value={data.activeBatches} />
            <StatCard title="Revenue" value={`₹${data.revenue}`} color="green" />
            <StatCard title="Pending Fees" value={data.pendingFees} color="red" />
          </>
        )}
        {user.role === 'teacher' && (
          <>
            <StatCard title="My Batches" value={data.totalBatches} />
            <StatCard title="Active" value={data.activeBatches} color="green" />
            <StatCard title="Students" value={data.totalStudents} />
          </>
        )}
        {user.role === 'student' && (
          <>
            <StatCard title="My Batches" value={data.totalBatches} />
            <StatCard title="Pending Fees" value={data.pendingFees} color="red" />
            <StatCard title="Attendance %" value={`${data.attendancePercentage}%`} color="green" />
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;