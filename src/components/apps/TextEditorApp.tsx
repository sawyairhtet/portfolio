import { useMemo, useState } from 'react';
import { DEFAULT_FILE_SYSTEM } from '../../config/data';
import { PROFILE } from '../../config/profile';
import { motion, useReducedMotion } from 'framer-motion';
import {
    FolderOpen,
    FloppyDisk,
    ArrowCounterClockwise,
    ArrowSquareOut,
    DownloadSimple,
} from '@phosphor-icons/react';

export function TextEditorApp() {
    const reduced = useReducedMotion();
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
                    <FolderOpen weight="bold" size={15} />
                </a>
                <div className="text-editor-title">
                    <span className={`text-editor-dot${isModified ? ' modified' : ' saved'}`} />
                    <strong>resume.md</strong>
                    <span>{isModified ? 'Unsaved Changes' : 'Saved'}</span>
                </div>
                <button
                    type="button"
                    aria-label="Save"
                    onClick={() => setSavedContent(content)}
                    disabled={!isModified}
                >
                    <FloppyDisk weight="bold" size={15} />
                </button>
                <button
                    type="button"
                    aria-label="Undo changes"
                    onClick={() => setContent(savedContent)}
                    disabled={!isModified}
                >
                    <ArrowCounterClockwise weight="bold" size={15} />
                </button>
            </div>

            <div className="resume-header-card">
                <div className="resume-header-gradient" aria-hidden="true" />
                <div className="resume-header-left">
                    <h3>{PROFILE.role}</h3>
                    <span>{PROFILE.name}</span>
                    <span className="resume-header-sub">{PROFILE.education}</span>
                </div>
                <div className="resume-header-right">
                    <motion.a
                        className="resume-header-btn primary"
                        href={PROFILE.resumePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={reduced ? undefined : { scale: 1.02 }}
                        whileTap={reduced ? undefined : { scale: 0.97 }}
                    >
                        <ArrowSquareOut weight="bold" size={14} />
                        Open PDF
                    </motion.a>
                    <motion.a
                        className="resume-header-btn"
                        href={PROFILE.resumePath}
                        download
                        whileHover={reduced ? undefined : { scale: 1.02 }}
                        whileTap={reduced ? undefined : { scale: 0.97 }}
                    >
                        <DownloadSimple weight="bold" size={14} />
                        Download
                    </motion.a>
                </div>
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
