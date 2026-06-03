import { memo } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { PROFILE } from '../../config/profile';
import type { AppId } from '../../types';
import { EnvelopeSimple, FileArrowDown, ArrowRight } from '@phosphor-icons/react';

type RecruiterStep =
    | { label: string; appId: AppId }
    | { label: string; href: string; download?: boolean };

const RECRUITER_PATH: RecruiterStep[] = [
    { label: 'Projects', appId: 'projects' },
    { label: 'Skills', appId: 'skills' },
    { label: 'Resume', href: PROFILE.resumePath, download: true },
    { label: 'Contact', appId: 'contact' },
];

const DETAIL_ROWS: [string, string][] = [
    ['Target Role', PROFILE.roleTarget],
    ['Location', PROFILE.location],
    ['Education', PROFILE.education],
    ['Availability', PROFILE.availability],
];

export const AboutApp = memo(function AboutApp() {
    const { openWindow } = useWindowManager();

    return (
        <div className="about-page">
            <header className="about-hero">
                <div className="about-avatar-ring">
                    <img
                        className="about-avatar"
                        src="/images/profile-picture.webp"
                        alt={PROFILE.name}
                        width={104}
                        height={104}
                        loading="eager"
                        decoding="async"
                    />
                </div>
                <h1 className="about-name">{PROFILE.name}</h1>
                <p className="about-role">{PROFILE.role}</p>
                <p className="about-subtitle">{PROFILE.subtitle}</p>

                <span className="about-availability">
                    <span className="about-availability-dot" aria-hidden="true" />
                    {PROFILE.availability}
                </span>

                <div className="about-cta-row">
                    <button
                        type="button"
                        className="about-cta about-cta-primary"
                        onClick={() => openWindow('contact')}
                    >
                        <EnvelopeSimple weight="bold" size={16} />
                        Contact
                    </button>
                    <a href={PROFILE.resumePath} download className="about-cta">
                        <FileArrowDown weight="bold" size={16} />
                        Resume
                    </a>
                </div>
            </header>

            <section className="about-section">
                <span className="adw-section-label">About</span>
                <p className="about-bio">{PROFILE.summary}</p>
            </section>

            <section className="about-section">
                <span className="adw-section-label">Details</span>
                <div className="adw-boxed-list">
                    {DETAIL_ROWS.map(([label, value]) => (
                        <div className="adw-row" key={label}>
                            <span className="adw-row-label">{label}</span>
                            <span className="adw-row-value">{value}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="about-section">
                <span className="adw-section-label">Core Stack</span>
                <div className="about-stack">
                    {PROFILE.primaryStack.map(tech => (
                        <span className="about-stack-chip" key={tech}>
                            {tech}
                        </span>
                    ))}
                </div>
            </section>

            <section className="about-section">
                <span className="adw-section-label">Recruiter Path</span>
                <nav className="about-path" aria-label="Recruiter path">
                    {RECRUITER_PATH.map((step, index) => {
                        const content = (
                            <>
                                <span className="about-step-index">{index + 1}</span>
                                <span className="about-step-label">{step.label}</span>
                                <ArrowRight className="about-step-arrow" weight="bold" size={14} />
                            </>
                        );
                        return 'appId' in step ? (
                            <button
                                key={step.label}
                                type="button"
                                className="about-step-btn"
                                onClick={() => openWindow(step.appId)}
                            >
                                {content}
                            </button>
                        ) : (
                            <a
                                key={step.label}
                                href={step.href}
                                download={step.download}
                                className="about-step-btn"
                            >
                                {content}
                            </a>
                        );
                    })}
                </nav>
            </section>
        </div>
    );
});
