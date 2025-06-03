'use client';

import TodoPage from '@/components/Todo/todoPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

export default function Home() {
  const todos = useQuery(api.todo.getTodos) || [];
  const completedTodos = useQuery(api.todo.getCompletedTodos) || [];
  const incompletedTodos = useQuery(api.todo.getIncompletedTodos) || [];
  const createTodo = useMutation(api.todo.createTodo);
  const [newTodo, setNewTodo] = useState('');
  if (!todos) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col p-6 grow">
      <div className="flex flex-col gap-4 mx-auto w-full max-w-6xl">
        <h1 className="text-lg md:text-2xl font-semibold">Home</h1>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Add a new todo"
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <Button
            onClick={() =>
              createTodo({
                taskName: newTodo,
                description: '',
                projectId: 'kx7db6cp68v4g4ntrrm3kf96j57h4tc9' as Id<'projects'>,
                labelId: 'ks77fazrxve6ppn65txszcwmqs7h4ad8' as Id<'labels'>,
                dueDate: 0,
                priority: 0,
              })
            }
          >
            Add
          </Button>
        </div>
        <TodoPage
          todos={todos}
          completedTodos={completedTodos}
          incompletedTodos={incompletedTodos}
        />
      </div>
    </main>
  );
}
