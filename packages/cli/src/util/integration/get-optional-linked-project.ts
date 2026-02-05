import type Client from '../client';
import { getLinkedProject } from '../projects/link';

export async function getOptionalLinkedProject(client: Client) {
  const linkedProject = await getLinkedProject(client);

  if (linkedProject.status === 'not_linked') {
    return;
  }

  const shouldLinkToProject = await client.input.confirm(
    'Do you want to link this resource to the current project?',
    true
  );

  if (!shouldLinkToProject) {
    return;
  }

  if (linkedProject.status === 'error') {
    return { status: 'error' as const, exitCode: linkedProject.exitCode };
  }

  return { status: 'success' as const, project: linkedProject.project };
}
