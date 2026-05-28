import { SOCIAL_LINKS } from '../../config/profile';
import { motion, useReducedMotion } from 'framer-motion';
import {
    GithubLogo,
    LinkedinLogo,
    XLogo,
    TelegramLogo,
    ArrowSquareOut,
} from '@phosphor-icons/react';

const BRAND_COLORS: Record<string, string> = {
    GitHub: '#24292e',
    LinkedIn: '#0A66C2',
    X: '#000000',
    Telegram: '#229ED9',
};

const ICON_MAP: Record<string, React.ReactNode> = {
    GitHub: <GithubLogo weight="duotone" size={48} />,
    LinkedIn: <LinkedinLogo weight="duotone" size={48} />,
    X: <XLogo weight="duotone" size={48} />,
    Telegram: <TelegramLogo weight="duotone" size={48} />,
};

const stagger = {
    animate: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
};

export function LinksApp() {
    const reduced = useReducedMotion();

    return (
        <motion.div
            className="links-redesign"
            initial={reduced ? false : 'initial'}
            animate="animate"
            variants={stagger}
        >
            {SOCIAL_LINKS.map(link => {
                const brand = BRAND_COLORS[link.label] || '#888';
                return (
                    <motion.a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-card-v2"
                        style={{
                            '--brand-color': brand,
                        } as React.CSSProperties}
                        variants={reduced ? undefined : cardVariant}
                        whileHover={reduced ? undefined : { scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="link-card-icon">
                            {ICON_MAP[link.label] || <ArrowSquareOut weight="duotone" size={48} />}
                        </div>
                        <strong className="link-card-name">{link.label}</strong>
                        <span className="link-card-handle">{link.handle}</span>
                        <span className="link-card-btn">
                            <ArrowSquareOut weight="bold" size={14} />
                            View Profile
                        </span>
                    </motion.a>
                );
            })}
        </motion.div>
    );
}
