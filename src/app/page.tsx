'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function Home() {
  const createTodo = useMutation(api.todo.createTodo);
  const todos = useQuery(api.todo.getTodos);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1>Hello World</h1>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const text = formData.get('text') as string;
            createTodo({ text });
            (e.target as HTMLFormElement).reset();
          }}
        >
          <Input type="text" name="text" />
          <Button type="submit">Create Todo</Button>
        </form>

        {todos?.map((todo) => {
          return <div key={todo._id}>{todo.text}</div>;
        })}
      </main>
    </div>
  );
}
