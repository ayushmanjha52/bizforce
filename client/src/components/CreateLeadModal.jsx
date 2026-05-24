import { useState, useEffect } from 'react';
import axios from 'axios';

const CreateLeadModal = ({ isOpen, onClose, onLeadCreated, editingLead }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website',
    dealValue: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Agar edit mode hai toh form mein data daal do
  useEffect(() => {
    if (editingLead) {
      setFormData({
        name: editingLead.name || '',
        email: editingLead.email || '',
        phone: editingLead.phone || '',
        company: editingLead.company || '',
        source: editingLead.source || 'Website',
        dealValue: editingLead.dealValue || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        source: 'Website',
        dealValue: ''
      });
    }
  }, [editingLead]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      if (editingLead) {
        // Edit mode
        await axios.put(
          `http://localhost:5001/api/leads/${editingLead._id}`,
          {
            ...formData,
            dealValue: Number(formData.dealValue) || 0
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      } else {
        // Create mode
        await axios.post(
          'http://localhost:5001/api/leads',
          {
            ...formData,
            dealValue: Number(formData.dealValue) || 0
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }

      onLeadCreated();
      onClose();

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl">
        <h2 className="mb-6 text-2xl font-bold">
          {editingLead ? "Edit Lead" : "Add New Lead"}
        </h2>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name *"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <select
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Inbound">Inbound</option>
          </select>

          <input
            type="number"
            name="dealValue"
            placeholder="Deal Value (₹)"
            value={formData.dealValue}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border rounded-lg hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? "Saving..." : editingLead ? "Update Lead" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeadModal;