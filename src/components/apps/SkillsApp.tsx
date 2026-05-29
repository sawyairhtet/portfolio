import { useState } from 'react';
import { SKILL_CATEGORIES } from '../../config/data';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Code } from '@phosphor-icons/react';
import { ICON_MAP } from '../ui/Icon';

const LEVEL_PERCENT: Record<string, number> = {
    proficient: 100,
    intermediate: 66,
    learning: 33,
};

const LEVEL_PERCENT_MAP = new Map(Object.entries(LEVEL_PERCENT));

function SkillRing({ level }: { level: string }) {
    const percent = LEVEL_PERCENT_MAP.get(level) ?? 33;
    const r = 18;
    const circumference = 2 * Math.PI * r;
    const offset = circumference * (1 - percent / 100);
    const reduced = useReducedMotion();

    const colorClass =
        level === 'proficient'
            ? 'skill-ring-proficient'
            : level === 'intermediate'
              ? 'skill-ring-intermediate'
              : 'skill-ring-learning';

    return (
        <svg width="44" height="44" viewBox="0 0 44 44" className={`skill-ring ${colorClass}`}>
            <circle cx="22" cy="22" r={r} className="skill-ring-bg" />
            <motion.circle
                cx="22"
                cy="22"
                r={r}
                className="skill-ring-fill"
                strokeDasharray={circumference}
                initial={reduced ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
            />
            <text x="22" y="22" className="skill-ring-text">
                {percent}%
            </text>
        </svg>
    );
}

const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
};

export function SkillsApp() {
    const [activeIndex, setActiveIndex] = useState(0);
    const reduced = useReducedMotion();
    const [fallbackCategory] = SKILL_CATEGORIES;
    const activeCategory = SKILL_CATEGORIES.at(activeIndex) ?? fallbackCategory;

    if (!activeCategory) return null;

    return (
        <div className="skills-redesign">
            <div className="skills-tab-strip" role="tablist" aria-label="Skill categories">
                {SKILL_CATEGORIES.map((cat, i) => {
                    const Glyph = ICON_MAP[cat.icon] || Code;
                    return (
                        <button
                            key={cat.title}
                            role="tab"
                            aria-selected={i === activeIndex}
                            className={`skills-tab-pill${i === activeIndex ? ' active' : ''}`}
                            onClick={() => setActiveIndex(i)}
                        >
                            <Glyph weight="duotone" size={16} />
                            <span>{cat.title}</span>
                            {i === activeIndex && (
                                <motion.div
                                    className="skills-tab-indicator"
                                    layoutId="tab-pill"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeCategory.title}
                    className="skills-grid"
                    initial={reduced ? false : 'initial'}
                    animate="animate"
                    exit={reduced ? undefined : 'exit'}
                    variants={{
                        animate: { transition: { staggerChildren: 0.05 } },
                    }}
                >
                    {activeCategory.skills.map(skill => (
                        <motion.article
                            key={skill.name}
                            className="skill-card-v2"
                            variants={reduced ? undefined : cardVariants}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="skill-card-top">
                                <div className="skill-card-info">
                                    <h4>{skill.name}</h4>
                                    <p>{skill.context}</p>
                                </div>
                                <div className="skill-card-ring">
                                    <SkillRing level={skill.level} />
                                </div>
                            </div>
                            <div className="skill-card-bottom">
                                <span className={`skill-level-badge level-${skill.level}`}>
                                    {skill.level}
                                </span>
                            </div>
                        </motion.article>
                    ))}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
