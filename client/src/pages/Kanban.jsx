import { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Navbar from '../components/Navbar';

const Kanban = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const stages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Closed'];

  const fetchDeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5001/api/deals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeals(res.data.deals || []);
    } catch (error) {
      console.error("Error fetching deals:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const dealId = draggableId;
    const newStage = destination.droppableId;

    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `http://localhost:5001/api/deals/${dealId}/stage`,
        { stage: newStage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal._id === dealId ? { ...deal, stage: newStage } : deal
        )
      );
    } catch (error) {
      console.error("Error updating deal stage:", error);
      alert("Failed to move deal");
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  if (loading) return <div className="p-8">Loading Pipeline...</div>;

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h1 className="mb-6 text-3xl font-bold">Pipeline</h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {stages.map((stage) => (
              <div key={stage} className="bg-gray-50 rounded-2xl p-4 border min-h-[550px]">
                <div className="flex items-center justify-between px-2 mb-4">
                  <h3 className="font-semibold text-gray-700">{stage}</h3>
                  <span className="bg-white text-xs px-2.5 py-1 rounded-full border font-medium">
                    {deals.filter(d => d.stage === stage).length}
                  </span>
                </div>

                <Droppable droppableId={stage}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="space-y-3 min-h-[450px]"
                    >
                      {deals
                        .filter((deal) => deal.stage === stage)
                        .map((deal, index) => (
                          <Draggable key={deal._id} draggableId={deal._id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="p-4 transition bg-white border shadow-sm rounded-xl hover:shadow-md cursor-grab active:cursor-grabbing"
                              >
                                <h4 className="font-semibold text-gray-800">{deal.title}</h4>
                                <p className="mt-1 text-sm text-gray-500">
                                  ₹{deal.value?.toLocaleString() || 0}
                                </p>
                                {deal.lead && (
                                  <p className="mt-2 text-xs text-gray-400">
                                    Lead: {deal.lead.name}
                                  </p>
                                )}
                              </div>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Kanban;