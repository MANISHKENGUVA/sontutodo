import React, { useEffect, useState } from 'react';
import { TodoList } from './components/TodoList';
import { TodoInput } from './components/TodoInput';
import { AuthForm } from './components/AuthForm';
import { ClipboardList } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { Todo } from './types/todo';
import { fetchTodos, addTodo, toggleTodo, deleteTodo } from './lib/todos';
import { signIn, signUp, signOut, getSession, onAuthStateChange } from './lib/auth';

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadTodos();
      }
    });

    const { data: { subscription } } = onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadTodos();
      } else {
        setTodos([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (title: string) => {
    if (!user?.id) return;
    try {
      const newTodo = await addTodo(title, user.id);
      setTodos([newTodo, ...todos]);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await toggleTodo(id, completed);
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed } : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  if (!user) {
    return (
      <AuthForm 
        onLogin={signIn}
        onSignUp={signUp}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <ClipboardList className="text-blue-500" size={32} />
            <h1 className="text-2xl font-bold text-gray-900">Todo List</h1>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>

        <div className="space-y-6">
          <TodoInput onAdd={handleAddTodo} />
          
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : todos.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No todos yet. Add one above!
            </div>
          ) : (
            <TodoList
              todos={todos}
              onToggle={handleToggleTodo}
              onDelete={handleDeleteTodo}
            />
          )}
        </div>
      </div>
    </div>
  );
}