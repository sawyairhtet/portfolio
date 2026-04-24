// ============================================
// FILE SYSTEM TYPES
// ============================================

export interface FileNode {
    type: 'file';
    content: string;
}

export interface DirNode {
    type: 'dir';
    children: string[];
}

export type FileSystemNode = FileNode | DirNode;

export type FileSystem = Record<string, FileSystemNode>;

// ============================================
// STICKY NOTE TYPES
// ============================================

export interface StickyNote {
    text: string;
    color: 'yellow' | 'pink' | 'blue' | 'green';
    rotation: number;
    x: number;
    y: number;
}

// ============================================
// DEVICE / LAYOUT TYPES
// ============================================

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export type AppId =
    | 'about'
    | 'skills'
    | 'projects'
    | 'contact'
    | 'links'
    | 'terminal'
    | 'settings'
    | 'focus-mode';

export interface WindowInfo {
    appId: AppId;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    zIndex: number;
    position: { top: string; left: string };
    size: { width: string; height: string };
    snapState: 'none' | 'left' | 'right';
}

// ============================================
// APP DEFINITION TYPES
// ============================================

export interface AppDefinition {
    id: AppId;
    label: string;
    icon: string;
    dockTooltip: string;
    gradient: string;
    description: string;
    aliases: string[];
    desktopDock: boolean;
    mobileDock: boolean;
}

// ============================================
// PORTFOLIO CONTENT TYPES
// ============================================

export interface ProjectLink {
    label: string;
    href: string;
    icon: string;
    primary?: boolean;
}

export interface ProjectMedia {
    type: 'image';
    src: string;
    alt: string;
}

export interface Project {
    id: string;
    title: string;
    role: string;
    summary: string;
    techStack: string[];
    platform: string;
    proofPoints: string[];
    links: ProjectLink[];
    featured: boolean;
    icon: string;
    media?: ProjectMedia;
}

export interface SkillItem {
    name: string;
    context: string;
    usedIn: string[];
}

export interface SkillCategory {
    title: string;
    icon: string;
    skills: SkillItem[];
}

// ============================================
// NOTIFICATION TYPES
// ============================================

export interface Notification {
    id: string;
    title: string;
    body: string;
    icon: string;
    iconBg: string;
    time: string;
    group: string;
}

export interface Toast {
    id: string;
    message: string;
    icon: string;
}

// ============================================
// WALLPAPER TYPES
// ============================================

export interface WallpaperOption {
    id: string;
    label: string;
    gradient: string | null;
}

// ============================================
// SETTINGS TYPES
// ============================================

export interface AccentColor {
    color: string;
    label: string;
}

export interface PortfolioPreferences {
    wallpaperId: string;
    brightness: number;
    showWindowButtons: boolean;
    enableSnap: boolean;
    enableResize: boolean;
    focusDim: boolean;
    fastBoot: boolean;
}
