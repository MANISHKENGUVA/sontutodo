import { supabase } from './supabase';
import { Todo } from '../types/todo';

export async function fetchTodos(): Promise<Todo[]> {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addTodo(title: string, userId: string): Promise<Todo> {
  const { data, error } = await supabase
    .from('todos')
    .insert([{ title, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function toggleTodo(id: string, completed: boolean): Promise<void> {
  const { error } = await supabase
    .from('todos')
    .update({ completed })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteTodo(id: string): Promise<void> {
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);

  if (error) throw error;
}