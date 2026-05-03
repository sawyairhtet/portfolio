import { useWindowManager } from '../../context/WindowManagerContext';
import { PROFILE, SOCIAL_LINKS } from '../../config/profile';
import type { AppId } from '../../types';

const HERO_SOCIAL_LINKS = SOCIAL_LINKS.filter(({ label }) =>
    ['GitHub', 'LinkedIn'].includes(label)
);

const RECRUITER_PATH: { label: string; appId: AppId; icon: string }[] = [
    { label: 'Skills', appId: 'skills', icon: 'fas fa-tools' },
    { label: 'Projects', appId: 'projects', icon: 'fas fa-folder-open' },
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
                <p className="about-tagline">Java Software Engineer</p>
                <p className="about-institution">
                    Singapore Polytechnic · Diploma in IT · Graduated 2026
                </p>
                <div className="about-hero-actions">
                    <button
                        className="about-cta-btn about-cta-primary"
                        onClick={() => openWindow('contact')}
                    >
                        <i className="fas fa-envelope" aria-hidden="true" /> Get in Touch
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
                    ['Role', 'Java Software Engineer'],
                    ['Education', 'Diploma in IT — Singapore Polytechnic, 2026'],
                    ['Location', PROFILE.location],
                    ['Availability', PROFILE.availability],
                    ['Stack', 'Java · Spring Boot · SQL · React · TS'],
                ].map(([label, value]) => (
                    <div key={label} className="summary-row">
                        <span>{label}</span>
                        <strong>{value}</strong>
                    </div>
                ))}
            </div>
            <nav className="about-recruiter-path" aria-label="Recruiter path">
                {RECRUITER_PATH.map(({ label, appId, icon }) => (
                    <button key={appId} type="button" onClick={() => openWindow(appId)}>
                        <i className={icon} aria-hidden="true" />
                        <span>{label}</span>
                    </button>
                ))}
            </nav>
            <div className="about-content">
                <div className="about-section">
                    <h3>
                        <i className="fas fa-user" aria-hidden="true" /> About Me
                    </h3>
                    <p>
                        I recently graduated from Singapore Polytechnic with a Diploma in
                        Information Technology and I&apos;m targeting Java Software Engineer roles.
                        I care about clean code, solid OOP design, and building systems that
                        actually work. I&apos;m currently focused on Java, Spring Boot, and SQL —
                        building backend projects to strengthen my portfolio and deepen my
                        understanding of real application architecture. I learn best by turning
                        study into shipped work, which is why I built this entire Fedora desktop
                        portfolio from scratch in React and TypeScript.
                    </p>
                </div>
                <div className="about-section about-grouped">
                    <h3>
                        <i className="fas fa-id-card" aria-hidden="true" /> Snapshot
                    </h3>
                    {[
                        [
                            'Current Focus',
                            'Targeting Java Software Engineer roles while building practical Spring Boot, SQL, OOP, and clean application design experience.',
                        ],
                        [
                            'Education',
                            'Diploma in Information Technology, Singapore Polytechnic. Graduated 2026.',
                        ],
                        [
                            'This Portfolio',
                            'Designed and built this Fedora 43 desktop simulation in React 19, TypeScript, and Vite — with real window management, a virtual terminal, and GNOME-style shell interactions.',
                        ],
                        [
                            'Interests',
                            'Backend systems, Java ecosystem, Spring Boot, Linux customisation, open source, and developer tooling.',
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
