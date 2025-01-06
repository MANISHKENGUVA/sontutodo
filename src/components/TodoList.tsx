import React from 'react';
import { Check, Trash2, Square } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Todo {
  id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  return (
    <ul className="space-y-3">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onToggle(todo.id, !todo.completed)}
              className={`p-1 rounded-md transition-colors ${
                todo.completed ? 'text-green-500' : 'text-gray-400'
              }`}
            >
              {todo.completed ? <Check size={20} /> : <Square size={20} />}
            </button>
            <div>
              <p className={`${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {todo.title}
              </p>
              <p className="text-xs text-gray-400">
                Added {formatDistanceToNow(new Date(todo.created_at))} ago
              </p>
            </div>
          </div>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </li>
      ))}
    </ul>
  );
}