import {
  faCalendarDays,
  faFolderOpen,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import { Doc } from '../../../convex/_generated/dataModel';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';
export default function TodoDialogContent({
  todo,
  project,
  label,
}: {
  todo: Doc<'todos'>;
  project: Doc<'projects'> | undefined;
  label: Doc<'labels'> | undefined;
}) {
  const dueDate = format(todo.dueDate, 'dd MMMM yyyy');
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{todo.taskName}</DialogTitle>
        <DialogDescription>{todo.description}</DialogDescription>
        <div className="flex items-center gap-2">
          <Badge className="flex items-center gap-1 bg-blue-500/10 text-blue-500">
            <FontAwesomeIcon icon={faFolderOpen} />
            {project?.name}
          </Badge>
          <Badge className="flex items-center gap-1 bg-amber-500/10 text-amber-500">
            <FontAwesomeIcon icon={faHashtag} />
            {label?.name}
          </Badge>
        </div>
        {todo.dueDate && (
          <p className="text-sm text-muted-foreground">
            <FontAwesomeIcon icon={faCalendarDays} />
            {dueDate}
          </p>
        )}
      </DialogHeader>
    </DialogContent>
  );
}
