import { memo, useMemo, useState } from 'react';
import { PROJECTS, WALLPAPERS } from '../../config/data';
import { useWindowManager } from '../../context/WindowManagerContext';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    FolderSimple,
    FileText,
    FileCode,
    FileCss,
    Clock,
    House,
    Folder,
    MagnifyingGlass,
    List,
    GridFour,
} from '@phosphor-icons/react';

type FilesView = 'recent' | 'home' | 'projects' | 'pictures';
type LayoutMode = 'list' | 'grid';
type FilterPill = 'all' | 'folders' | 'documents' | 'dotfiles';

function FileIcon({ type, name, size }: { type: string; name: string; size?: number }) {
    const s = size || 20;
    if (type === 'folder')
        return <FolderSimple weight="duotone" size={s} className="file-icon-folder" />;
    if (name.endsWith('.md'))
        return <FileText weight="duotone" size={s} className="file-icon-md" />;
    if (name.endsWith('.css'))
        return <FileCss weight="duotone" size={s} className="file-icon-css" />;
    if (
        name.endsWith('.webp') ||
        name.endsWith('.png') ||
        name.endsWith('.jpg') ||
        name.endsWith('.svg')
    ) {
        return (
            <FolderSimple
                weight="duotone"
                size={s}
                className="file-icon-image"
                style={{ color: 'var(--accent-yellow)' }}
            />
        );
    }
    if (name.endsWith('.case-study'))
        return <FileText weight="duotone" size={s} className="file-icon-casestudy" />;
    if (name.startsWith('.'))
        return <FileCode weight="duotone" size={s} className="file-icon-dotfile" />;
    return <FileText weight="duotone" size={s} className="file-icon-default" />;
}

export const FilesApp = memo(function FilesApp() {
    const { openWindow } = useWindowManager();
    const reduced = useReducedMotion();
    const [view, setView] = useState<FilesView>('recent');
    const [layout, setLayout] = useState<LayoutMode>('list');
    const [selectedId, setSelectedId] = useState(PROJECTS[0]?.id ?? '');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterPill>('all');
    const [showHiddenFiles, setShowHiddenFiles] = useState(false);

    const files = useMemo(() => {
        if (view === 'home') {
            return [
                {
                    id: 'projects',
                    name: 'Projects',
                    type: 'folder',
                    modified: 'Today',
                    size: '—',
                    dotfile: false,
                },
                {
                    id: 'documents',
                    name: 'Documents',
                    type: 'folder',
                    modified: 'Today',
                    size: '—',
                    dotfile: false,
                },
                {
                    id: 'pictures',
                    name: 'Pictures',
                    type: 'folder',
                    modified: 'Today',
                    size: '—',
                    dotfile: false,
                },
                {
                    id: 'resume',
                    name: 'resume.md',
                    type: 'text',
                    modified: 'Today',
                    size: '8 KB',
                    dotfile: false,
                },
                {
                    id: '.bashrc',
                    name: '.bashrc',
                    type: 'text',
                    modified: 'Yesterday',
                    size: '312 B',
                    dotfile: true,
                },
                {
                    id: '.config',
                    name: '.config',
                    type: 'folder',
                    modified: 'Yesterday',
                    size: '—',
                    dotfile: true,
                },
                {
                    id: '.local',
                    name: '.local',
                    type: 'folder',
                    modified: '3 days ago',
                    size: '—',
                    dotfile: true,
                },
            ];
        }

        if (view === 'pictures') {
            return WALLPAPERS.map(wp => ({
                id: `image-${wp.id}`,
                name: wp.image ? `${wp.id}.webp` : `${wp.id}.svg`,
                type: 'image',
                modified: 'Today',
                size: '480 KB',
                dotfile: false,
            }));
        }

        return PROJECTS.map(project => ({
            id: project.id,
            name: `${project.title}.case-study`,
            type: 'project',
            modified: project.featured ? 'Today' : 'Yesterday',
            size: project.featured ? '24 KB' : '16 KB',
            project,
            dotfile: false,
        }));
    }, [view]);

    const filteredFiles = useMemo(() => {
        let result = files;

        if (!showHiddenFiles) {
            result = result.filter(f => !f.dotfile);
        }

        if (activeFilter === 'folders') {
            result = result.filter(f => f.type === 'folder');
        } else if (activeFilter === 'documents') {
            result = result.filter(f => f.type !== 'folder');
        } else if (activeFilter === 'dotfiles') {
            result = result.filter(f => f.dotfile);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            result = result.filter(f => f.name.toLowerCase().includes(q));
        }

        return result;
    }, [files, searchQuery, activeFilter, showHiddenFiles]);

    const openSelected = (id: string) => {
        if (id === 'projects') {
            setView('projects');
            return;
        }

        if (id === 'pictures') {
            setView('pictures');
            return;
        }

        if (id === 'resume') {
            openWindow('text-editor');
            return;
        }

        if (id.startsWith('image-')) {
            openWindow('image-viewer');
            return;
        }

        const match = PROJECTS.find(project => project.id === id);
        if (match) {
            openWindow('projects');
        }
    };

    const selectedFile = filteredFiles.find(f => f.id === selectedId);

    const FILTER_PILLS: { id: FilterPill; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'folders', label: 'Folders' },
        { id: 'documents', label: 'Documents' },
        { id: 'dotfiles', label: 'Dotfiles' },
    ];

    const SIDEBAR_SECTIONS = [
        {
            label: 'Places',
            items: [
                {
                    id: 'recent' as FilesView,
                    label: 'Recent',
                    icon: <Clock weight="duotone" size={16} />,
                },
                {
                    id: 'home' as FilesView,
                    label: 'Home',
                    icon: <House weight="duotone" size={16} />,
                },
            ],
        },
        {
            label: 'Bookmarks',
            items: [
                {
                    id: 'projects' as FilesView,
                    label: 'Projects',
                    icon: <Folder weight="duotone" size={16} />,
                },
                {
                    id: 'pictures' as FilesView,
                    label: 'Pictures',
                    icon: <FolderSimple weight="duotone" size={16} />,
                },
            ],
        },
    ];

    return (
        <div className="files-app">
            <aside className="files-sidebar" aria-label="Places">
                {SIDEBAR_SECTIONS.map(section => (
                    <div key={section.label} className="files-sidebar-section">
                        <span className="files-sidebar-heading">{section.label}</span>
                        {section.items.map(item => (
                            <button
                                key={item.id}
                                type="button"
                                className={`files-sidebar-row${view === item.id ? ' active' : ''}`}
                                onClick={() => {
                                    setView(item.id);
                                    setSearchQuery('');
                                    setActiveFilter('all');
                                }}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                ))}
            </aside>

            <section className="files-view" aria-label="Files">
                <div className="files-toolbar">
                    <div className="files-pathbar" aria-label="Current folder">
                        <button type="button" onClick={() => setView('home')}>
                            Home
                        </button>
                        <span>/</span>
                        <button type="button">
                            {view === 'recent'
                                ? 'Recent'
                                : view === 'home'
                                  ? 'Home'
                                  : view === 'projects'
                                    ? 'Projects'
                                    : 'Pictures'}
                        </button>
                    </div>
                    <div className="files-search-float">
                        <MagnifyingGlass weight="bold" size={13} />
                        <input
                            type="search"
                            placeholder="Search files…"
                            aria-label="Search files"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="button"
                        className={`headerbar-btn${showHiddenFiles ? ' active' : ''}`}
                        title="Show Hidden Files"
                        aria-label="Show Hidden Files"
                        onClick={() => setShowHiddenFiles(p => !p)}
                        style={{
                            minWidth: '34px',
                            minHeight: '34px',
                            padding: '0 10px',
                            borderRadius: 'var(--button_radius)',
                            background: showHiddenFiles
                                ? 'var(--active-toggle-bg-color)'
                                : 'transparent',
                            color: showHiddenFiles ? 'var(--active-toggle-fg-color)' : 'inherit',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            marginRight: '6px',
                        }}
                    >
                        .*
                    </button>
                    <div className="files-view-toggle linked" aria-label="View mode">
                        <button
                            type="button"
                            className={layout === 'list' ? 'active' : ''}
                            aria-label="List View"
                            onClick={() => setLayout('list')}
                        >
                            <List weight="bold" size={16} />
                        </button>
                        <button
                            type="button"
                            className={layout === 'grid' ? 'active' : ''}
                            aria-label="Grid View"
                            onClick={() => setLayout('grid')}
                        >
                            <GridFour weight="bold" size={16} />
                        </button>
                    </div>
                </div>

                {searchQuery.trim() && (
                    <div className="files-pill-filters" aria-label="Filter results">
                        {FILTER_PILLS.map(pill => (
                            <button
                                key={pill.id}
                                type="button"
                                className={`files-pill${activeFilter === pill.id ? ' active' : ''}`}
                                onClick={() => setActiveFilter(pill.id)}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>
                )}

                <div className={`files-list ${layout}`} role="listbox" aria-label="Project files">
                    {layout === 'list' && (
                        <div className="files-list-header" aria-hidden="true">
                            <span>Name</span>
                            <span>Modified</span>
                            <span>Size</span>
                        </div>
                    )}
                    {filteredFiles.map(file => (
                        <button
                            key={file.id}
                            type="button"
                            className={`files-row${selectedId === file.id ? ' selected' : ''}${file.dotfile ? ' dotfile' : ''}`}
                            role="option"
                            aria-selected={selectedId === file.id}
                            onClick={() => setSelectedId(file.id)}
                            onDoubleClick={() => openSelected(file.id)}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    openSelected(file.id);
                                }
                            }}
                        >
                            <span className="files-name">
                                <FileIcon
                                    type={file.type}
                                    name={file.name}
                                    size={layout === 'grid' ? 48 : 20}
                                />
                                <span>{file.name}</span>
                            </span>
                            <span>{file.modified}</span>
                            <span>{file.size}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence>
                    {selectedFile && (
                        <motion.div
                            className="files-status-bar"
                            initial={reduced ? false : { y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 30, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <span>1 item selected</span>
                            <span>{selectedFile.size}</span>
                            <span>{selectedFile.modified}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
});
