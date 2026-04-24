import { useWindowManager } from '../../context/WindowManagerContext';

export function AboutApp() {
    const { openWindow } = useWindowManager();

    return (
        <>
            <div className="about-hero">
                <div className="about-avatar">
                    <picture>
                        <source srcSet="/images/profile-picture.webp" type="image/webp" />
                        <img
                            src="/images/profile-picture.jpg"
                            alt="Saw Ye Htet"
                            className="profile-img"
                            width={140}
                            height={140}
                            loading="eager"
                            onError={(e) => {
                                // Fallback: hide broken image, show initials via parent's font-size/text
                                (e.target as HTMLImageElement).style.display = 'none';
                                const avatar = (e.target as HTMLImageElement).closest('.about-avatar');
                                if (avatar) avatar.textContent = 'SY';
                            }}
                        />
                    </picture>
                </div>
                <h2>Saw Ye Htet</h2>
                <p className="about-tagline">IT Student &amp; VR Developer</p>
                <div className="about-hero-actions">
                    <button className="about-cta-btn about-cta-primary" onClick={() => openWindow('contact')}>
                        <i className="fas fa-envelope" aria-hidden="true" /> Get in Touch
                    </button>
                    <a className="about-cta-btn about-cta-secondary" href="resume/SYH_resume.pdf" download>
                        <i className="fas fa-download" aria-hidden="true" /> Resume
                    </a>
                </div>
            </div>
            <div className="recruiter-summary" aria-label="Recruiter summary">
                {[
                    ['Role', 'IT student / VR developer'],
                    ['School', 'Singapore Polytechnic'],
                    ['Location', 'Singapore'],
                    ['Availability', 'Open to opportunities'],
                    ['Focus', 'VR, React, interaction design'],
                ].map(([label, value]) => (
                    <div key={label} className="summary-row">
                        <span>{label}</span>
                        <strong>{value}</strong>
                    </div>
                ))}
            </div>
            <div className="about-content">
                <div className="about-section">
                    <h3><i className="fas fa-user" aria-hidden="true" /> About Me</h3>
                    <p>
                        I build things that feel real — whether that&apos;s a VR heist game
                        where you grab jewels with your bare hands, or this portfolio
                        that simulates a full Fedora 43 desktop in the browser. I got
                        hooked on VR after implementing Meta Quest hand tracking and
                        realising gesture input could replace controllers entirely. When
                        I&apos;m not in Unity, I&apos;m usually deep in React, Linux configs,
                        or figuring out how to make CSS do something it probably shouldn&apos;t.
                    </p>
                </div>
                <div className="about-section about-grouped">
                    <h3><i className="fas fa-id-card" aria-hidden="true" /> Snapshot</h3>
                    {[
                        ['Education', 'Diploma in Information Technology, Singapore Polytechnic. Expected graduation: 2026.'],
                        ['VR Project', 'Built a Meta Quest jewelry heist prototype with Unity, C#, and bare-hand object interactions.'],
                        ['Web Project', 'Designed this Fedora desktop portfolio in React, TypeScript, and Vite with shell-level interactions.'],
                        ['Interests', 'VR, spatial computing, game development, Linux customization, open source, and UI/UX.'],
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
