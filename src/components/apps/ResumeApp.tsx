import { PROFILE } from '../../config/profile';
import { useDevice } from '../../context/DeviceContext';
import {
    FileArrowDown,
    ArrowSquareOut,
    FilePdf,
} from '@phosphor-icons/react';

export function ResumeApp() {
    const { device } = useDevice();
    const isMobile = device === 'mobile' || device === 'tablet';

    return (
        <div className="resume-app">
            {/* Header bar with actions */}
            <div className="resume-toolbar">
                <div className="resume-toolbar-info">
                    <FilePdf weight="duotone" size={20} />
                    <span>SawYeHtet_ApplicationSupport_Resume.pdf</span>
                </div>
                <div className="resume-toolbar-actions">
                    <a
                        href={PROFILE.resumePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resume-action-btn"
                        aria-label="Open resume in new tab"
                    >
                        <ArrowSquareOut weight="bold" size={16} />
                        <span>Open</span>
                    </a>
                    <a
                        href={PROFILE.resumePath}
                        download
                        className="resume-action-btn resume-action-primary"
                        aria-label="Download resume PDF"
                    >
                        <FileArrowDown weight="bold" size={16} />
                        <span>Download</span>
                    </a>
                </div>
            </div>

            {/* PDF embed or mobile fallback */}
            {isMobile ? (
                <div className="resume-mobile-fallback">
                    <FilePdf weight="duotone" size={64} className="resume-mobile-icon" />
                    <h3>Resume PDF</h3>
                    <p>{PROFILE.name} — {PROFILE.role}</p>
                    <p className="resume-mobile-hint">
                        PDF preview is not available on mobile. Use the buttons above to open or download.
                    </p>
                    <div className="resume-mobile-actions">
                        <a
                            href={PROFILE.resumePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-mobile-btn"
                        >
                            <ArrowSquareOut weight="bold" size={18} />
                            Open in Browser
                        </a>
                        <a
                            href={PROFILE.resumePath}
                            download
                            className="resume-mobile-btn resume-mobile-btn-primary"
                        >
                            <FileArrowDown weight="bold" size={18} />
                            Download PDF
                        </a>
                    </div>
                </div>
            ) : (
                /*
                 * Render the PDF via a same-origin <iframe>, not <object>.
                 * The site's CSP sets `object-src 'none'` (which blocks <object>/<embed>
                 * plugin documents), but an <iframe> navigation is governed by
                 * `frame-src` → falls back to `default-src 'self'`, so a same-origin
                 * PDF loads fine without loosening the policy. Browsers render it with
                 * their built-in PDF viewer. Toolbar Open/Download act as the fallback.
                 */
                <iframe
                    src={PROFILE.resumePath}
                    className="resume-pdf-embed"
                    title="Resume PDF preview"
                />
            )}
        </div>
    );
}
