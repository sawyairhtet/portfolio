import { useMemo, useState } from 'react';
import { PROJECTS } from '../../config/data';
import { useWindowManager } from '../../context/WindowManagerContext';

type FilesView = 'recent' | 'home' | 'projects';
type LayoutMode = 'list' | 'grid';

export function FilesApp() {
    const { openWindow } = useWindowManager();
    const [view, setView] = useState<FilesView>('recent');
    const [layout, setLayout] = useState<LayoutMode>('list');
    const [selectedId, setSelectedId] = useState(PROJECTS[0]?.id ?? '');

    const files = useMemo(() => {
        if (view === 'home') {
            return [
                { id: 'projects', name: 'Projects', type: 'folder', modified: 'Today', size: '—' },
                { id: 'resume', name: 'resume.md', type: 'text', modified: 'Today', size: '8 KB' },
            ];
        }

        return PROJECTS.map(project => ({
            id: project.id,
            name: `${project.title}.case-study`,
            type: 'project',
            modified: project.featured ? 'Today' : 'Yesterday',
            size: project.featured ? '24 KB' : '16 KB',
            project,
        }));
    }, [view]);

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
                        onClick={() => setView(id as FilesView)}
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
                    <div className="files-view-toggle" aria-label="View mode">
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

                <div className={`files-list ${layout}`} role="listbox" aria-label="Project files">
                    {layout === 'list' && (
                        <div className="files-list-header" aria-hidden="true">
                            <span>Name</span>
                            <span>Modified</span>
                            <span>Size</span>
                        </div>
                    )}
                    {files.map(file => (
                        <button
                            key={file.id}
                            type="button"
                            className={`files-row${selectedId === file.id ? ' selected' : ''}`}
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
