const PROJECTS = [
    {
        title: 'Jewelry Shop Robbery VR',
        description: 'An immersive VR heist game for Meta Quest with full hand tracking support. Grab precious gems, avoid security, and escape with the loot!',
        url: 'https://github.com/sawyairhtet/Jewelry-Shop-Robbery-game-with-Meta-Quest-hand-tracking',
        icon: 'fas fa-vr-cardboard',
        featured: true,
        techStack: ['Unity', 'C#', 'Meta Quest', 'Hand Tracking'],
        platform: 'Meta Quest 2/3/Pro',
        platformIcon: 'fas fa-vr-cardboard',
    },
    {
        title: 'Fedora Portfolio Website',
        description: 'This very website! A unique Fedora 43 GNOME 49-styled portfolio with draggable windows, working terminal, boot animation, and sticky notes.',
        url: 'https://github.com/sawyairhtet/portfolio',
        icon: 'fas fa-desktop',
        featured: false,
        techStack: ['React', 'TypeScript', 'Vite', 'Fedora / Adwaita'],
        platform: 'Web Application',
        platformIcon: 'fas fa-desktop',
    },
];

export function ProjectsApp() {
    return (
        <div className="projects-grid">
            {PROJECTS.map((project) => (
                <a
                    key={project.title}
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`project-card${project.featured ? ' featured-project' : ''}`}
                >
                    {project.featured && <div className="project-badge">Featured</div>}
                    <div className="project-preview">
                        <i className={project.icon} aria-hidden="true" />
                    </div>
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>
                    <div className="tech-stack">
                        {project.techStack.map((tech) => (
                            <span key={tech} className="tech-badge">{tech}</span>
                        ))}
                    </div>
                    <div className="project-meta">
                        <span className="project-platform">
                            <i className={project.platformIcon} aria-hidden="true" /> {project.platform}
                        </span>
                        <span className="project-link">
                            <i className="fab fa-github" aria-hidden="true" /> View on GitHub
                        </span>
                    </div>
                </a>
            ))}
        </div>
    );
}
