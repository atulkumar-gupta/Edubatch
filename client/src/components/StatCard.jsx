const StatCard = ({ title, value, color = 'indigo' }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-3xl font-bold text-${color}-600 mt-2`}>{value}</p>
  </div>
);
export default StatCard;