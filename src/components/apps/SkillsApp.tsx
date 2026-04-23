const SKILL_GROUPS = [
    {
        title: 'Languages',
        skills: [
            { icon: 'fab fa-js', name: 'JavaScript', dots: 4 },
            { icon: 'fab fa-python', name: 'Python', dots: 3 },
            { icon: 'fas fa-code', name: 'C#', dots: 4 },
            { icon: 'fab fa-java', name: 'Java', dots: 3 },
            { icon: 'fas fa-database', name: 'SQL', dots: 3 },
        ],
    },
    {
        title: 'Frontend',
        skills: [
            { icon: 'fab fa-html5', name: 'HTML5', dots: 5 },
            { icon: 'fab fa-css3-alt', name: 'CSS3', dots: 4 },
            { icon: 'fab fa-react', name: 'React', dots: 3 },
            { icon: 'fab fa-node-js', name: 'Node.js', dots: 3 },
        ],
    },
    {
        title: 'VR / Game Dev',
        skills: [
            { icon: 'fab fa-unity', name: 'Unity', dots: 4 },
            { icon: 'fas fa-vr-cardboard', name: 'Meta Quest', dots: 4 },
            { icon: 'fas fa-hand-paper', name: 'Hand Tracking', dots: 4 },
        ],
    },
    {
        title: 'Tools',
        skills: [
            { icon: 'fab fa-git-alt', name: 'Git', dots: 4 },
            { icon: 'fas fa-code', name: 'VS Code', dots: 4 },
            { icon: 'fab fa-figma', name: 'Figma', dots: 3 },
            { icon: 'fab fa-linux', name: 'Linux', dots: 3 },
            { icon: 'fab fa-github', name: 'GitHub Actions', dots: 2 },
        ],
    },
];

function renderDots(filled: number): string {
    return '●'.repeat(filled) + '○'.repeat(5 - filled);
}

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
                                    <span className="skill-dots" aria-label={`${skill.dots} out of 5`}>
                                        {renderDots(skill.dots)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
