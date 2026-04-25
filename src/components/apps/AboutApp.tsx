import { useWindowManager } from '../../context/WindowManagerContext';
import { PROFILE } from '../../config/profile';

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
                            width={140}
                            height={140}
                            loading="eager"
                            onError={e => {
                                // Fallback: hide broken image, show initials via parent's font-size/text
                                (e.target as HTMLImageElement).style.display = 'none';
                                const avatar = (e.target as HTMLImageElement).closest(
                                    '.about-avatar'
                                );
                                if (avatar) avatar.textContent = 'SY';
                            }}
                        />
                    </picture>
                </div>
                <h2>Saw Ye Htet</h2>
                <p className="about-tagline">Java-Focused Software Developer</p>
                <div className="about-hero-actions">
                    <button
                        className="about-cta-btn about-cta-primary"
                        onClick={() => openWindow('contact')}
                    >
                        <i className="fas fa-envelope" aria-hidden="true" /> Get in Touch
                    </button>
                </div>
            </div>
            <div className="recruiter-summary" aria-label="Recruiter summary">
                {[
                    ['Role', 'Java-focused software developer'],
                    ['Education', 'Singapore Polytechnic graduate'],
                    ['Location', 'Singapore'],
                    ['Availability', PROFILE.availability],
                    ['Focus', 'Java, backend fundamentals, SQL'],
                ].map(([label, value]) => (
                    <div key={label} className="summary-row">
                        <span>{label}</span>
                        <strong>{value}</strong>
                    </div>
                ))}
            </div>
            <div className="about-content">
                <div className="about-section">
                    <h3>
                        <i className="fas fa-user" aria-hidden="true" /> About Me
                    </h3>
                    <p>
                        I recently graduated from Singapore Polytechnic with a Diploma in
                        Information Technology, and I&apos;m steering my portfolio toward Java
                        developer roles. My past VR and interactive web projects gave me practice
                        with object-oriented thinking, user flows, performance-minded code, and
                        shipping complete experiences. Now I&apos;m focusing those habits on Java,
                        backend fundamentals, SQL, and maintainable application code.
                    </p>
                </div>
                <div className="about-section about-grouped">
                    <h3>
                        <i className="fas fa-id-card" aria-hidden="true" /> Snapshot
                    </h3>
                    {[
                        [
                            'Education',
                            'Diploma in Information Technology, Singapore Polytechnic. Graduated in 2026.',
                        ],
                        [
                            'Java Direction',
                            'Building toward Java developer roles with a focus on OOP, backend fundamentals, SQL, and clean application structure.',
                        ],
                        [
                            'Past VR Work',
                            'Built Meta Quest VR prototypes with Unity, C#, hand tracking, and performance constraints.',
                        ],
                        [
                            'Web Project',
                            'Designed this Fedora desktop portfolio in React, TypeScript, and Vite with shell-level interactions.',
                        ],
                        [
                            'Interests',
                            'Java development, backend systems, Linux customization, open source, and practical developer tools.',
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
