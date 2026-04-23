export function AboutApp() {
    return (
        <>
            <div className="about-hero">
                <div className="about-avatar">
                    <picture>
                        <source srcSet="images/profile-picture.webp" type="image/webp" />
                        <img src="images/profile-picture.jpg" alt="Saw Ye Htet" className="profile-img" width={140} height={140} />
                    </picture>
                </div>
                <h2>Saw Ye Htet</h2>
                <p className="about-tagline">IT Student &amp; VR Developer</p>
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
                <div className="about-section">
                    <h3><i className="fas fa-graduation-cap" aria-hidden="true" /> Education</h3>
                    <p>
                        <strong>Singapore Polytechnic</strong><br />
                        Diploma in Information Technology<br />
                        <em>Expected Graduation: 2026</em>
                    </p>
                </div>
                <div className="about-section">
                    <h3><i className="fas fa-briefcase" aria-hidden="true" /> Experience</h3>
                    <p>
                        <strong>VR Developer — Meta Quest</strong><br />
                        Built a jewelry heist VR game for Meta Quest using Unity and C#.
                        Implemented full hand tracking — grab, throw, and interact with
                        objects using bare hands. Optimised rendering for 72fps on
                        standalone hardware.
                    </p>
                    <p>
                        <strong>Web Developer — Portfolio</strong><br />
                        Designed and developed this interactive Fedora 43 desktop
                        simulation using React, TypeScript, and Vite.
                        Features include draggable windows, a working terminal, boot
                        animation, GNOME Activities overview, and PWA support.
                    </p>
                </div>
                <div className="about-section">
                    <h3><i className="fas fa-heart" aria-hidden="true" /> Interests</h3>
                    <p>
                        VR &amp; Spatial Computing &bull; Game Development &bull; Open Source &bull;
                        Linux &amp; System Customization &bull; UI/UX Design
                    </p>
                </div>
            </div>
        </>
    );
}
