import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Team = () => {
  const [teamData, setTeamData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/team/leaderboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeamData(res.data);
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, []);

  if (loading) return <div className="p-8">Loading Team...</div>;

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl p-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Leaderboard</h1>
            <p className="mt-1 text-gray-500">Track your team's performance</p>
          </div>
        </div>

        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-500 border-b">
                  <th className="pb-4 font-medium text-left">Member</th>
                  <th className="pb-4 font-medium text-left">Role</th>
                  <th className="pb-4 font-medium text-center">Deals Closed</th>
                  <th className="pb-4 font-medium text-center">Total Revenue</th>
                  <th className="pb-4 font-medium text-left">Progress</th>
                </tr>
              </thead>
              <tbody>
                {teamData.length > 0 ? (
                  teamData.map((member, index) => {
                    const progress = Math.min(Math.round((member.dealsCount / 15) * 100), 100);
                    return (
                      <tr key={index} className="transition border-b last:border-none hover:bg-gray-50">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 font-bold text-blue-600 bg-blue-100 rounded-full">
                              {member.name?.split(' ').map(n => n[0]).join('')}
                            </div>
                            <p className="font-medium">{member.name}</p>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600">{member.role || 'BDA'}</td>
                        <td className="py-4 font-semibold text-center">{member.dealsCount}</td>
                        <td className="py-4 font-medium text-center text-green-600">
                          ₹{member.revenue?.toLocaleString() || 0}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-32 bg-gray-200 rounded-full h-2.5">
                              <div 
                                className="bg-blue-600 h-2.5 rounded-full" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600">{progress}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-500">
                      No team data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;