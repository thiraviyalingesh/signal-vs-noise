import React, { useState } from 'react';
import { Task } from './types/Task';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { createTask } from './services/api';
function App() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleCreateTask = async (text: string) => {
    // TODO: Connect to backend API
    const newTask = await createTask(text);
    setTasks(prev => [...prev, newTask]);
  };

  const handleUpdateTask = (id: number, text: string) => {
    // TODO: Connect to backend API
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, text } : task
    ));
  };

  const handleDeleteTask = (id: number) => {
    // TODO: Connect to backend API
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  return (
    <div className="container">
      <h1>Task Classifier</h1>
      <p>Add tasks and see if they're classified as signal (important) or noise (distraction)</p>
      
      <TaskForm onSubmit={handleCreateTask} />
      
      <TaskList 
        tasks={tasks}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
      />
    </div>
  );
}

export default App;