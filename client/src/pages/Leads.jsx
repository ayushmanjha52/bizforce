import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CreateLeadModal from '../components/CreateLeadModal';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const fetchLeads = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/leads', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeads(res.data.leads || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert Lead to Deal
  const convertToDeal = async (lead) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:5001/api/deals', {
        leadId: lead._id,
        title: `Deal - ${lead.company || lead.name}`,
        stage: 'New',
        value: lead.dealValue || 0,
        assignedTo: lead.assignedTo || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Lead successfully converted to Deal!");
      fetchLeads(); // Refresh leads
    } catch (error) {
      console.error("Error converting to deal:", error);
      alert("Failed to convert lead to deal");
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5001/api/leads/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchLeads();
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert("Failed to delete lead");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  if (loading) return <div className="p-8">Loading leads...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
            <p className="mt-1 text-gray-500">Manage all your leads here</p>
          </div>
          <button 
            onClick={() => {
              setEditingLead(null);
              setIsModalOpen(true);
            }}
            className="px-6 py-3 font-medium text-white transition bg-blue-600 hover:bg-blue-700 rounded-xl"
          >
            + Add New Lead
          </button>
        </div>

        <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-3xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-sm text-gray-500 border-b">
                  <th className="pb-4 font-medium text-left">Name</th>
                  <th className="pb-4 font-medium text-left">Email</th>
                  <th className="pb-4 font-medium text-left">Company</th>
                  <th className="pb-4 font-medium text-left">Source</th>
                  <th className="pb-4 font-medium text-left">AI Score</th>
                  <th className="pb-4 font-medium text-left">Status</th>
                  <th className="pb-4 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.length > 0 ? (
                  leads.map((lead) => (
                    <tr key={lead._id} className="transition border-b last:border-none hover:bg-gray-50">
                      <td className="py-4 font-medium">{lead.name}</td>
                      <td className="py-4 text-gray-600">{lead.email}</td>
                      <td className="py-4">{lead.company || '-'}</td>
                      <td className="py-4">{lead.source}</td>
                      <td className="py-4">
                        {lead.aiScore > 70 && <span className="px-3 py-1 text-sm text-red-700 bg-red-100 rounded-full">🔴 Hot</span>}
                        {lead.aiScore >= 40 && lead.aiScore <= 70 && <span className="px-3 py-1 text-sm text-yellow-700 bg-yellow-100 rounded-full">🟡 Warm</span>}
                        {lead.aiScore < 40 && <span className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-full">⚪ Cold</span>}
                      </td>
                      <td className="py-4">
                        <span className="px-3 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">{lead.status}</span>
                      </td>
                      <td className="flex justify-center gap-2 py-4">
                        <button 
                          onClick={() => convertToDeal(lead)}
                          className="px-3 py-1 text-xs text-white bg-green-600 rounded-lg hover:bg-green-700"
                        >
                          Convert to Deal
                        </button>
                        <button onClick={() => handleEdit(lead)} className="text-sm text-blue-600 hover:underline">Edit</button>
                        <button onClick={() => handleDelete(lead._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-gray-500">No leads found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <CreateLeadModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditingLead(null);
        }} 
        onLeadCreated={fetchLeads}
        editingLead={editingLead}
      />
    </div>
  );
};

export default Leads;