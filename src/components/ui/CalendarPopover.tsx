import { useMemo, useRef, useEffect, useState } from 'react';
import { Icon } from './Icon';
import { useNotifications } from '../../context/NotificationContext';
import { Calculator, BellSlash, CaretLeft, CaretRight } from '@phosphor-icons/react';

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface CalendarPopoverProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CalendarPopover({ isOpen, onClose }: CalendarPopoverProps) {
    const { notifications, isDnd, setDnd, dismissNotification, clearAllNotifications } =
        useNotifications();
    const popoverRef = useRef<HTMLDivElement>(null);
    const [viewDate, setViewDate] = useState(() => new Date());

    const today = useMemo(() => {
        const now = new Date();
        return {
            day: now.getDate(),
            month: now.getMonth(),
            year: now.getFullYear(),
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setViewDate(new Date());
        }
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();

    const prevMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    const nextMonth = () => setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

    const calendarDays = useMemo(() => {
        const firstDay = new Date(year, month, 1);
        const firstDow = firstDay.getDay() || 7;
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const cells: (number | null)[] = [];
        for (let i = 1; i < firstDow; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++) cells.push(d);
        return cells;
    }, [month, year]);

    const activeNotifications = notifications.filter(n => n.group !== 'archived').slice(0, 5);
    const hasNotifications = activeNotifications.length > 0;

    return (
        <div
            ref={popoverRef}
            className={`calendar-popover ${isOpen ? 'visible' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Calendar and notifications"
            aria-hidden={!isOpen}
            inert={!isOpen || undefined}
            onClick={e => {
                if (e.target === popoverRef.current) onClose();
            }}
        >
            <div className="calendar-popover-calendar">
                <div className="calendar-popover-nav">
                    <button type="button" aria-label="Previous month" onClick={prevMonth}>
                        <CaretLeft weight="bold" size={14} />
                    </button>
                    <span className="calendar-popover-month">
                        {/* eslint-disable-next-line security/detect-object-injection */}
                        {MONTHS[month]} {year}
                    </span>
                    <button type="button" aria-label="Next month" onClick={nextMonth}>
                        <CaretRight weight="bold" size={14} />
                    </button>
                </div>
                <div className="calendar-popover-dow">
                    {DAYS.map(d => (
                        <span key={d} className="calendar-dow">
                            {d}
                        </span>
                    ))}
                </div>
                <div className="calendar-popover-grid">
                    {calendarDays.map((day, i) => {
                        if (day === null) return <span key={`e-${i}`} />;
                        const isToday =
                            day === today.day && month === today.month && year === today.year;
                        return (
                            <span key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                                {day}
                            </span>
                        );
                    })}
                </div>
            </div>

            <div className="calendar-popover-sidebar">
                <div className="calendar-popover-header">
                    <span className="calendar-popover-title">Notifications</span>
                    <div className="calendar-popover-actions">
                        <button
                            type="button"
                            className={`calendar-dnd-toggle ${isDnd ? 'active' : ''}`}
                            aria-label={
                                isDnd ? 'Turn off Do Not Disturb' : 'Turn on Do Not Disturb'
                            }
                            aria-pressed={isDnd}
                            onClick={() => setDnd(!isDnd)}
                        >
                            <BellSlash weight={isDnd ? 'fill' : 'regular'} size={14} />
                        </button>
                        {hasNotifications && (
                            <button
                                type="button"
                                className="calendar-clear-btn"
                                aria-label="Clear all notifications"
                                onClick={clearAllNotifications}
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
                <div className="calendar-popover-notifications">
                    {!hasNotifications ? (
                        <div className="calendar-popover-empty">
                            <Calculator weight="duotone" size={24} />
                            <span>No notifications</span>
                        </div>
                    ) : (
                        activeNotifications.map(n => (
                            <div key={n.id} className="calendar-notification-item">
                                <div
                                    className="calendar-notif-icon"
                                    style={{ background: n.iconBg }}
                                >
                                    <Icon name={n.icon} />
                                </div>
                                <div className="calendar-notif-content">
                                    <strong>{n.title}</strong>
                                    <span>{n.body}</span>
                                    <small>{n.time}</small>
                                </div>
                                <button
                                    type="button"
                                    className="calendar-notif-dismiss"
                                    aria-label={`Dismiss ${n.title}`}
                                    onClick={() => dismissNotification(n.id)}
                                >
                                    <Icon name="times" />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
