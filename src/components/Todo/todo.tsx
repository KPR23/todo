import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';
import { Checkbox } from '../ui/checkbox';

export default function Todo({ todo }: { todo: Doc<'todos'> }) {
  const checkTodo = useMutation(api.todo.checkTodo);
  const uncheckTodo = useMutation(api.todo.uncheckTodo);

  const handleOnChangeTodo = () => {
    if (todo.isCompleted) {
      uncheckTodo({ todoId: todo._id });
    } else {
      checkTodo({ todoId: todo._id });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="todo"
        checked={todo.isCompleted}
        onCheckedChange={handleOnChangeTodo}
      />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {todo.taskName}
      </label>
    </div>
  );
}
