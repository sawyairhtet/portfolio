import { memo } from 'react';
import { PROFILE, SOCIAL_LINKS } from '../../config/profile';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon, registerIcons } from '../ui/Icon';
import {
    ArrowSquareOut,
    GithubLogo,
    Users,
    Star,
    GitBranch,
    ArrowLeft,
    ArrowRight,
    ArrowClockwise,
    LockSimple,
    LinkedinLogo,
    TelegramLogo,
    XLogo,
} from '@phosphor-icons/react';

registerIcons({
    'arrow-left': ArrowLeft,
    'arrow-right': ArrowRight,
    'arrow-clockwise': ArrowClockwise,
    'lock-simple': LockSimple,
    linkedin: LinkedinLogo,
    telegram: TelegramLogo,
    'x-twitter': XLogo,
});

const githubLink = SOCIAL_LINKS.find(link => link.label === 'GitHub') ?? SOCIAL_LINKS[0];

export const BrowserApp = memo(function BrowserApp() {
    const reduced = useReducedMotion();

    return (
        <div className="browser-app">
            <div className="browser-toolbar" aria-label="Web toolbar">
                <button type="button" aria-label="Back" disabled>
                    <Icon name="arrow-left" />
                </button>
                <button type="button" aria-label="Forward" disabled>
                    <Icon name="arrow-right" />
                </button>
                <button type="button" aria-label="Reload">
                    <Icon name="arrow-clockwise" />
                </button>
                <div className="browser-location-v2" role="textbox" aria-label="Address">
                    <Icon name="lock-simple" />
                    <span>{githubLink.href}</span>
                </div>
                <a
                    className="browser-open-link"
                    href={githubLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Open GitHub in a new tab"
                >
                    <ArrowSquareOut weight="bold" size={15} />
                </a>
            </div>
            <div className="browser-frame-wrap">
                <div className="browser-fallback-v2">
                    <div className="browser-github-card">
                        <GithubLogo weight="fill" size={80} className="browser-gh-mark" />
                        <strong className="browser-gh-username">{githubLink.handle}</strong>
                        <p className="browser-gh-bio">{PROFILE.headline}</p>
                        <div className="browser-gh-stats">
                            <span className="browser-gh-stat">
                                <GitBranch weight="bold" size={14} />
                                <strong>12</strong> repos
                            </span>
                            <span className="browser-gh-stat">
                                <Users weight="bold" size={14} />
                                <strong>5</strong> followers
                            </span>
                            <span className="browser-gh-stat">
                                <Star weight="bold" size={14} />
                                <strong>8</strong> stars
                            </span>
                        </div>
                        {SOCIAL_LINKS.filter(l => l.label !== 'GitHub')
                            .slice(0, 3)
                            .map(link => (
                                <motion.a
                                    key={link.label}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="browser-gh-btn secondary"
                                    whileHover={reduced ? undefined : { scale: 1.02 }}
                                    whileTap={reduced ? undefined : { scale: 0.97 }}
                                >
                                    <Icon name={link.icon} />
                                    {link.label}
                                </motion.a>
                            ))}
                        <motion.a
                            href={githubLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="browser-gh-btn"
                            whileHover={reduced ? undefined : { scale: 1.02 }}
                            whileTap={reduced ? undefined : { scale: 0.97 }}
                        >
                            <GithubLogo weight="bold" size={16} />
                            Open on GitHub
                        </motion.a>
                    </div>
                </div>
            </div>
        </div>
    );
});
