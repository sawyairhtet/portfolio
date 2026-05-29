import type { ComponentType } from 'react';
import {
    AppWindow,
    ArrowLeft,
    ArrowRight,
    BatteryHigh,
    BellSlash,
    Bluetooth,
    CellSignalFull,
    CheckCircle,
    Clock,
    Code,
    Coffee,
    Compass,
    Database,
    Desktop,
    DotsNine,
    Envelope,
    FileArrowDown,
    FilePdf,
    FileText,
    Folder,
    FolderOpen,
    Gear,
    GithubLogo,
    HardDrives,
    Headset,
    House,
    type IconProps as PhosphorIconProps,
    type IconWeight,
    Image,
    Info,
    Lightbulb,
    Lightning,
    LinkedinLogo,
    Lock,
    MagnifyingGlass,
    Moon,
    Package,
    Power,
    SpeakerHigh,
    Sun,
    TelegramLogo,
    Terminal,
    TestTube,
    Toolbox,
    TreeStructure,
    UserCircle,
    WarningCircle,
    WifiHigh,
    Wrench,
    X,
    XLogo,
} from '@phosphor-icons/react';

/**
 * Faithful-but-tiny reproduction of the Fedora "f" infinity logo for the boot
 * screen. Phosphor has no Fedora brand glyph, and we no longer ship Font Awesome
 * brands. Kept monochrome (currentColor) so it inherits theming like every other
 * icon. See the Do-Not-Touch note in CLAUDE.md about the boot sequence.
 */
function FedoraLogo({ size = '1em', color = 'currentColor', ...rest }: PhosphorIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 256 256"
            fill={color}
            xmlns="http://www.w3.org/2000/svg"
            {...rest}
        >
            <path d="M128 8a120 120 0 1 0 120 120A120 120 0 0 0 128 8Zm26 86h-20a16 16 0 0 0-16 16v14h30v22h-30v54h-24v-54H80v-22h14v-14a40 40 0 0 1 40-40h20Z" />
        </svg>
    );
}

/**
 * Single source of truth mapping the project's string-based icon keys (used
 * declaratively in data.ts / profile.ts and passed through the toast /
 * notification system) to Phosphor icon components. Keys are the old Font
 * Awesome names with the `fa-`/`fas`/`fab` prefixes stripped, so existing data
 * shapes stay readable.
 */
export const ICON_MAP: Record<string, ComponentType<PhosphorIconProps>> = {
    // App definitions
    'user-circle': UserCircle,
    folder: Folder,
    'folder-open': FolderOpen,
    tools: Toolbox,
    envelope: Envelope,
    'firefox-browser': Compass,
    terminal: Terminal,
    'file-lines': FileText,
    'file-pdf': FilePdf,
    'file-arrow-down': FileArrowDown,
    cog: Gear,
    clock: Clock,
    // Projects & skills
    github: GithubLogo,
    desktop: Desktop,
    server: HardDrives,
    headset: Headset,
    vial: TestTube,
    wrench: Wrench,
    code: Code,
    database: Database,
    sitemap: TreeStructure,
    // Social
    linkedin: LinkedinLogo,
    telegram: TelegramLogo,
    'x-twitter': XLogo,
    // Status / chrome
    signal: CellSignalFull,
    wifi: WifiHigh,
    'battery-three-quarters': BatteryHigh,
    'volume-up': SpeakerHigh,
    image: Image,
    'bell-slash': BellSlash,
    times: X,
    'arrow-right': ArrowRight,
    'arrow-left': ArrowLeft,
    'bluetooth-b': Bluetooth,
    bolt: Lightning,
    moon: Moon,
    lightbulb: Lightbulb,
    sun: Sun,
    lock: Lock,
    'power-off': Power,
    search: MagnifyingGlass,
    'magnifying-glass': MagnifyingGlass,
    'box-open': Package,
    grip: DotsNine,
    fedora: FedoraLogo,
    'window-maximize': AppWindow,
    home: House,
    // Toasts / notifications
    'check-circle': CheckCircle,
    'circle-exclamation': WarningCircle,
    'info-circle': Info,
    'mug-hot': Coffee,
};

export type IconName = keyof typeof ICON_MAP;

interface IconProps {
    /** Icon key (see ICON_MAP). Typed loosely because data.ts passes strings. */
    name: string;
    /** Extra class names placed on the wrapping <i> (so existing CSS keeps working). */
    className?: string;
    /** Phosphor weight. Defaults to regular for a clean, GNOME-symbolic look. */
    weight?: IconWeight;
}

/**
 * Renders a Phosphor glyph inside an <i> wrapper that carries the original
 * className. The glyph is sized at 1em and uses currentColor, exactly like the
 * Font Awesome font icons it replaced — so every existing CSS rule targeting
 * these `i` elements (font-size, color, width, display) keeps working unchanged.
 */
export function Icon({ name, className, weight = 'regular' }: IconProps) {
    // eslint-disable-next-line security/detect-object-injection -- name is a static icon key, not user input
    const Glyph = Object.prototype.hasOwnProperty.call(ICON_MAP, name) ? ICON_MAP[name] : undefined;
    if (!Glyph) {
        return null;
    }
    return (
        <i className={className} aria-hidden="true">
            <Glyph size="1em" weight={weight} />
        </i>
    );
}
