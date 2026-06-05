import { SKILL_CATEGORIES } from '../../config/data';
import type { SkillItem } from '../../types';

const LEVEL_DOTS = new Map<SkillItem['level'], number>([
    ['proficient', 3],
    ['intermediate', 2],
    ['learning', 1],
]);

function Dots({ level }: { level: SkillItem['level'] }) {
    const filled = LEVEL_DOTS.get(level) ?? 0;
    return (
        <span className={`ed-dots lvl-${level}`} aria-hidden="true">
            {[0, 1, 2].map(i => (
                <i key={i} className={i < filled ? 'on' : ''} />
            ))}
        </span>
    );
}

export function Skills() {
    const total = SKILL_CATEGORIES.reduce((n, c) => n + c.skills.length, 0);

    return (
        <section className="ed-section ed-container" id="skills">
            <div className="ed-section-head">
                <span className="ed-section-num">03</span>
                <h2 className="ed-section-title">Skills</h2>
                <span className="ed-section-meta">{total} capabilities</span>
            </div>

            <div>
                {SKILL_CATEGORIES.map((category, ci) => (
                    <div className="ed-skill-cat" key={category.title}>
                        <div className="ed-skill-cat-head-wrap">
                            <div className="ed-skill-cat-head">
                                <span className="ed-skill-cat-num">
                                    {String(ci + 1).padStart(2, '0')}
                                </span>
                                <h3 className="ed-skill-cat-title">{category.title}</h3>
                            </div>
                            <span className="ed-skill-cat-count">
                                {category.skills.length} skills
                            </span>
                        </div>

                        <div className="ed-skill-list">
                            {category.skills.map(skill => (
                                <div className="ed-skill-row" key={skill.name}>
                                    <span className="ed-skill-name">{skill.name}</span>
                                    <span className="ed-skill-meta">
                                        <span className="ed-skill-level">{skill.level}</span>
                                        <Dots level={skill.level} />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
