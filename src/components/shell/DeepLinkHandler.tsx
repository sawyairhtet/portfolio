import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWindowManager } from '../../context/WindowManagerContext';
import type { AppId } from '../../types';
import { DesktopShell } from './DesktopShell';

const VALID_APPS: AppId[] = [
    'about',
    'browser',
    'files',
    'skills',
    'projects',
    'contact',
    'links',
    'terminal',
    'settings',
    'text-editor',
    'focus-mode',
];

const DEFAULT_TITLE = 'Saw Ye Htet - Java-focused Software Developer';
const DEFAULT_DESCRIPTION =
    'Saw Ye Htet is a Java-focused software developer building Spring Boot, SQL, and React + TypeScript projects. Explore projects, skills, resume, and contact details.';
const SITE_ORIGIN = 'https://sawyehtet.com';

/** Per-route SEO metadata for deep links. */
const ROUTE_META: Partial<Record<AppId, { title: string; description: string }>> = {
    about: {
        title: 'About - Saw Ye Htet | Java-focused Software Developer',
        description:
            'Saw Ye Htet - Java-focused software developer and Singapore Polytechnic IT graduate (2026). Recruiter summary, education, skills, and availability.',
    },
    projects: {
        title: 'Projects - Saw Ye Htet | Java, Spring Boot, React',
        description:
            'Featured projects by Saw Ye Htet: a Fedora-inspired React + TypeScript portfolio desktop and OpsTrack, a Spring Boot and PostgreSQL API project.',
    },
    skills: {
        title: 'Skills — Saw Ye Htet | Java, Spring Boot, React, SQL',
        description:
            'Technical skills: Java + OOP, Spring Boot, SQL, React + TypeScript, Git, and Linux. Practical context and project usage for each.',
    },
    contact: {
        title: 'Contact - Saw Ye Htet | Java-focused Developer',
        description:
            'Get in touch with Saw Ye Htet - Java-focused software developer based in Singapore. Email, resume download, and contact form.',
    },
    terminal: {
        title: 'Terminal — Saw Ye Htet | Interactive Portfolio Shell',
        description:
            'Explore Saw Ye Htet\'s portfolio through an interactive terminal with filesystem navigation, app commands, and easter eggs.',
    },
    'text-editor': {
        title: 'Resume - Saw Ye Htet | Java-focused Software Developer',
        description:
            'Open or download Saw Ye Htet\'s resume PDF, with a readable markdown fallback for the portfolio desktop.',
    },
    links: {
        title: 'Links — Saw Ye Htet | GitHub, LinkedIn, Social',
        description:
            'Social profiles and links for Saw Ye Htet — GitHub, LinkedIn, and X (Twitter).',
    },
};

function setMetaContent(selector: string, content: string) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', content);
}

function updateSeoMeta(appId: AppId | null) {
    const meta = appId ? ROUTE_META[appId] : null;
    const title = meta?.title ?? DEFAULT_TITLE;
    const description = meta?.description ?? DEFAULT_DESCRIPTION;
    const url = appId ? `${SITE_ORIGIN}/app/${appId}` : `${SITE_ORIGIN}/`;

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', url);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
    setMetaContent('meta[name="twitter:url"]', url);

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', url);
}

export function DeepLinkHandler() {
    const { appId } = useParams<{ appId: string }>();
    const { openWindow } = useWindowManager();
    const navigate = useNavigate();

    useEffect(() => {
        if (appId && VALID_APPS.includes(appId as AppId)) {
            openWindow(appId as AppId);
            updateSeoMeta(appId as AppId);
        } else {
            navigate('/', { replace: true });
            updateSeoMeta(null);
        }

        return () => updateSeoMeta(null);
    }, [appId, openWindow, navigate]);

    return <DesktopShell />;
}
