import React, { useState } from 'react';
import { Clock, Plus, Trash2 } from 'lucide-react';

interface Task {
  id: number;
  text: string;
  time: string;
}

// Define the props interface to include userId
interface DailyPlannerProps {
  userId: string; // Add userId prop
}

const DailyPlanner: React.FC<DailyPlannerProps> = ({ userId }) => { // Accept userId as a prop
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleAddTask = () => {
    if (newTask.trim() && newTime) {
      setTasks([...tasks, { id: Date.now(), text: newTask, time: newTime }]);
      setNewTask('');
      setNewTime('');
    }
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <Clock className="mr-2 h-6 w-6 text-[#f1c0e8]" />
        Daily Planner
      </h1>
      
      <div className="mb-6">
        <div className="flex space-x-2">
          <label htmlFor="new-task" className="sr-only">New Task</label>
          <input
            id="new-task"
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            placeholder="Add a new task..."
            aria-label="Add a new task" // Added aria-label for accessibility
          />
          <label htmlFor="new-time" className="sr-only">Task Time</label>
          <input
            id="new-time"
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            aria-label="Set task time" // Added aria-label for accessibility
          />
          <button
            onClick={handleAddTask}
            className="bg-[#a3c4f3] text-white p-2 rounded-md hover:bg-[#90dbf4] focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            type="button" // Set the button type to 'button'
            aria-label="Add task" // Added aria-label for accessibility
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <ul className="space-y-2">
        {tasks.sort((a, b) => a.time.localeCompare(b.time)).map(task => (
          <li key={task.id} className="flex items-center bg-[#cfbaf0] p-3 rounded-md">
            <span className="flex-grow">
              <span className="font-semibold">{task.time}</span> - {task.text}
            </span>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              type="button" // Set the button type to 'button'
              aria-label={`Delete task "${task.text}"`} // Added aria-label for accessibility
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
      
      {tasks.length === 0 && (
        <p className="text-gray-600 text-center mt-4">No tasks planned for today. Start by adding some tasks!</p>
      )}
    </div>
  );
};

export default DailyPlanner;
