'use client';

import TodoList from '@/components/todo/todo-list';

export default function Home() {
  return (
    <main className="flex flex-col p-6 grow">
      <div className="flex flex-col gap-4 mx-auto w-full max-w-6xl">
        <h1 className="text-lg md:text-2xl font-semibold">Home</h1>
        <TodoList />
      </div>
    </main>
  );
}
