import type { LucideIcon } from "lucide-react"

export type WorkspaceRoleId =
  | "super-admin"
  | "content-admin"
  | "marketing-admin"
  | "finance-admin"
  | "support-admin"

export type Tone = "primary" | "positive" | "warning" | "danger" | "info"

export interface NavItem {
  /** Splat segment appended to /workspace/$role, e.g. "analytics". */
  key: string
  label: string
  icon: LucideIcon
}

export interface NavGroup {
  label?: string
  items: NavItem[]
}

export interface MetricDef {
  label: string
  value: string
  icon: LucideIcon
}

export interface ProgressRow {
  label: string
  value: string
  percent: number
  tone: Tone
}

export interface PanelItem {
  id: string
  title: string
  subtitle: string
  icon: LucideIcon
  tone: Tone
  /** When set, rendered as trailing text (e.g. "2m ago") instead of an arrow. */
  trailing?: string
}

export interface PrimaryPanel {
  title: string
  actionLabel?: string
  progress?: ProgressRow[]
  items: PanelItem[]
}

export interface StatRow {
  label: string
  value: string
}

export type SideCard =
  | { kind: "items"; title: string; actionLabel?: string; items: PanelItem[] }
  | { kind: "progress"; title: string; rows: ProgressRow[] }
  | { kind: "stats"; title: string; rows: StatRow[] }

export interface WorkspaceHome {
  metrics: MetricDef[]
  primary: PrimaryPanel
  side: SideCard[]
}

export interface WorkspaceUser {
  fullName: string
  initials: string
  email: string
}

export interface WorkspacePicker {
  title: string
  description: string
  icon: LucideIcon
  tone: Tone
}

export interface WorkspaceConfig {
  id: WorkspaceRoleId
  /** Display name shown in the sidebar and user profile, e.g. "Content Admin". */
  name: string
  navGroups: NavGroup[]
  user: WorkspaceUser
  home: WorkspaceHome
  picker: WorkspacePicker
}
