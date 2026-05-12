import { useMemo, useState } from 'react';
import { DEFAULT_FILE_SYSTEM } from '../../config/data';
import { PROFILE } from '../../config/profile';

export function TextEditorApp() {
    const initialContent = useMemo(() => {
        const file = DEFAULT_FILE_SYSTEM['/home/sawyehtet/resume.md'];
        return file?.type === 'file' ? file.content : '';
    }, []);
    const [savedContent, setSavedContent] = useState(initialContent);
    const [content, setContent] = useState(initialContent);
    const isModified = content !== savedContent;

    return (
        <div className="text-editor-app">
            <div className="text-editor-toolbar" aria-label="Resume toolbar">
                <a
                    className="text-editor-toolbar-button"
                    href={PROFILE.resumePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open resume PDF"
                    title="Open resume PDF"
                >
                    <i className="fas fa-folder-open" aria-hidden="true" />
                </a>
                <div className="text-editor-title">
                    <strong>resume.md</strong>
                    <span>{isModified ? 'Unsaved Changes' : 'Saved'}</span>
                </div>
                <button
                    type="button"
                    aria-label="Save"
                    onClick={() => setSavedContent(content)}
                    disabled={!isModified}
                >
                    <i className="fas fa-floppy-disk" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    aria-label="Undo changes"
                    onClick={() => setContent(savedContent)}
                    disabled={!isModified}
                >
                    <i className="fas fa-rotate-left" aria-hidden="true" />
                </button>
            </div>
            <section className="resume-file-panel" aria-label="Resume file details">
                <div className="resume-file-copy">
                    <span className="resume-file-eyebrow">Resume</span>
                    <h3>{PROFILE.role}</h3>
                    <p>
                        The PDF is the source of truth. This markdown copy is a readable fallback
                        for the portfolio desktop and terminal.
                    </p>
                </div>
                <div className="resume-file-actions">
                    <a
                        className="adw-btn adw-btn-suggested"
                        href={PROFILE.resumePath}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" />
                        Open PDF
                    </a>
                    <a className="adw-btn" href={PROFILE.resumePath} download>
                        <i className="fas fa-download" aria-hidden="true" />
                        Download
                    </a>
                </div>
                <dl className="resume-file-meta">
                    <div>
                        <dt>Format</dt>
                        <dd>PDF + markdown fallback</dd>
                    </div>
                    <div>
                        <dt>Focus</dt>
                        <dd>{PROFILE.primaryStack.join(', ')}</dd>
                    </div>
                    <div>
                        <dt>Location</dt>
                        <dd>{PROFILE.location}</dd>
                    </div>
                    <div>
                        <dt>Email</dt>
                        <dd>
                            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                        </dd>
                    </div>
                </dl>
            </section>
            <div className="text-editor-document">
                <div className="text-editor-lines" aria-hidden="true">
                    {content.split('\n').map((_, index) => (
                        <span key={index}>{index + 1}</span>
                    ))}
                </div>
                <textarea
                    value={content}
                    onChange={event => setContent(event.target.value)}
                    spellCheck="false"
                    aria-label="resume.md"
                />
            </div>
        </div>
    );
}
