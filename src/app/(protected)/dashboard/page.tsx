'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function Dashboard() {
  const createTodo = useMutation(api.todo.createTodo);
  const todos = useQuery(api.todo.getTodos);

  return (
    <div className="w-full">
      <h1 className="text-xl font-semibold mb-4">Hello World</h1>

      <form
        className="flex gap-2 mb-4"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);
          const text = formData.get('text') as string;
          createTodo({ text });
          (e.target as HTMLFormElement).reset();
        }}
      >
        <Input type="text" name="text" className="flex-1" />
        <Button type="submit">Create Todo</Button>
      </form>

      <div className="space-y-1">
        {todos?.map((todo) => (
          <div key={todo._id}>{todo.text}</div>
        ))}
      </div>
    </div>
  );
}
