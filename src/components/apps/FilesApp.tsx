import { useMemo, useState } from 'react';
import { PROJECTS } from '../../config/data';
import { useWindowManager } from '../../context/WindowManagerContext';

type FilesView = 'recent' | 'home' | 'projects';
type LayoutMode = 'list' | 'grid';
type FilterPill = 'all' | 'folders' | 'documents' | 'dotfiles';

export function FilesApp() {
    const { openWindow } = useWindowManager();
    const [view, setView] = useState<FilesView>('recent');
    const [layout, setLayout] = useState<LayoutMode>('list');
    const [selectedId, setSelectedId] = useState(PROJECTS[0]?.id ?? '');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<FilterPill>('all');

    const files = useMemo(() => {
        if (view === 'home') {
            return [
                { id: 'projects', name: 'Projects', type: 'folder', modified: 'Today', size: '—', dotfile: false },
                { id: 'documents', name: 'Documents', type: 'folder', modified: 'Today', size: '—', dotfile: false },
                { id: 'resume', name: 'resume.md', type: 'text', modified: 'Today', size: '8 KB', dotfile: false },
                { id: '.bashrc', name: '.bashrc', type: 'text', modified: 'Yesterday', size: '312 B', dotfile: true },
                { id: '.config', name: '.config', type: 'folder', modified: 'Yesterday', size: '—', dotfile: true },
                { id: '.local', name: '.local', type: 'folder', modified: '3 days ago', size: '—', dotfile: true },
            ];
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

        // Apply pill filter
        if (activeFilter === 'folders') {
            result = result.filter(f => f.type === 'folder');
        } else if (activeFilter === 'documents') {
            result = result.filter(f => f.type !== 'folder');
        } else if (activeFilter === 'dotfiles') {
            result = result.filter(f => f.dotfile);
        }

        // Apply search
        if (searchQuery.trim()) {
            const q = searchQuery.trim().toLowerCase();
            result = result.filter(f => f.name.toLowerCase().includes(q));
        }

        return result;
    }, [files, searchQuery, activeFilter]);

    const openSelected = (id: string) => {
        if (id === 'projects') {
            setView('projects');
            return;
        }

        if (id === 'resume') {
            openWindow('text-editor');
            return;
        }

        const match = PROJECTS.find(project => project.id === id);
        if (match) {
            openWindow('projects');
        }
    };

    const FILTER_PILLS: { id: FilterPill; label: string }[] = [
        { id: 'all', label: 'All' },
        { id: 'folders', label: 'Folders' },
        { id: 'documents', label: 'Documents' },
        { id: 'dotfiles', label: 'Dotfiles' },
    ];

    return (
        <div className="files-app">
            <aside className="files-sidebar" aria-label="Places">
                {[
                    ['recent', 'Recent', 'fas fa-clock-rotate-left'],
                    ['home', 'Home', 'fas fa-house'],
                    ['projects', 'Projects', 'fas fa-folder'],
                ].map(([id, label, icon]) => (
                    <button
                        key={id}
                        type="button"
                        className={`files-sidebar-row${view === id ? ' active' : ''}`}
                        onClick={() => {
                            setView(id as FilesView);
                            setSearchQuery('');
                            setActiveFilter('all');
                        }}
                    >
                        <i className={icon} aria-hidden="true" />
                        <span>{label}</span>
                    </button>
                ))}
            </aside>

            <section className="files-view" aria-label="Files">
                <div className="files-toolbar">
                    <div className="files-pathbar" aria-label="Current folder">
                        <button type="button">Home</button>
                        <span>/</span>
                        <button type="button">{view === 'recent' ? 'Recent' : 'Projects'}</button>
                    </div>
                    <div className="files-search-float">
                        <i className="fas fa-search" aria-hidden="true" />
                        <input
                            type="search"
                            placeholder="Search files…"
                            aria-label="Search files"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="files-view-toggle linked" aria-label="View mode">
                        <button
                            type="button"
                            className={layout === 'list' ? 'active' : ''}
                            aria-label="List View"
                            onClick={() => setLayout('list')}
                        >
                            <i className="fas fa-list" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className={layout === 'grid' ? 'active' : ''}
                            aria-label="Grid View"
                            onClick={() => setLayout('grid')}
                        >
                            <i className="fas fa-grip" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Pill filters — Nautilus style */}
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

                <div
                    className={`files-list ${layout}`}
                    role="listbox"
                    aria-label="Project files"
                >
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
                                <i
                                    className={
                                        file.type === 'folder'
                                            ? 'fas fa-folder'
                                            : 'fas fa-file-lines'
                                    }
                                    aria-hidden="true"
                                />
                                <span>{file.name}</span>
                            </span>
                            <span>{file.modified}</span>
                            <span>{file.size}</span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );
}
