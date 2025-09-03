import React, { useState } from 'react';
import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(task.text);
  };

  const handleSave = async () => {
    if (editText.trim() && editText.trim() !== task.text) {
      await onUpdate(task.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className="task-item">
      <div className="task-text">
        {isEditing ? (
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            style={{ width: '100%', marginRight: '10px' }}
            autoFocus
          />
        ) : (
          <div>
            <div style={{ fontWeight: '500', marginBottom: '5px' }}>
              {task.text}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Created: {task.created_at} | Confidence: {Math.round(task.confidence * 100)}%
            </div>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span 
          className={`task-classification classification-${task.classification}`}
        >
          {task.classification}
        </span>
        
        {isEditing ? (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button 
              onClick={handleSave}
              style={{ fontSize: '12px', padding: '5px 10px' }}
            >
              Save
            </button>
            <button 
              onClick={handleCancel}
              style={{ 
                fontSize: '12px', 
                padding: '5px 10px', 
                background: '#666' 
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '5px' }}>
            <button 
              onClick={handleEdit}
              style={{ 
                fontSize: '12px', 
                padding: '5px 10px', 
                background: '#28a745' 
              }}
            >
              Edit
            </button>
            <button 
              onClick={handleDelete}
              style={{ 
                fontSize: '12px', 
                padding: '5px 10px', 
                background: '#dc3545' 
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;