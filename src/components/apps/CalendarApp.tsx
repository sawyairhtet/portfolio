import { memo, useState, useMemo } from 'react';
import { Icon } from '../ui/Icon';

interface CalendarEvent {
    id: string;
    title: string;
    description: string;
    date: string; // YYYY-MM-DD
    type: 'milestone' | 'interview' | 'study' | 'custom';
}

const DEFAULT_EVENTS: CalendarEvent[] = [
    {
        id: '1',
        title: 'Graduated from Singapore Polytechnic',
        description:
            'Diploma in Information Technology, GPA 3.55. Specializing in Systems, Java, Backend development.',
        date: '2026-05-04',
        type: 'milestone',
    },
    {
        id: '2',
        title: 'LTVP & Job Hunt Commenced',
        description:
            'MOE Tuition Grant active. Target S-Pass, minimum SGD 3,300/month as Junior Java Backend Developer.',
        date: '2026-05-15',
        type: 'milestone',
    },
    {
        id: '3',
        title: 'System Support & ITIL Self-Study',
        description:
            'Reviewed ITIL foundation principles, SLA management, and logging analysis with Fedora CLI.',
        date: '2026-05-27',
        type: 'study',
    },
    {
        id: '5',
        title: 'Today - Portfolio Audited',
        description:
            'Fidelity check for GNOME 49 / Fedora 43 UI simulation. Reviewing accessibility, performance, and apps.',
        date: '2026-05-29',
        type: 'interview',
    },
];

export const CalendarApp = memo(function CalendarApp() {
    const [currentDate, setCurrentDate] = useState(() => new Date(2026, 4, 29)); // Default to May 29, 2026
    const [selectedDateStr, setSelectedDateStr] = useState('2026-05-29');
    const [events, setEvents] = useState<CalendarEvent[]>(DEFAULT_EVENTS);
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDesc, setNewEventDesc] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
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

    const handlePrevMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const handleToday = () => {
        const today = new Date(2026, 4, 29); // Fix today to May 29, 2026 for simulation consistency
        setCurrentDate(today);
        setSelectedDateStr('2026-05-29');
    };

    // Calendar logic
    const daysInMonth = useMemo(() => {
        return new Date(year, month + 1, 0).getDate();
    }, [year, month]);

    const firstDayIndex = useMemo(() => {
        return new Date(year, month, 1).getDay();
    }, [year, month]);

    const calendarCells = useMemo(() => {
        const cells = [];
        // Pad previous month days
        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = firstDayIndex - 1; i >= 0; i--) {
            const d = prevMonthDays - i;
            const m = month === 0 ? 11 : month - 1;
            const y = month === 0 ? year - 1 : year;
            cells.push({ day: d, month: m, year: y, isCurrentMonth: false });
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            cells.push({ day: i, month, year, isCurrentMonth: true });
        }

        // Pad next month days
        const remaining = 42 - cells.length; // 6 rows of 7 days
        for (let i = 1; i <= remaining; i++) {
            const m = month === 11 ? 0 : month + 1;
            const y = month === 11 ? year + 1 : year;
            cells.push({ day: i, month: m, year: y, isCurrentMonth: false });
        }

        return cells;
    }, [year, month, daysInMonth, firstDayIndex]);

    const formatDateStr = (y: number, m: number, d: number) => {
        const mm = String(m + 1).padStart(2, '0');
        const dd = String(d).padStart(2, '0');
        return `${y}-${mm}-${dd}`;
    };

    const activeEvents = useMemo(() => {
        return events.filter(e => e.date === selectedDateStr);
    }, [events, selectedDateStr]);

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEventTitle.trim()) return;

        const newEvent: CalendarEvent = {
            id: String(Date.now()),
            title: newEventTitle,
            description: newEventDesc,
            date: selectedDateStr,
            type: 'custom',
        };

        setEvents(prev => [...prev, newEvent]);
        setNewEventTitle('');
        setNewEventDesc('');
        setShowAddForm(false);
    };

    const dayHasEvents = (y: number, m: number, d: number) => {
        const dateStr = formatDateStr(y, m, d);
        return events.some(e => e.date === dateStr);
    };

    return (
        <div className="calendar-app">
            <div className="calendar-left-pane">
                <header className="calendar-header">
                    <span className="calendar-month-title">
                        {monthNames.at(month) ?? ''} {year}
                    </span>
                    <div className="calendar-nav-buttons linked">
                        <button
                            type="button"
                            className="headerbar-btn"
                            onClick={handlePrevMonth}
                            aria-label="Previous Month"
                        >
                            <Icon name="arrow-left" />
                        </button>
                        <button type="button" className="headerbar-btn" onClick={handleToday}>
                            Today
                        </button>
                        <button
                            type="button"
                            className="headerbar-btn"
                            onClick={handleNextMonth}
                            aria-label="Next Month"
                        >
                            <Icon name="arrow-right" />
                        </button>
                    </div>
                </header>

                <div className="calendar-grid">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, idx) => (
                        <div key={idx} className="calendar-grid-header-cell">
                            {w}
                        </div>
                    ))}
                    {calendarCells.map((cell, idx) => {
                        const cellDateStr = formatDateStr(cell.year, cell.month, cell.day);
                        const isSelected = cellDateStr === selectedDateStr;
                        const isToday = cellDateStr === '2026-05-29';
                        const hasEv = dayHasEvents(cell.year, cell.month, cell.day);

                        return (
                            <button
                                key={idx}
                                type="button"
                                className={`calendar-grid-cell${cell.isCurrentMonth ? '' : ' out'}${isSelected ? ' selected' : ''}${isToday ? ' today' : ''}`}
                                onClick={() => setSelectedDateStr(cellDateStr)}
                            >
                                <span className="calendar-cell-day-number">{cell.day}</span>
                                {hasEv && <span className="calendar-cell-event-dot" />}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="calendar-right-pane">
                <div className="calendar-events-section">
                    <h3 className="calendar-date-header">
                        {(() => {
                            const [y, m, d] = selectedDateStr.split('-').map(Number);
                            return new Date(y, m - 1, d).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            });
                        })()}
                    </h3>

                    <div className="calendar-events-list">
                        {activeEvents.length === 0 ? (
                            <div className="calendar-no-events">
                                <Icon name="calendar-blank" />
                                <p>No events scheduled for this day</p>
                            </div>
                        ) : (
                            activeEvents.map(ev => (
                                <div key={ev.id} className={`calendar-event-card type-${ev.type}`}>
                                    <div className="calendar-event-dot" />
                                    <div className="calendar-event-details">
                                        <h4>{ev.title}</h4>
                                        <p>{ev.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {!showAddForm ? (
                        <button
                            type="button"
                            className="calendar-add-event-btn"
                            onClick={() => setShowAddForm(true)}
                        >
                            <Icon name="plus" />
                            <span>Add Event</span>
                        </button>
                    ) : (
                        <form onSubmit={handleAddEvent} className="calendar-add-event-form">
                            <h4>New Event</h4>
                            <input
                                type="text"
                                placeholder="Event Title"
                                required
                                value={newEventTitle}
                                onChange={e => setNewEventTitle(e.target.value)}
                                className="calendar-form-input"
                                autoFocus
                            />
                            <textarea
                                placeholder="Description (Optional)"
                                value={newEventDesc}
                                onChange={e => setNewEventDesc(e.target.value)}
                                className="calendar-form-textarea"
                            />
                            <div className="calendar-form-actions">
                                <button
                                    type="button"
                                    className="calendar-btn-cancel"
                                    onClick={() => setShowAddForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="calendar-btn-submit">
                                    Add
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
});
