import { render, screen } from '@testing-library/react';
import { describe, expect, it, beforeEach } from 'vitest';
import App from '../App';

// Guards the front-door decision encoded in App.tsx's route table:
//   /        → the portfolio (WorkPage, eager)
//   /writing → the writing feed (Home, lazy)
// keyboard-and-routing.test.tsx mounts DesktopShell against its OWN local route
// table, so it can't catch a regression in this swap. This renders the real
// <App> — its actual BrowserRouter + <Routes> — at each path and asserts on a
// marker unique to the body that should render there.
function renderAppAt(path: string) {
    window.history.pushState({}, '', path);
    return render(<App />);
}

describe('Front-door routing', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem('hasVisitedBefore', 'true');
        window.history.pushState({}, '', '/');
    });

    it('serves the portfolio (hero) at /', async () => {
        renderAppAt('/');

        // "Portfolio — 2026" is the WorkPage hero eyebrow; the feed masthead
        // eyebrow ("Writing · Singapore") must not be on the page.
        expect(await screen.findByText(/Portfolio — 2026/)).toBeInTheDocument();
        expect(screen.queryByText(/Writing · Singapore/)).not.toBeInTheDocument();
    });

    it('serves the writing feed (masthead) at /writing', async () => {
        renderAppAt('/writing');

        // "Writing · Singapore" is the Home masthead eyebrow; the portfolio hero
        // eyebrow must not be on the page.
        expect(await screen.findByText(/Writing · Singapore/)).toBeInTheDocument();
        expect(screen.queryByText(/Portfolio — 2026/)).not.toBeInTheDocument();
    });
});
