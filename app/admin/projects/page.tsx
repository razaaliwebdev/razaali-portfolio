import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { CmdHeading } from "@/components/admin/TerminalUi";
import { listProjects } from "@/lib/actions/projects";

export const metadata: Metadata = {
  title: "Projects",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const items = await listProjects();

  return (
    <AdminShell>
      <div className="space-y-6">
        <CmdHeading
          path="projects"
          command="crud --featured"
          hint="Portfolio projects with publish, featured, and link fields."
        />
        <ProjectsManager items={items} />
      </div>
    </AdminShell>
  );
}
