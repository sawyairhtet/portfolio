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
    FileText,
} from '@phosphor-icons/react';

type Tab = 'resume.md' | 'about.md';

const TABS: { id: Tab; label: string; icon: typeof FileText }[] = [
    { id: 'resume.md', label: 'resume.md', icon: FileText },
    { id: 'about.md', label: 'about.md', icon: FileText },
];

export function TextEditorApp() {
    const reduced = useReducedMotion();
    const [activeTab, setActiveTab] = useState<Tab>('resume.md');

    const fileContents = useMemo(() => {
        const resumeFile = DEFAULT_FILE_SYSTEM['/home/sawyehtet/resume.md'];
        const aboutFile = DEFAULT_FILE_SYSTEM['/home/sawyehtet/documents/about.md'] ?? {
            type: 'file',
            content: `# About Me\n\n${PROFILE.name}\n${PROFILE.role}\n\n## Summary\n\n${PROFILE.summary}\n\n## Education\n\n${PROFILE.education}\n\n## Focus Areas\n\n- Application Support & Production Support\n- SQL Debugging & Database Querying\n- Log Analysis & Incident Triage\n- API Testing & Quality Assurance\n- Java Backend Development\n\n## Contact\n\n${PROFILE.email}\n${PROFILE.location}\n${PROFILE.availability}\n\n## Links\n\n- [GitHub](https://github.com/sawyairhtet)\n- [LinkedIn](https://www.linkedin.com/in/saw-ye-htet-the-man-who-code/)\n- [Resume](${PROFILE.resumePath})`,
        } as const;
        return {
            'resume.md': resumeFile?.type === 'file' ? resumeFile.content : '',
            'about.md': aboutFile?.type === 'file' ? aboutFile.content : '',
        };
    }, []);

    // eslint-disable-next-line security/detect-object-injection
    const initialContent = fileContents[activeTab];
    const [savedContent, setSavedContent] = useState(initialContent);
    const [content, setContent] = useState(initialContent);
    const isModified = content !== savedContent;

    const switchTab = (tab: Tab) => {
        setActiveTab(tab);
        // eslint-disable-next-line security/detect-object-injection
        const newContent = fileContents[tab];
        setContent(newContent);
        setSavedContent(newContent);
    };

    const isResume = activeTab === 'resume.md';

    return (
        <div className="text-editor-app">
            <div className="text-editor-toolbar" aria-label="Editor toolbar">
                {isResume && (
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
                )}
                <div className="text-editor-title">
                    <span className={`text-editor-dot${isModified ? ' modified' : ' saved'}`} />
                    <strong>{activeTab}</strong>
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

            <div className="text-editor-tabs" role="tablist" aria-label="Open files">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        className={`text-editor-tab ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => switchTab(tab.id)}
                    >
                        <tab.icon weight="bold" size={12} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {isResume && (
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
            )}

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
                    aria-label={activeTab}
                />
            </div>
        </div>
    );
}
