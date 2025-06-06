import { Doc } from '../../../convex/_generated/dataModel';
import Todo from './todo-card';

export default function TodoList({ todos }: { todos: Doc<'todos'>[] }) {
  const sortedTodos = [...todos].sort((a, b) => {
    if (a.isCompleted !== b.isCompleted) {
      return a.isCompleted ? 1 : -1;
    }
    const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    return aDate - bDate;
  });
  return sortedTodos.map((todo) => <Todo key={todo._id} todo={todo} />);
}
