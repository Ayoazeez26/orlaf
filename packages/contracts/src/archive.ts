export type ArchiveItemType = "project" | "episode" | "promotion";

export type ArchiveIcon = "folder" | "film" | "megaphone";

export interface ArchivedItem {
  id: string;
  entityId: string;
  type: ArchiveItemType;
  title: string;
  archivedAt: string;
  sizeBytes: number | null;
  icon: ArchiveIcon;
  seriesId?: string;
  seriesTitle?: string;
}

export interface ArchiveCounts {
  all: number;
  projects: number;
  episodes: number;
  promotions: number;
}

export interface ArchiveListResponse {
  items: ArchivedItem[];
  counts: ArchiveCounts;
}
