'use client';

import TodoPage from '@/components/Todo/todo-page';
import { Button } from '@/components/ui/button';
import { useQuery } from 'convex/react';
import { FilterIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { api } from '../../../../convex/_generated/api';

export default function Home() {
  const [showAddTask, setShowAddTask] = useState(false);
  const todos = useQuery(api.todo.getTodos) || [];
  const completedTodos = useQuery(api.todo.getCompletedTodos) || [];
  const incompletedTodos = useQuery(api.todo.getIncompletedTodos) || [];
  if (!todos) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col p-6 grow">
      <div className="flex flex-col gap-4 mx-auto w-full max-w-6xl">
        <div className="flex justify-between items-center">
          <h1 className="text-lg md:text-2xl font-semibold">Home</h1>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddTask(true)} disabled={showAddTask}>
              <PlusIcon className="w-4 h-4" />
              Add Task
            </Button>
            <Button variant="outline">
              <FilterIcon className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
        <hr className="my-2 w-full border-t border-zinc-950/10 dark:border-white/10" />
        <TodoPage
          todos={todos}
          completedTodos={completedTodos}
          incompletedTodos={incompletedTodos}
          showAddTask={showAddTask}
          setShowAddTask={setShowAddTask}
        />
      </div>
    </main>
  );
}
