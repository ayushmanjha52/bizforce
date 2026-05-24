import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import StatCard from '../components/StatCard';
import Navbar from '../components/Navbar';
import CreateLeadModal from '../components/CreateLeadModal';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentLeads, setRecentLeads] = useState([]);
  const [funnelData, setFunnelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');

      const statsRes = await axios.get('http://localhost:5001/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data);

      // All 5 stages with count
      const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Closed'];
      const funnel = stages.map(stage => ({
        status: stage,
        count: statsRes.data.leadsByStatus?.[stage] || 0
      }));
      setFunnelData(funnel);

      const leadsRes = await axios.get('http://localhost:5001/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecentLeads(leadsRes.data.leads?.slice(0, 5) || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1E293B] text-white min-h-screen p-5">
          <div className="mt-2 space-y-1">
            <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 font-medium text-white bg-blue-600 rounded-xl">
              📊 Dashboard
            </Link>
            <Link to="/leads" className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-slate-700 rounded-xl">
              👥 Leads
            </Link>
            <Link to="/kanban" className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-slate-700 rounded-xl">
              📈 Pipeline
            </Link>
            <Link to="/team" className="flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-slate-700 rounded-xl">
              👤 Team
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-gray-500">Here's what's happening with your leads today.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 font-medium text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl"
            >
              + Add New Lead
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Leads" value={stats?.totalLeads || 0} icon="📊" color="blue" />
            <StatCard title="Avg AI Score" value={stats?.averageAIScore || 0} icon="🎯" color="green" />
            <StatCard title="High Value Leads" value={stats?.highValueLeads || 0} icon="💎" color="yellow" />
            <StatCard title="Active Deals" value="8" icon="🚀" color="purple" />
          </div>

          {/* Funnel Chart - All 5 Stages */}
          <div className="p-6 mb-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <h2 className="mb-4 text-xl font-semibold">Leads by Status (Funnel)</h2>
            
            {funnelData.length > 0 ? (
              <div style={{ width: '100%', height: '320px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-10 text-center text-gray-500">No data available for funnel chart</p>
            )}
          </div>

          {/* Recent Leads Table */}
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">Recent Leads</h2>
              <Link to="/leads" className="text-sm font-medium text-blue-600 hover:underline">View All →</Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-gray-500 border-b">
                    <th className="pb-4 font-medium text-left">Name</th>
                    <th className="pb-4 font-medium text-left">Company</th>
                    <th className="pb-4 font-medium text-left">Source</th>
                    <th className="pb-4 font-medium text-left">AI Score</th>
                    <th className="pb-4 font-medium text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.length > 0 ? (
                    recentLeads.map((lead) => (
                      <tr key={lead._id} className="transition border-b last:border-none hover:bg-gray-50">
                        <td className="py-4 font-medium">{lead.name}</td>
                        <td className="py-4 text-gray-600">{lead.company || "-"}</td>
                        <td className="py-4">{lead.source}</td>
                        <td className="py-4">
                          <span className="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                            {lead.aiScore}
                          </span>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-gray-500">No leads found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateLeadModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onLeadCreated={fetchData} 
      />
    </div>
  );
};

export default Dashboard;