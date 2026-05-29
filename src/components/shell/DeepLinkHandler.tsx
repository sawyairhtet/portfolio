import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWindowManager } from '../../context/WindowManagerContext';
import type { AppId } from '../../types';
import { DesktopShell } from './DesktopShell';

const VALID_APPS: AppId[] = [
    'about',
    'browser',
    'files',
    'resume',
    'skills',
    'projects',
    'contact',
    'terminal',
    'settings',
    'text-editor',
    'focus-mode',
];

const DEFAULT_TITLE = 'Saw Ye Htet - IT Support & Operations Specialist';
const DEFAULT_DESCRIPTION =
    'Saw Ye Htet is an IT support specialist targeting application support, production support, and technical analyst roles in Singapore. Explore projects, skills, resume, and contact details.';
const SITE_ORIGIN = 'https://sawyehtet.com';

/** Per-route SEO metadata for deep links. */
const ROUTE_META = new Map<AppId, { title: string; description: string }>([
    [
        'about',
        {
            title: 'About - Saw Ye Htet | IT Support & Operations Specialist',
            description:
                'Saw Ye Htet - IT support & operations specialist and Singapore Polytechnic IT graduate (2026). Targeting application support, production support, and technical analyst roles.',
        },
    ],
    [
        'projects',
        {
            title: 'Projects - Saw Ye Htet | OpsTrack, Portfolio Desktop',
            description:
                'Featured projects by Saw Ye Htet: OpsTrack operations tracking API (Spring Boot) and a Fedora-inspired React + TypeScript portfolio desktop.',
        },
    ],
    [
        'skills',
        {
            title: 'Skills - Saw Ye Htet | Support, QA, SQL, Java',
            description:
                'Technical skills: incident triage, log analysis, SQL, API testing, Java, React + TypeScript, Git, and Linux.',
        },
    ],
    [
        'contact',
        {
            title: 'Contact - Saw Ye Htet | IT Support Specialist',
            description:
                'Get in touch with Saw Ye Htet - IT support specialist based in Singapore. Email, resume download, and contact form.',
        },
    ],
    [
        'resume',
        {
            title: 'Resume - Saw Ye Htet | IT Support & Operations Specialist',
            description:
                'View or download Saw Ye Htet\'s resume PDF. IT support & operations specialist targeting application support and production support roles.',
        },
    ],
    [
        'terminal',
        {
            title: 'Terminal - Saw Ye Htet | Interactive Portfolio Shell',
            description:
                'Explore Saw Ye Htet\'s portfolio through an interactive terminal with filesystem navigation, app commands, and easter eggs.',
        },
    ],
    [
        'text-editor',
        {
            title: 'Resume Markdown - Saw Ye Htet | IT Support Specialist',
            description:
                'Open or download Saw Ye Htet\'s resume, with a readable markdown fallback for the portfolio desktop.',
        },
    ],
]);

function setMetaContent(selector: string, content: string) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute('content', content);
}

function updateSeoMeta(appId: AppId | null) {
    const meta = appId ? ROUTE_META.get(appId) : null;
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
