'use client';

import { cn } from '@/lib/utils';
import {
  faBolt,
  faCalendarDays,
  faCheckCircle,
  faFolderOpen,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQuery } from 'convex/react';
import { format } from 'date-fns';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';
import { Badge } from '../ui/badge';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import AddSubTodo from './add-subtodo';

export default function TodoDialogContent({
  todo,
  project,
  label,
}: {
  todo: Doc<'todos'>;
  project: Doc<'projects'> | undefined;
  label: Doc<'labels'> | undefined;
}) {
  const subtodos =
    useQuery(api.subTodos.getSubTodos, {
      todoId: todo._id,
    }) || [];

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <h1 className="text-lg">{todo.taskName}</h1>
              {todo.isCompleted && (
                <Badge className="bg-green-500/10 text-green-500 ml-2">
                  <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                  Completed
                </Badge>
              )}
            </DialogTitle>
            {todo.description && (
              <DialogDescription className="mb-4">
                {todo.description}
              </DialogDescription>
            )}
          </DialogHeader>
          <div className="mt-4">
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
              Subtasks
            </h4>
            {subtodos.length === 0 ? (
              <p className="text-sm text-muted-foreground">No subtasks</p>
            ) : (
              <AddSubTodo subTodos={subtodos} />
            )}
          </div>
        </div>
        <aside className="w-full sm:w-56 flex-shrink-0 border-l border-border/40 pl-4">
          <div className="flex flex-col gap-3">
            {todo.priority && (
              <Badge
                className={cn(
                  'flex items-center gap-1 capitalize w-fit',
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
            {todo.dueDate && (
              <Badge className="bg-muted-foreground/10 text-muted-foreground flex items-center gap-1 w-fit">
                <FontAwesomeIcon icon={faCalendarDays} />
                {format(todo.dueDate, 'dd MMMM yyyy')}
              </Badge>
            )}
            {project && (
              <Badge className="flex items-center gap-1 bg-blue-500/10 text-blue-500 w-fit">
                <FontAwesomeIcon icon={faFolderOpen} />
                {project.name}
              </Badge>
            )}
            {label && (
              <Badge className="flex items-center gap-1 bg-amber-500/10 text-amber-500 w-fit">
                <FontAwesomeIcon icon={faHashtag} />
                {label.name}
              </Badge>
            )}
          </div>
        </aside>
      </div>
    </DialogContent>
  );
}
