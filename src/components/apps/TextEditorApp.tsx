import { useMemo, useState } from 'react';
import { DEFAULT_FILE_SYSTEM } from '../../config/data';

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
            <div className="text-editor-toolbar" aria-label="Text Editor toolbar">
                <button type="button" aria-label="Open">
                    <i className="fas fa-folder-open" aria-hidden="true" />
                </button>
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
