'use client';

import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ProjectList from '@/components/Projects/project-list';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

export default function Projects() {
  const projects = useQuery(api.projects.getProjects) || [];
  const systemProjects = projects.filter(
    (project) => project.type === 'system'
  );
  return (
    <main className="flex flex-col p-6 grow">
      <div className="flex flex-col gap-4 mx-auto w-full max-w-6xl">
        <div className="flex justify-between items-center">
          <h1 className="text-lg md:text-2xl font-semibold">Projects</h1>
          <div className="flex gap-2">
            <Button>
              <FontAwesomeIcon icon={faPlus} />
              Add Project
            </Button>
          </div>
        </div>
        <hr className="my-2 w-full border-t border-zinc-950/10 dark:border-white/10" />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl mt-4 mb-2 font-bold">All</h2>
          <ProjectList projects={projects} />
          <h2 className="text-2xl mt-4 mb-2 font-bold">System</h2>
          <ProjectList projects={systemProjects} />
        </div>
      </div>
    </main>
  );
}
