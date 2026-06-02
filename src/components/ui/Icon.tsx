import type { ComponentType } from 'react';
import {
    AppWindow,
    BatteryCharging,
    BatteryHigh,
    BatteryLow,
    BatteryMedium,
    BatteryWarning,
    BellSlash,
    Bluetooth,
    CalendarBlank,
    CellSignalFull,
    Clock,
    Compass,
    Desktop,
    DotsNine,
    Envelope,
    FileArrowDown,
    FilePdf,
    FileText,
    Folder,
    FolderOpen,
    Gear,
    GearSix,
    GithubLogo,
    Image,
    Info,
    Lightbulb,
    Lightning,
    Lock,
    MagnifyingGlass,
    Moon,
    Package,
    Power,
    SpeakerHigh,
    Sun,
    Terminal,
    Toolbox,
    UserCircle,
    WifiHigh,
    X,
} from '@phosphor-icons/react';
import type { IconWeight } from '@phosphor-icons/react';

type PhosphorIconComponent = ComponentType<{ size?: string | number; weight?: IconWeight; [key: string]: unknown }>;

function FedoraLogo({ size = '1em', color = 'currentColor', ...rest }: { size?: string | number; color?: string; [key: string]: unknown }) {
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

export const ICON_MAP: Record<string, PhosphorIconComponent> = {
    'user-circle': UserCircle,
    folder: Folder,
    'folder-open': FolderOpen,
    tools: Toolbox,
    toolbox: Toolbox,
    envelope: Envelope,
    'firefox-browser': Compass,
    terminal: Terminal,
    'file-lines': FileText,
    'file-pdf': FilePdf,
    'file-arrow-down': FileArrowDown,
    cog: Gear,
    'gear-six': GearSix,
    clock: Clock,
    calendar: CalendarBlank,
    'calendar-blank': CalendarBlank,
    github: GithubLogo,
    desktop: Desktop,
    signal: CellSignalFull,
    wifi: WifiHigh,
    'battery-three-quarters': BatteryHigh,
    'battery-full': BatteryHigh,
    'battery-half': BatteryMedium,
    'battery-quarter': BatteryLow,
    'battery-empty': BatteryWarning,
    'battery-charging': BatteryCharging,
    'volume-up': SpeakerHigh,
    image: Image,
    'bell-slash': BellSlash,
    times: X,
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
    package: Package,
    grip: DotsNine,
    fedora: FedoraLogo,
    'window-maximize': AppWindow,
    'info-circle': Info,
};

export function registerIcons(icons: Record<string, PhosphorIconComponent>) {
    Object.assign(ICON_MAP, icons);
}

export type IconName = keyof typeof ICON_MAP;

interface IconProps {
    name: string;
    className?: string;
    weight?: IconWeight;
}

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
