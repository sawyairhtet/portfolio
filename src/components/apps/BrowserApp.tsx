import { PROFILE, SOCIAL_LINKS } from '../../config/profile';
import { motion, useReducedMotion } from 'framer-motion';
import {
    ArrowLeft,
    ArrowRight,
    ArrowClockwise,
    LockSimple,
    ArrowSquareOut,
    GithubLogo,
    Users,
    Star,
    GitBranch,
} from '@phosphor-icons/react';

const githubLink = SOCIAL_LINKS.find(link => link.label === 'GitHub') ?? SOCIAL_LINKS[0];

export function BrowserApp() {
    const reduced = useReducedMotion();

    return (
        <div className="browser-app">
            <div className="browser-toolbar" aria-label="Firefox toolbar">
                <button type="button" aria-label="Back" disabled>
                    <ArrowLeft weight="bold" size={15} />
                </button>
                <button type="button" aria-label="Forward" disabled>
                    <ArrowRight weight="bold" size={15} />
                </button>
                <button type="button" aria-label="Reload">
                    <ArrowClockwise weight="bold" size={15} />
                </button>
                <div className="browser-location-v2" role="textbox" aria-label="Address">
                    <LockSimple weight="fill" size={13} className="browser-lock-icon" />
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
                <iframe
                    title="Saw Ye Htet GitHub"
                    src={githubLink.href}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox"
                />
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
}
