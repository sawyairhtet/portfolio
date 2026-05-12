import { useWindowManager } from '../../context/WindowManagerContext';
import { PROFILE, SOCIAL_LINKS } from '../../config/profile';
import type { AppId } from '../../types';

const HERO_SOCIAL_LINKS = SOCIAL_LINKS.filter(({ label }) =>
    ['GitHub', 'LinkedIn'].includes(label)
);

type RecruiterPathAction =
    | { label: string; appId: AppId; icon: string }
    | { label: string; href: string; icon: string; download?: boolean };

const RECRUITER_PATH: RecruiterPathAction[] = [
    { label: 'Projects', appId: 'projects', icon: 'fas fa-folder-open' },
    { label: 'Skills', appId: 'skills', icon: 'fas fa-tools' },
    { label: 'Resume', href: PROFILE.resumePath, icon: 'fas fa-file-arrow-down', download: true },
    { label: 'Contact', appId: 'contact', icon: 'fas fa-paper-plane' },
];

export function AboutApp() {
    const { openWindow } = useWindowManager();

    return (
        <>
            <div className="about-hero">
                <div className="about-avatar">
                    <picture>
                        <source srcSet="/images/profile-picture.webp" type="image/webp" />
                        <img
                            src="/images/profile-picture.webp"
                            alt="Saw Ye Htet"
                            className="profile-img"
                            width={120}
                            height={120}
                            loading="eager"
                            onError={e => {
                                const img = e.target as HTMLImageElement;
                                img.style.display = 'none';
                                const avatar = img.closest('.about-avatar');
                                if (avatar && !avatar.querySelector('.avatar-fallback')) {
                                    const fallback = document.createElement('span');
                                    fallback.className = 'avatar-fallback';
                                    fallback.textContent = 'SY';
                                    avatar.appendChild(fallback);
                                }
                            }}
                        />
                    </picture>
                </div>
                <h2>Saw Ye Htet</h2>
                <p className="about-tagline">{PROFILE.role}</p>
                <p className="about-institution">{PROFILE.education}</p>
                <div className="about-hero-actions">
                    <button
                        className="about-cta-btn about-cta-primary"
                        onClick={() => openWindow('contact')}
                    >
                        <i className="fas fa-envelope" aria-hidden="true" /> Contact Me
                    </button>
                    <a
                        className="about-cta-btn about-cta-secondary"
                        href={PROFILE.resumePath}
                        download
                    >
                        <i className="fas fa-file-arrow-down" aria-hidden="true" /> Resume
                    </a>
                    {HERO_SOCIAL_LINKS.map(link => (
                        <a
                            key={link.href}
                            className="about-cta-btn about-cta-secondary about-social-link"
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open ${link.label} profile`}
                        >
                            <i className={link.icon} aria-hidden="true" /> {link.label}
                        </a>
                    ))}
                </div>
            </div>
            <div className="recruiter-summary" aria-label="Recruiter summary">
                {[
                    ['Role', PROFILE.role],
                    ['Target', PROFILE.roleTarget],
                    ['Education', PROFILE.education],
                    ['Location', PROFILE.location],
                    ['Availability', PROFILE.availability],
                    ['Stack', PROFILE.primaryStack.join(' · ')],
                ].map(([label, value]) => (
                    <div key={label} className="summary-row">
                        <span>{label}</span>
                        <strong>{value}</strong>
                    </div>
                ))}
            </div>
            <nav className="about-recruiter-path" aria-label="Recruiter path">
                {RECRUITER_PATH.map(action =>
                    'appId' in action ? (
                        <button
                            key={action.appId}
                            type="button"
                            onClick={() => openWindow(action.appId)}
                        >
                            <i className={action.icon} aria-hidden="true" />
                            <span>{action.label}</span>
                        </button>
                    ) : (
                        <a
                            key={action.href}
                            href={action.href}
                            download={action.download}
                            className="about-recruiter-link"
                        >
                            <i className={action.icon} aria-hidden="true" />
                            <span>{action.label}</span>
                        </a>
                    )
                )}
            </nav>
            <div className="about-content">
                <div className="about-section">
                    <h3>
                        <i className="fas fa-user" aria-hidden="true" /> About Me
                    </h3>
                    <p>
                        {PROFILE.summary} I am aiming for junior Java/backend roles where I can
                        keep strengthening fundamentals through practical work.
                    </p>
                </div>
                <div className="about-section about-grouped">
                    <h3>
                        <i className="fas fa-id-card" aria-hidden="true" /> Snapshot
                    </h3>
                    {[
                        [
                            'Current Focus',
                            'Building practical Spring Boot, SQL, OOP, REST API, and clean application design experience.',
                        ],
                        ['Education', PROFILE.education],
                        [
                            'This Portfolio',
                            'Designed and built this Fedora/GNOME-inspired desktop portfolio in React 19, TypeScript, and Vite with window management, search, terminal, and mobile launcher behavior.',
                        ],
                        [
                            'Working Style',
                            'Learns by building, keeps claims grounded in shipped work, and prefers clear structure over flashy complexity.',
                        ],
                    ].map(([label, value]) => (
                        <div key={label} className="about-grouped-row">
                            <span>{label}</span>
                            <p>{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
