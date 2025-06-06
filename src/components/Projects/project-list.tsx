import { Doc } from '../../../convex/_generated/dataModel';
import ProjectCard from './project-card';

export default function ProjectList({
  projects,
}: {
  projects: Doc<'projects'>[];
}) {
  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => (
        <ProjectCard key={project._id} project={project} />
      ))}
    </div>
  );
}
