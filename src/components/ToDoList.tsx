import React, { useState } from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Define the props interface to include userId
interface ToDoListProps {
  userId: string; // Add userId prop
}

const ToDoList: React.FC<ToDoListProps> = ({ userId }) => { // Accept userId as a prop
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const handleToggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
        <CheckSquare className="mr-2 h-6 w-6 text-[#f1c0e8]" />
        To-Do List
      </h1>
      
      <div className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            placeholder="Add a new task..."
            aria-label="New task" // Added aria-label for accessibility
          />
          <button
            onClick={handleAddTodo}
            className="bg-[#a3c4f3] text-white p-2 rounded-r-md hover:bg-[#90dbf4] focus:outline-none focus:ring-2 focus:ring-[#cfbaf0]"
            type="button" // Set the button type to 'button'
            aria-label="Add task" // Added aria-label for accessibility
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center bg-[#fde4cf] p-3 rounded-md">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo.id)}
              className="mr-2 h-5 w-5 text-[#a3c4f3] rounded focus:ring-[#cfbaf0]"
              aria-label={`Toggle task "${todo.text}"`} // Added aria-label for accessibility
            />
            <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {todo.text}
            </span>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
              type="button" // Set the button type to 'button'
              aria-label={`Delete task "${todo.text}"`} // Added aria-label for accessibility
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
      
      {todos.length === 0 && (
        <p className="text-gray-600 text-center mt-4">No tasks yet. Add some tasks to get started!</p>
      )}
    </div>
  );
};

export default ToDoList;
