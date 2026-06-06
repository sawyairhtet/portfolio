import { EDITORIAL_SKILLS, LEARNING_NOW } from '../../config/data';

export function Skills() {
    return (
        <section className="ed-section ed-section--tint ed-container" id="skills">
            <div className="ed-section-head">
                <span className="ed-section-num">04</span>
                <h2 className="ed-section-title">Skills</h2>
                <span className="ed-section-meta">What I work with</span>
            </div>

            <div className="ed-skills-grid">
                {EDITORIAL_SKILLS.map(category => (
                    <div className="ed-skill-group" key={category.title}>
                        <div className="ed-side-label">{category.title}</div>
                        <div className="ed-chip-row">
                            {category.skills.map(skill => (
                                <span key={skill} className="ed-chip">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <p className="ed-learning">
                <span className="accent">Currently learning:</span> {LEARNING_NOW.join(' · ')}
            </p>
        </section>
    );
}
