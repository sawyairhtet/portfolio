import { memo, useState } from 'react';
import { SKILL_CATEGORIES } from '../../config/data';
import { ICON_MAP, registerIcons } from '../ui/Icon';
import { Code, Database, Headset, TestTube, TreeStructure, Wrench } from '@phosphor-icons/react';

registerIcons({
    headset: Headset,
    vial: TestTube,
    wrench: Wrench,
    code: Code,
    database: Database,
    sitemap: TreeStructure,
});

type SkillLevel = 'proficient' | 'intermediate' | 'learning';

const LEVEL_FILL: Record<SkillLevel, number> = {
    proficient: 3,
    intermediate: 2,
    learning: 1,
};

function skillLevelLabel(level: string): string {
    return level.charAt(0).toUpperCase() + level.slice(1);
}

function SkillMeter({ level }: { level: SkillLevel }) {
    // eslint-disable-next-line security/detect-object-injection -- level is a typed union key
    const filled = LEVEL_FILL[level] ?? 1;
    return (
        <span className={`skill-meter level-${level}`}>
            <span
                className="skill-meter-dots"
                role="img"
                aria-label={`${skillLevelLabel(level)} proficiency`}
            >
                {[0, 1, 2].map(i => (
                    <span key={i} className={`skill-dot${i < filled ? ' filled' : ''}`} />
                ))}
            </span>
            <span className="skill-meter-label">{skillLevelLabel(level)}</span>
        </span>
    );
}

export const SkillsApp = memo(function SkillsApp() {
    const [activeCategory, setActiveCategory] = useState(0);
    // eslint-disable-next-line security/detect-object-injection -- activeCategory is a numeric state
    const category = SKILL_CATEGORIES[activeCategory] ?? SKILL_CATEGORIES[0];
    const CategoryIcon = ICON_MAP[category.icon];

    return (
        <div className="skills-app">
            <h1 className="sr-only">Skills</h1>

            <div className="skills-category-pills" role="tablist" aria-label="Skill categories">
                {SKILL_CATEGORIES.map((cat, i) => {
                    const Icon = ICON_MAP[cat.icon];
                    const isActive = i === activeCategory;
                    return (
                        <button
                            key={cat.title}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            className={`skills-category-pill${isActive ? ' active' : ''}`}
                            onClick={() => setActiveCategory(i)}
                        >
                            {Icon && <Icon size="1em" weight={isActive ? 'fill' : 'regular'} />}
                            {cat.title}
                        </button>
                    );
                })}
            </div>

            <header className="skills-category-header">
                <span className="skills-category-icon">
                    {CategoryIcon && <CategoryIcon size="1.4em" weight="duotone" />}
                </span>
                <div className="skills-category-meta">
                    <h2 className="skills-category-title">{category.title}</h2>
                    <p className="skills-category-count">
                        {category.skills.length} {category.skills.length === 1 ? 'skill' : 'skills'}
                    </p>
                </div>
            </header>

            <div className="skills-list">
                {category.skills.map(skill => (
                    <article className="skill-item" key={skill.name}>
                        <SkillMeter level={skill.level} />
                        <h3 className="skill-item-name">{skill.name}</h3>
                        <p className="skill-item-context">{skill.context}</p>
                        {skill.usedIn.length > 0 && (
                            <ul className="skill-item-tags" aria-label="Used in">
                                {skill.usedIn.map(tag => (
                                    <li key={tag} className="skill-tag">
                                        {tag}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
});
