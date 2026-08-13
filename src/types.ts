export interface CodeFile {
  id: string;
  name: string; // e.g. "principal.ic"
  content: string;
  isExample?: boolean;
  updatedAt?: number;
}

export type SidebarTab = 'files' | 'examples' | 'search' | null;
