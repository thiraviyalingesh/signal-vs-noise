import React from 'react';
import { Task } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: number, text: string) => void;
  onDelete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdate, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="task-list">
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No tasks yet. Add one above!
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2 style={{ padding: '20px 20px 0', margin: 0 }}>Your Tasks</h2>
      {tasks.map((task) => (
        <div key={task.id} className="task-item">
          <div className="task-text">
            <div style={{ fontWeight: '500', marginBottom: '5px' }}>
              {task.text}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              Created: {task.created_at} | Confidence: {Math.round(task.confidence * 100)}%
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`task-classification classification-${task.classification}`}>
              {task.classification}
            </span>
            
            <button 
              onClick={() => onDelete(task.id)}
              style={{ 
                fontSize: '12px', 
                padding: '5px 10px', 
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;