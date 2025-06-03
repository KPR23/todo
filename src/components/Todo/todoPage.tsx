import { Doc } from '../../../convex/_generated/dataModel';
import TodoList from './todoList';

export default function TodoPage({
  todos,
  completedTodos,
  incompletedTodos,
}: {
  todos: Doc<'todos'>[];
  completedTodos: Doc<'todos'>[];
  incompletedTodos: Doc<'todos'>[];
}) {
  return (
    <div className="flex flex-col gap-2">
      Wszystkie
      <TodoList todos={todos} />
      Ukonczone
      <TodoList todos={completedTodos} />
      Nieukonczone
      <TodoList todos={incompletedTodos} />
    </div>
  );
}
