import {
  faEllipsisVertical,
  faFolderOpen,
  faICursor,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { Doc } from '../../../convex/_generated/dataModel';
import { Card } from '../ui/card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';

export default function ProjectCard({ project }: { project: Doc<'projects'> }) {
  return (
    <Card className="p-4 gap-1 cursor-pointer hover:bg-muted/50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 items-center ">
          <FontAwesomeIcon icon={faFolderOpen} />
          {project.name}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-6 px-4">
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
    </Card>
  );
}
