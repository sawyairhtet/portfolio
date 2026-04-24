const SKILL_GROUPS = [
    {
        title: 'Languages',
        skills: [
            { icon: 'fab fa-js', name: 'JavaScript' },
            { icon: 'fab fa-python', name: 'Python' },
            { icon: 'fas fa-code', name: 'C#' },
            { icon: 'fab fa-java', name: 'Java' },
            { icon: 'fas fa-database', name: 'SQL' },
        ],
    },
    {
        title: 'Frontend',
        skills: [
            { icon: 'fab fa-html5', name: 'HTML5' },
            { icon: 'fab fa-css3-alt', name: 'CSS3' },
            { icon: 'fab fa-react', name: 'React' },
            { icon: 'fab fa-node-js', name: 'Node.js' },
        ],
    },
    {
        title: 'VR / Game Dev',
        skills: [
            { icon: 'fab fa-unity', name: 'Unity' },
            { icon: 'fas fa-vr-cardboard', name: 'Meta Quest' },
            { icon: 'fas fa-hand-paper', name: 'Hand Tracking' },
        ],
    },
    {
        title: 'Tools',
        skills: [
            { icon: 'fab fa-git-alt', name: 'Git' },
            { icon: 'fas fa-code', name: 'VS Code' },
            { icon: 'fab fa-figma', name: 'Figma' },
            { icon: 'fab fa-linux', name: 'Linux' },
            { icon: 'fab fa-github', name: 'GitHub Actions' },
        ],
    },
];

export function SkillsApp() {
    return (
        <>
            <h2><i className="fas fa-laptop-code" aria-hidden="true" /> Skills &amp; Tools</h2>
            <div className="skills-groups">
                {SKILL_GROUPS.map((group) => (
                    <div key={group.title} className="skill-group">
                        <h3 className="skill-group-title">{group.title}</h3>
                        <div className="skill-icon-grid">
                            {group.skills.map((skill) => (
                                <div key={skill.name} className="skill-item">
                                    <i className={skill.icon} aria-hidden="true" />
                                    <span className="skill-name">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
