import { Doc } from '../../../convex/_generated/dataModel';
import Todo from './todo';

export default function TodoList({ todos }: { todos: Doc<'todos'>[] }) {
  return todos.map((todo) => <Todo key={todo._id} todo={todo} />);
}
