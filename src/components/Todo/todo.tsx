import { cn } from '@/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

export default function Todo({ todo }: { todo: Doc<'todos'> }) {
  const checkTodo = useMutation(api.todo.checkTodo);
  const uncheckTodo = useMutation(api.todo.uncheckTodo);

  const handleOnChangeTodo = () => {
    if (todo.isCompleted) {
      uncheckTodo({ todoId: todo._id }).catch((error) => {
        toast.error('Failed to mark task as incomplete', {
          description: error.message,
        });
      });
    } else {
      checkTodo({ todoId: todo._id })
        .then(() => {
          toast.success('Task marked as complete 🎉', { duration: 3000 });
        })
        .catch((error) => {
          toast.error('Failed to mark task as complete', {
            description: error.message,
          });
        });
    }
  };

  return !todo.isCompleted ? (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-4 gap-2 cursor-pointer">
          <div className="flex justify-between items-start">
            <div
              className="flex gap-3 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                id="todo"
                checked={todo.isCompleted}
                onCheckedChange={handleOnChangeTodo}
                className="size-5"
              />
              <label
                htmlFor="todo"
                className={cn(
                  'text-md font-medium leading-none cursor-pointer'
                )}
              >
                {todo.taskName}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="flex items-center gap-1 bg-blue-500/10 text-blue-500">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                Application
              </Badge>
              <Badge className="flex items-center gap-1 bg-amber-500/10 text-amber-500">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                Application
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-8">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <FontAwesomeIcon icon={faCalendarDays} />
              {todo.dueDate}
            </p>
          </div>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{todo.taskName}</DialogTitle>
          <DialogDescription>{todo.description}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  ) : (
    <Card className="p-4 flex flex-col gap-4 justify-between border-border/50">
      <div className="flex gap-3 items-center">
        <Checkbox
          id="todo"
          checked={todo.isCompleted}
          onCheckedChange={handleOnChangeTodo}
          className="size-5"
        />
        <label
          htmlFor="todo"
          className={cn(
            'text-md font-medium leading-none cursor-pointer',
            todo.isCompleted && 'line-through text-muted-foreground'
          )}
        >
          {todo.taskName}
        </label>
      </div>
    </Card>
  );
}
