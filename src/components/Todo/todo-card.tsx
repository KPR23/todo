import { cn } from '@/lib/utils';
import {
  faBolt,
  faCalendarDays,
  faEllipsisVertical,
  faFolderOpen,
  faHashtag,
  faICursor,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogTrigger } from '../ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import TodoDialogContent from './todo-dialog-content';

export default function Todo({ todo }: { todo: Doc<'todos'> }) {
  const checkTodo = useMutation(api.todos.checkTodo);
  const uncheckTodo = useMutation(api.todos.uncheckTodo);
  const project = useQuery(api.projects.getProjects)?.find(
    (project) => project._id === todo.projectId
  );
  const label = useQuery(api.labels.getLabels)?.find(
    (label) => label._id === todo.labelId
  );

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
        <Card className="p-4 gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
          <div className="flex justify-between items-start">
            <div
              className="flex gap-3 items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                id={`todo-${todo._id}`}
                checked={todo.isCompleted}
                onCheckedChange={handleOnChangeTodo}
                className="size-5"
              />
              <label
                htmlFor={`todo-${todo._id}`}
                className={cn(
                  'text-md font-medium text-foreground/90 leading-none cursor-pointer'
                )}
              >
                {todo.taskName}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="flex items-center gap-1 bg-blue-500/10 text-blue-500">
                <FontAwesomeIcon icon={faFolderOpen} />
                {project?.name}
              </Badge>
              <Badge className="flex items-center gap-1 bg-amber-500/10 text-amber-500">
                <FontAwesomeIcon icon={faHashtag} />
                {label?.name}
              </Badge>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="size-8">
                    <FontAwesomeIcon icon={faEllipsisVertical} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <FontAwesomeIcon icon={faICursor} />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FontAwesomeIcon icon={faTrashCan} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {todo.priority && (
              <Badge
                className={cn(
                  'flex items-center gap-1 capitalize',
                  todo.priority === 'high' && 'bg-red-500/10 text-red-500',
                  todo.priority === 'medium' &&
                    'bg-yellow-500/10 text-yellow-500',
                  todo.priority === 'low' && 'bg-green-500/10 text-green-500'
                )}
              >
                <FontAwesomeIcon icon={faBolt} />
                {todo.priority}
              </Badge>
            )}
            <Badge className="bg-muted-foreground/10 text-muted-foreground flex justify-center items-center gap-1">
              <FontAwesomeIcon icon={faCalendarDays} />
              {todo.dueDate && format(todo.dueDate, 'MMM d, yyyy')}
            </Badge>
          </div>
        </Card>
      </DialogTrigger>
      <TodoDialogContent todo={todo} project={project} label={label} />
    </Dialog>
  ) : (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="p-4 flex flex-col gap-4 justify-between border-border/50 cursor-pointer">
          <div
            className="flex gap-3 items-center w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              id={`todo-${todo._id}`}
              checked={todo.isCompleted}
              onCheckedChange={handleOnChangeTodo}
              className="size-5"
            />
            <label
              htmlFor={`todo-${todo._id}`}
              className={cn(
                'text-md font-medium leading-none cursor-pointer',
                todo.isCompleted && 'line-through text-muted-foreground'
              )}
            >
              {todo.taskName}
            </label>
          </div>
        </Card>
      </DialogTrigger>
      <TodoDialogContent todo={todo} project={project} label={label} />
    </Dialog>
  );
}
