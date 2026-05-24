const StatCard = ({ title, value, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "border-t-blue-500",
    green: "border-t-green-500",
    yellow: "border-t-yellow-500",
    purple: "border-t-purple-500",
    red: "border-t-red-500",
  };

  return (
    <div className={`bg-white p-6 rounded-3xl shadow-sm border border-gray-100 ${colorClasses[color]} border-t-4 hover:shadow-md transition-all`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm tracking-wide text-gray-500">{title}</p>
          <p className="mt-3 text-4xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="mt-1 text-5xl opacity-80">{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;