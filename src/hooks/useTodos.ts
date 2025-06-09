import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { api } from '../../convex/_generated/api';

export function useTodos() {
  const todosRaw = useQuery(api.todos.getTodos);
  const todos = useMemo(() => todosRaw || [], [todosRaw]);

  const completedTodos = useMemo(
    () => todos.filter((t) => t.isCompleted),
    [todos]
  );
  const incompletedTodos = useMemo(
    () => todos.filter((t) => !t.isCompleted),
    [todos]
  );

  return {
    todos,
    completedTodos,
    incompletedTodos,
  };
}
