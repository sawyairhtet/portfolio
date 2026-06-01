import { memo, useState } from 'react';
import { SKILL_CATEGORIES } from '../../config/data';
import { ICON_MAP } from '../ui/Icon';

function skillLevelLabel(level: string): string {
    return level.charAt(0).toUpperCase() + level.slice(1);
}

export const SkillsApp = memo(function SkillsApp() {
    const [activeCategory, setActiveCategory] = useState(0);
    // eslint-disable-next-line security/detect-object-injection -- activeCategory is a numeric state
    const category = SKILL_CATEGORIES[activeCategory] ?? SKILL_CATEGORIES[0];

    return (
        <div className="adw-page">
            <section className="adw-section">
                <div className="skills-category-pills">
                    {SKILL_CATEGORIES.map((cat, i) => {
                        const Icon = ICON_MAP[cat.icon];
                        return (
                            <button
                                key={cat.title}
                                type="button"
                                className={`skills-category-pill${i === activeCategory ? ' active' : ''}`}
                                onClick={() => setActiveCategory(i)}
                            >
                                {Icon && <Icon size="1em" />}
                                {cat.title}
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className="adw-section">
                <div className="adw-boxed-list">
                    {category.skills.map(skill => (
                        <div className="adw-row" key={skill.name}>
                            <div className="skills-row-content">
                                <strong className="adw-row-label">{skill.name}</strong>
                                <span className="skills-row-context">{skill.context}</span>
                            </div>
                            <span className={`skills-level-badge level-${skill.level}`}>
                                {skillLevelLabel(skill.level)}
                            </span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
});
