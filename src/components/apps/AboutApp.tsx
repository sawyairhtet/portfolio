import { useWindowManager } from '../../context/WindowManagerContext';
import { PROFILE, SOCIAL_LINKS } from '../../config/profile';
import type { AppId } from '../../types';
import {
    motion,
    useReducedMotion,
    AnimatePresence,
} from 'framer-motion';
import {
    EnvelopeSimple,
    FileArrowDown,
    MapPin,
    GraduationCap,
    Circle,
    Coffee,
    FolderOpen,
    Wrench,
    PaperPlaneTilt,
    ArrowRight,
    User,
    Briefcase,
    MapTrifold,
    Lightning,
    Stack,
} from '@phosphor-icons/react';

type RecruiterPathAction =
    | { label: string; appId: AppId; icon: React.ReactNode }
    | { label: string; href: string; icon: React.ReactNode; download?: boolean };

const RECRUITER_PATH: RecruiterPathAction[] = [
    { label: 'Projects', appId: 'projects', icon: <FolderOpen weight="duotone" size={24} /> },
    { label: 'Skills', appId: 'skills', icon: <Wrench weight="duotone" size={24} /> },
    {
        label: 'Resume',
        href: PROFILE.resumePath,
        icon: <FileArrowDown weight="duotone" size={24} />,
        download: true,
    },
    { label: 'Contact', appId: 'contact', icon: <PaperPlaneTilt weight="duotone" size={24} /> },
];

const QUICK_FACTS = [
    { icon: <MapPin weight="bold" size={14} />, text: PROFILE.location },
    { icon: <GraduationCap weight="bold" size={14} />, text: 'SP 2026' },
    { icon: <Circle weight="fill" size={8} className="about-available-dot" />, text: 'Available' },
    { icon: <Coffee weight="bold" size={14} />, text: 'Java & Spring' },
];

const STAT_GRID = [
    { label: 'Stack', value: PROFILE.primaryStack.slice(0, 3).join(' · '), icon: <Stack weight="duotone" size={20} /> },
    { label: 'Location', value: PROFILE.location, icon: <MapTrifold weight="duotone" size={20} /> },
    { label: 'Availability', value: PROFILE.availability, icon: <Lightning weight="duotone" size={20} /> },
    { label: 'Focus', value: PROFILE.roleTarget, icon: <Briefcase weight="duotone" size={20} /> },
];

const stagger = {
    animate: { transition: { staggerChildren: 0.06 } },
};

const fadeSlide = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
};

const fadeLeft = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export function AboutApp() {
    const { openWindow } = useWindowManager();
    const reduced = useReducedMotion();

    const motionProps = (variants: Record<string, unknown>) =>
        reduced ? {} : variants;

    return (
        <motion.div
            className="about-redesign"
            initial={reduced ? false : 'initial'}
            animate="animate"
            variants={stagger}
        >
            {/* ZONE 1 — Hero Banner */}
            <motion.div className="about-hero-v2" variants={fadeSlide}>
                <div className="about-hero-gradient" aria-hidden="true" />
                <div className="about-hero-inner">
                    <motion.div
                        className="about-avatar-v2"
                        whileHover={reduced ? undefined : { scale: 1.04 }}
                    >
                        <div className="about-avatar-ring" />
                        <picture>
                            <source srcSet="/images/profile-picture.webp" type="image/webp" />
                            <img
                                src="/images/profile-picture.webp"
                                alt="Saw Ye Htet"
                                className="profile-img"
                                width={96}
                                height={96}
                                loading="eager"
                                onError={e => {
                                    const img = e.target as HTMLImageElement;
                                    img.style.display = 'none';
                                    const avatar = img.closest('.about-avatar-v2');
                                    if (avatar && !avatar.querySelector('.avatar-fallback')) {
                                        const fallback = document.createElement('span');
                                        fallback.className = 'avatar-fallback';
                                        fallback.textContent = 'SY';
                                        avatar.appendChild(fallback);
                                    }
                                }}
                            />
                        </picture>
                    </motion.div>
                    <h2 className="about-name-v2">Saw Ye Htet</h2>
                    <p className="about-role-v2">{PROFILE.role}</p>
                    <div className="about-facts-row">
                        {QUICK_FACTS.map(fact => (
                            <span key={fact.text} className="about-fact-chip">
                                {fact.icon}
                                {fact.text}
                            </span>
                        ))}
                    </div>
                    <div className="about-hero-ctas">
                        <motion.button
                            className="about-cta-v2 about-cta-primary"
                            onClick={() => openWindow('contact')}
                            whileHover={reduced ? undefined : { scale: 1.02 }}
                            whileTap={reduced ? undefined : { scale: 0.97 }}
                        >
                            <EnvelopeSimple weight="bold" size={16} /> Contact Me
                        </motion.button>
                        <motion.a
                            className="about-cta-v2 about-cta-secondary"
                            href={PROFILE.resumePath}
                            download
                            whileHover={reduced ? undefined : { scale: 1.02 }}
                            whileTap={reduced ? undefined : { scale: 0.97 }}
                        >
                            <FileArrowDown weight="bold" size={16} /> Download Resume
                        </motion.a>
                    </div>
                </div>
            </motion.div>

            {/* ZONE 2 — Content Grid */}
            <div className="about-content-grid">
                {/* Left Column */}
                <div className="about-col-left">
                    <motion.div className="about-bio-card" variants={fadeSlide}>
                        <span className="about-card-label">Who I am</span>
                        <p>
                            {PROFILE.summary} I am aiming for junior Java/backend roles where I
                            can keep strengthening fundamentals through practical work.
                        </p>
                    </motion.div>

                    <motion.div
                        className="about-timeline"
                        {...motionProps(fadeLeft)}
                    >
                        <span className="about-card-label">Education</span>
                        <div className="about-timeline-entry">
                            <div className="about-timeline-dot" />
                            <div className="about-timeline-line" aria-hidden="true" />
                            <div className="about-timeline-content">
                                <strong>Singapore Polytechnic</strong>
                                <span>Diploma in Information Technology</span>
                                <span className="about-timeline-year">2023 – 2026</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column */}
                <div className="about-col-right">
                    <motion.div
                        className="about-stat-grid"
                        variants={stagger}
                    >
                        {STAT_GRID.map(stat => (
                            <motion.div
                                key={stat.label}
                                className="about-stat-box"
                                variants={fadeSlide}
                            >
                                <div className="about-stat-icon">{stat.icon}</div>
                                <span className="about-stat-label">{stat.label}</span>
                                <strong className="about-stat-value">{stat.value}</strong>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.nav
                        className="about-recruiter-nav"
                        aria-label="Recruiter path"
                        variants={stagger}
                    >
                        <span className="about-card-label">What to explore next</span>
                        <div className="about-recruiter-steps">
                            {RECRUITER_PATH.map((action, i) => (
                                <motion.div key={'label' in action ? action.label : ''} className="about-step-wrap" variants={fadeSlide}>
                                    {'appId' in action ? (
                                        <button
                                            type="button"
                                            className="about-step-card"
                                            onClick={() => openWindow(action.appId)}
                                        >
                                            <span className="about-step-icon">{action.icon}</span>
                                            <span>{action.label}</span>
                                        </button>
                                    ) : (
                                        <a
                                            href={action.href}
                                            download={action.download}
                                            className="about-step-card"
                                        >
                                            <span className="about-step-icon">{action.icon}</span>
                                            <span>{action.label}</span>
                                        </a>
                                    )}
                                    {i < RECRUITER_PATH.length - 1 && (
                                        <ArrowRight
                                            weight="bold"
                                            size={14}
                                            className="about-step-arrow"
                                        />
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.nav>
                </div>
            </div>
        </motion.div>
    );
}
