import { cn } from '@/lib/utils';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';
import { Checkbox } from '../ui/checkbox';

export default function AddSubTodo({
  subTodos,
}: {
  subTodos: Doc<'subTodos'>[];
}) {
  const checkSubTodo = useMutation(api.subTodos.checkSubTodo);
  const uncheckSubTodo = useMutation(api.subTodos.uncheckSubTodo);

  const handleOnChangeTodo = (subTodo: Doc<'subTodos'>) => {
    if (subTodo.isCompleted) {
      uncheckSubTodo({ todoId: subTodo._id }).catch((error) => {
        toast.error('Failed to mark sub task as incomplete', {
          description: error.message,
        });
      });
    } else {
      checkSubTodo({ todoId: subTodo._id })
        .then(() => {
          toast.success('Sub task marked as complete 🎉', { duration: 3000 });
        })
        .catch((error) => {
          toast.error('Failed to mark sub task as complete', {
            description: error.message,
          });
        });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {subTodos.map((subTodo) => (
        <div
          key={subTodo._id}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
            'bg-muted/40 hover:bg-muted/60',
            subTodo.isCompleted && 'opacity-60'
          )}
        >
          <Checkbox
            id={`subtodo-${subTodo._id}`}
            checked={subTodo.isCompleted}
            onCheckedChange={() => handleOnChangeTodo(subTodo)}
            className="size-4"
          />
          <label
            htmlFor={`subtodo-${subTodo._id}`}
            className={cn(
              'text-sm font-medium cursor-pointer transition-colors',
              subTodo.isCompleted
                ? 'line-through text-muted-foreground'
                : 'text-foreground/90'
            )}
          >
            {subTodo.taskName}
          </label>
        </div>
      ))}
    </div>
  );
}
