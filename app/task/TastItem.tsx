'use client';
import { Trash2, Check, Clock } from 'lucide-react';
import { Task, useTaskStore } from '../store/task-store';

const TaskItem: React.FC<{ task: Task }> = ({ task }) => {
  const { deleteTask, toggleTaskStatus } = useTaskStore();

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border transition-all ${
      task.status === 'completed' ? 'opacity-75 bg-gray-50' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => toggleTaskStatus(task.id)}
              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors ${
                task.status === 'completed'
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 hover:border-green-400'
              }`}
            >
              {task.status === 'completed' && <Check size={14} />}
            </button>
            <h3 className={`font-semibold text-lg ${
              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-800'
            }`}>
              {task.title}
            </h3>
            <div className="flex items-center gap-1">
              {task.status === 'completed' ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Clock size={16} className="text-orange-500" />
              )}
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                task.status === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {task.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>
          </div>
          {task.description && (
            <p className={`text-gray-600 mb-3 ${
              task.status === 'completed' ? 'line-through' : ''
            }`}>
              {task.description}
            </p>
          )}
          <p className="text-xs text-gray-400">
            Created: {task.createdAt.toLocaleDateString()} at {task.createdAt.toLocaleTimeString()}
          </p>
        </div>
        <button
          onClick={() => deleteTask(task.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-md transition-colors"
          title="Delete task"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;