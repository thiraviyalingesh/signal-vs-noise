import React, { useState } from 'react';

interface TaskFormProps {
  onSubmit: (text: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSubmit(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Add New Task</h2>
      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter a task..."
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={!text.trim()}>
          Add Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;