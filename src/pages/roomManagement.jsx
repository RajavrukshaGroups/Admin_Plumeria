// /admin/pages/RoomManagement.jsx
import React, { useEffect, useState } from 'react';
import RoomForm from '../components/roomForm';
import RoomList from '../components/roomForm';
import axios from 'axios';

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = useState(null);

  const fetchRooms = async () => {
    const res = await axios.get('/api/rooms');
    setRooms(res.data);
  };

  const handleFormSubmit = async (formData) => {
    if (editingRoom) {
      await axios.put(`/api/rooms/${editingRoom._id}`, formData);
    } else {
      await axios.post('/api/rooms', formData);
    }
    setEditingRoom(null);
    fetchRooms();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/rooms/${id}`);
    fetchRooms();
  };

  const handleEdit = (room) => {
    setEditingRoom(room);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Room Management</h1>
      <RoomForm onSubmit={handleFormSubmit} initialData={editingRoom} />
      <RoomList rooms={rooms} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default RoomManagement;
