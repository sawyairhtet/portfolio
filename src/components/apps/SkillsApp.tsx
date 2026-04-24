import { SKILL_CATEGORIES } from '../../config/data';

export function SkillsApp() {
    return (
        <>
            <h2><i className="fas fa-laptop-code" aria-hidden="true" /> Skills &amp; Tools</h2>
            <div className="skills-categories">
                {SKILL_CATEGORIES.map((category) => (
                    <section key={category.title} className="skill-category">
                        <div className="skill-category-header">
                            <i className={category.icon} aria-hidden="true" />
                            <h3>{category.title}</h3>
                        </div>
                        <div className="skill-row-list">
                            {category.skills.map((skill) => (
                                <article key={skill.name} className="skill-row-card">
                                    <div>
                                        <h4>{skill.name}</h4>
                                        <p>{skill.context}</p>
                                    </div>
                                    <div className="used-in-chips" aria-label={`${skill.name} used in`}>
                                        {skill.usedIn.map((project) => (
                                            <span key={project}>{project}</span>
                                        ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </>
    );
}
