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
                            width={120}
                            height={120}
                            loading="eager"
                            onError={e => {
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
                <p className="about-tagline">Java Software Engineer</p>
                <p className="about-institution">Singapore Polytechnic · Diploma in IT · Graduated 2026</p>
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
            <div className="about-content">
                <div className="about-section">
                    <h3>
                        <i className="fas fa-user" aria-hidden="true" /> About Me
                    </h3>
                    <p>
                        I recently graduated from Singapore Polytechnic with a Diploma in
                        Information Technology and I&apos;m targeting Java Software Engineer roles.
                        I care about clean code, solid OOP design, and building systems that
                        actually work. During a year-long internship, I built a Meta Quest VR
                        experience — controller-free hand tracking, physics-based interactions, no
                        UI prompts — which taught me to ship under real constraints. That same
                        habit of finishing things properly is what I&apos;m bringing to Java,
                        Spring Boot, and SQL. I don&apos;t have a Spring Boot project to show yet
                        — I&apos;m building that now — but I learn by doing, and that pattern shows
                        in everything I&apos;ve shipped so far.
                    </p>
                </div>
                <div className="about-section about-grouped">
                    <h3>
                        <i className="fas fa-id-card" aria-hidden="true" /> Snapshot
                    </h3>
                    {[
                        [
                            'Current Focus',
                            'Targeting Java Software Engineer roles. Building OOP foundations, Spring Boot, SQL, and clean application design.',
                        ],
                        [
                            'Internship VR',
                            'Built a Meta Quest heist prototype during a year-long internship — controller-free bare-hand tracking, physics-based object interactions, standalone Quest performance.',
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
                            'Backend systems, Java ecosystem, Linux customisation, VR & spatial computing, open source, and developer tooling.',
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
