import { memo, useState } from 'react';
import { Icon } from '../ui/Icon';
import { WALLPAPERS } from '../../config/data';

export const ImageViewerApp = memo(function ImageViewerApp() {
    const [activeImageIdx, setActiveImageIdx] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [rotate, setRotate] = useState(0);

    // eslint-disable-next-line security/detect-object-injection
    const activeImage = WALLPAPERS[activeImageIdx] || WALLPAPERS[0];
    const imageSrc = activeImage.image || activeImage.darkImage || '';

    const handleZoomIn = () => setZoom(z => Math.min(3, z + 0.25));
    const handleZoomOut = () => setZoom(z => Math.max(0.5, z - 0.25));
    const handleRotateLeft = () => setRotate(r => r - 90);
    const handleRotateRight = () => setRotate(r => r + 90);
    const handleReset = () => {
        setZoom(1);
        setRotate(0);
    };

    return (
        <div className="image-viewer-app">
            <div className="image-viewer-sidebar">
                <h4 className="image-viewer-sidebar-title">Gallery</h4>
                <div className="image-viewer-gallery-list">
                    {WALLPAPERS.map((wp, idx) => {
                        const thumbSrc = wp.image || wp.darkImage || '';
                        return (
                            <button
                                key={wp.id}
                                type="button"
                                className={`image-viewer-gallery-item${idx === activeImageIdx ? ' active' : ''}`}
                                onClick={() => {
                                    setActiveImageIdx(idx);
                                    handleReset();
                                }}
                            >
                                <div className="image-viewer-gallery-thumb-wrap">
                                    <img
                                        src={thumbSrc}
                                        alt={wp.label}
                                        className="image-viewer-gallery-thumb"
                                    />
                                </div>
                                <span className="image-viewer-gallery-label">{wp.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="image-viewer-main">
                <header className="image-viewer-toolbar">
                    <div className="image-viewer-zoom-group linked">
                        <button
                            type="button"
                            className="headerbar-btn"
                            onClick={handleZoomOut}
                            title="Zoom Out"
                            aria-label="Zoom Out"
                        >
                            <Icon name="search" className="zoom-out-icon-adj" /> -
                        </button>
                        <button
                            type="button"
                            className="headerbar-btn"
                            onClick={handleReset}
                            title="Reset zoom/rotation"
                        >
                            {Math.round(zoom * 100)}%
                        </button>
                        <button
                            type="button"
                            className="headerbar-btn"
                            onClick={handleZoomIn}
                            title="Zoom In"
                            aria-label="Zoom In"
                        >
                            <Icon name="search" /> +
                        </button>
                    </div>

                    <div className="image-viewer-rotate-group linked">
                        <button
                            type="button"
                            className="headerbar-btn"
                            onClick={handleRotateLeft}
                            title="Rotate Left"
                            aria-label="Rotate Counter-Clockwise"
                        >
                            <Icon name="arrow-left" /> Rotate
                        </button>
                        <button
                            type="button"
                            className="headerbar-btn"
                            onClick={handleRotateRight}
                            title="Rotate Right"
                            aria-label="Rotate Clockwise"
                        >
                            Rotate <Icon name="arrow-right" />
                        </button>
                    </div>
                </header>

                <div className="image-viewer-stage">
                    <div
                        className="image-viewer-canvas"
                        style={{
                            transform: `scale(${zoom}) rotate(${rotate}deg)`,
                            transition: 'transform 0.25s var(--ease-out-quad)',
                        }}
                    >
                        <img
                            src={imageSrc}
                            alt={activeImage.label}
                            className="image-viewer-display-img"
                            draggable={false}
                        />
                    </div>
                </div>

                <footer className="image-viewer-footer">
                    <span>{activeImage.label}</span>
                    {activeImage.sourceUrl && (
                        <a href={activeImage.sourceUrl} target="_blank" rel="noopener noreferrer">
                            Source Info
                        </a>
                    )}
                </footer>
            </div>
        </div>
    );
});
