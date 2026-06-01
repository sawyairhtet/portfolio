import { memo } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { PROFILE } from '../../config/profile';
import type { AppId } from '../../types';
import {
    EnvelopeSimple,
    FileArrowDown,
} from '@phosphor-icons/react';

type RecruiterPathAction =
    | { label: string; appId: AppId }
    | { label: string; href: string; download?: boolean };

const RECRUITER_PATH: RecruiterPathAction[] = [
    { label: 'Projects', appId: 'projects' },
    { label: 'Skills', appId: 'skills' },
    { label: 'Resume', href: PROFILE.resumePath, download: true },
    { label: 'Contact', appId: 'contact' },
];

const SYSTEM_INFO_ROWS: [string, string][] = [
    ['Full Name', PROFILE.name],
    ['Role', PROFILE.role],
    ['Target', PROFILE.roleTarget],
    ['Location', PROFILE.location],
    ['Education', PROFILE.education],
    ['Availability', PROFILE.availability],
    ['Stack', PROFILE.primaryStack.join(', ')],
];

export const AboutApp = memo(function AboutApp() {
    const { openWindow } = useWindowManager();

    return (
        <div className="adw-page">
            <section className="adw-section">
                <div className="adw-boxed-list">
                    {SYSTEM_INFO_ROWS.map(([label, value]) => (
                        <div className="adw-row" key={label}>
                            <span className="adw-row-label">{label}</span>
                            <span className="adw-row-value">{value}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="adw-section">
                <p className="adw-section-desc">{PROFILE.summary}</p>
            </section>

            <section className="adw-section">
                <span className="adw-section-label">Recruiter Path</span>
                <div className="about-recruiter-links">
                    {RECRUITER_PATH.map(action =>
                        'appId' in action ? (
                            <button
                                key={action.appId}
                                type="button"
                                className="adw-link-btn"
                                onClick={() => openWindow(action.appId)}
                            >
                                {action.label} &rarr;
                            </button>
                        ) : (
                            <a
                                key={action.href}
                                href={action.href}
                                download={action.download}
                                className="adw-link-btn"
                            >
                                {action.label} &rarr;
                            </a>
                        )
                    )}
                </div>
            </section>

            <section className="adw-section">
                <div className="adw-action-buttons">
                    <button
                        type="button"
                        className="adw-btn-suggested"
                        onClick={() => openWindow('contact')}
                    >
                        <EnvelopeSimple weight="bold" size={16} />
                        Contact
                    </button>
                    <a
                        href={PROFILE.resumePath}
                        download
                        className="adw-btn"
                    >
                        <FileArrowDown weight="bold" size={16} />
                        Resume
                    </a>
                </div>
            </section>
        </div>
    );
});
