import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotifications } from '../../context/NotificationContext';
import { PROFILE, SOCIAL_LINKS } from '../../config/profile';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
    EnvelopeSimple,
    LinkedinLogo,
    GithubLogo,
    XLogo,
    Copy,
    Check,
    ArrowSquareOut,
    PaperPlaneTilt,
    SpinnerGap,
    CheckCircle,
    WarningCircle,
    User,
    At,
    ChatText,
    TelegramLogo,
} from '@phosphor-icons/react';

const MESSAGE_MAX = 2000;
const COOLDOWN_MS = 8000;

const FORMSPREE_URL =
    import.meta.env.VITE_FORMSPREE_URL || 'https://formspree.io/f/mqewakad';

const INJECTION_PATTERN = /<\s*\/?\s*(script|img|iframe|object|embed|link|style|svg|math)\b/i;

const contactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name is too long')
        .refine(v => !INJECTION_PATTERN.test(v), 'Invalid characters in name'),
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Please enter a valid email'),
    message: z
        .string()
        .trim()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface FormspreeFieldError {
    field?: string;
    message?: string;
}

const RATE_LIMIT_KEY = 'contact_submit_ts';
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

function isRateLimited(): boolean {
    try {
        const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
        const timestamps: number[] = raw ? JSON.parse(raw) : [];
        const now = Date.now();
        const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
        return recent.length >= RATE_LIMIT_MAX;
    } catch {
        return false;
    }
}

function recordSubmission(): void {
    try {
        const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
        const timestamps: number[] = raw ? JSON.parse(raw) : [];
        const now = Date.now();
        timestamps.push(now);
        const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
        sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
    } catch {
        // no-op
    }
}

const SOCIAL_ICON_MAP: Record<string, React.ReactNode> = {
    GitHub: <GithubLogo weight="duotone" size={20} />,
    LinkedIn: <LinkedinLogo weight="duotone" size={20} />,
    X: <XLogo weight="duotone" size={20} />,
    Telegram: <TelegramLogo weight="duotone" size={20} />,
};

export function ContactApp() {
    const { showToast } = useNotifications();
    const reduced = useReducedMotion();
    const [statusMsg, setStatusMsg] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');
    const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle');
    const [isCoolingDown, setIsCoolingDown] = useState(false);
    const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const honeypotRef = useRef<HTMLInputElement>(null);
    const bannerRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const messageValue = watch('message') ?? '';
    const submitDisabled = isSubmitting || isCoolingDown;

    useEffect(() => {
        return () => {
            if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
        };
    }, []);

    const startCooldown = () => {
        setIsCoolingDown(true);
        if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
        cooldownTimerRef.current = setTimeout(() => setIsCoolingDown(false), COOLDOWN_MS);
    };

    const focusBanner = () => {
        requestAnimationFrame(() => bannerRef.current?.focus());
    };

    const onSubmit = async (data: ContactFormData) => {
        setStatusMsg('');
        setStatusType('');

        if (honeypotRef.current?.value) {
            reset();
            startCooldown();
            return;
        }

        if (isRateLimited()) {
            setStatusMsg('Too many messages. Please wait a few minutes.');
            setStatusType('error');
            focusBanner();
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('message', data.message);

            const response = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                setStatusMsg("Message sent! I'll get back to you soon.");
                setStatusType('success');
                reset();
                startCooldown();
                recordSubmission();
                showToast('Message sent successfully!', 'fas fa-check-circle');
                focusBanner();
            } else {
                let fieldErrors: FormspreeFieldError[] | undefined;
                try {
                    const body = await response.json();
                    fieldErrors = body?.errors;
                } catch {
                    // fall through
                }

                let mappedAny = false;
                if (Array.isArray(fieldErrors)) {
                    for (const fe of fieldErrors) {
                        if (
                            fe.field === 'name' ||
                            fe.field === 'email' ||
                            fe.field === 'message'
                        ) {
                            setError(fe.field, {
                                type: 'server',
                                message: fe.message ?? 'Invalid value',
                            });
                            mappedAny = true;
                        }
                    }
                }

                setStatusMsg(
                    mappedAny
                        ? 'Some fields need attention.'
                        : 'Oops! Something went wrong. Try emailing me directly.'
                );
                setStatusType('error');
                focusBanner();
            }
        } catch {
            setStatusMsg('Oops! Something went wrong. Try emailing me directly.');
            setStatusType('error');
            focusBanner();
        }
    };

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(PROFILE.email);
            setCopyState('copied');
            showToast('Email copied', 'fas fa-check-circle');
            window.setTimeout(() => setCopyState('idle'), 1800);
        } catch {
            showToast('Copy unavailable — long-press to copy', 'fas fa-circle-exclamation');
        }
    };

    return (
        <div className="contact-redesign">
            {/* Left — Info Panel */}
            <div className="contact-info-panel">
                <div className="contact-info-ambient" aria-hidden="true" />
                <div className="contact-info-inner">
                    <div className="contact-micro-card">
                        <div className="contact-micro-avatar">
                            <img
                                src="/images/profile-picture.webp"
                                alt=""
                                width={64}
                                height={64}
                            />
                        </div>
                        <strong>{PROFILE.name}</strong>
                        <span className="contact-avail-pill">
                            <span className="contact-pulse-dot" />
                            Available for opportunities
                        </span>
                    </div>

                    <div className="contact-method-rows">
                        <div className="contact-method-row">
                            <EnvelopeSimple weight="duotone" size={18} />
                            <a href={`mailto:${PROFILE.email}`} className="contact-method-value">
                                {PROFILE.email}
                            </a>
                            <motion.button
                                type="button"
                                aria-label="Copy email"
                                className="contact-ghost-btn"
                                onClick={copyEmail}
                                whileTap={reduced ? undefined : { scale: 0.95 }}
                            >
                                <AnimatePresence mode="wait">
                                    {copyState === 'copied' ? (
                                        <motion.span
                                            key="copied"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="contact-copied-flash"
                                        >
                                            <Check weight="bold" size={14} /> Copied
                                        </motion.span>
                                    ) : (
                                        <motion.span
                                            key="copy"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            <Copy weight="bold" size={14} /> Copy
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </div>

                        {SOCIAL_LINKS.filter(l => l.label !== 'X').map(link => (
                            <div key={link.label} className="contact-method-row">
                                {SOCIAL_ICON_MAP[link.label] || <ArrowSquareOut weight="duotone" size={18} />}
                                <span className="contact-method-value">{link.handle}</span>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="contact-ghost-btn"
                                >
                                    <ArrowSquareOut weight="bold" size={14} /> Open
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="contact-social-icons">
                        {SOCIAL_LINKS.map(link => (
                            <motion.a
                                key={link.label}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-social-circle"
                                aria-label={link.label}
                                whileHover={reduced ? undefined : { scale: 1.08 }}
                                whileTap={reduced ? undefined : { scale: 0.95 }}
                            >
                                {SOCIAL_ICON_MAP[link.label] || <ArrowSquareOut weight="bold" size={18} />}
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — Form Panel */}
            <div className="contact-form-panel">
                <form
                    className={`contact-form-v2${submitDisabled ? ' is-submitting' : ''}`}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    <input
                        ref={honeypotRef}
                        type="text"
                        name="website_url"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="contact-honeypot"
                    />

                    <div className={`contact-field${errors.name ? ' has-error' : ''}`}>
                        <label htmlFor="contact-name">Name</label>
                        <div className="contact-input-wrap">
                            <User weight="bold" size={16} className="contact-input-icon" />
                            <input
                                type="text"
                                id="contact-name"
                                placeholder="Your name"
                                autoComplete="name"
                                disabled={submitDisabled}
                                aria-invalid={errors.name ? 'true' : 'false'}
                                aria-describedby={errors.name ? 'contact-name-error' : undefined}
                                {...register('name')}
                            />
                        </div>
                        {errors.name && (
                            <span className="contact-field-error" id="contact-name-error" aria-live="polite">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div className={`contact-field${errors.email ? ' has-error' : ''}`}>
                        <label htmlFor="contact-email">Email</label>
                        <div className="contact-input-wrap">
                            <At weight="bold" size={16} className="contact-input-icon" />
                            <input
                                type="email"
                                id="contact-email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                disabled={submitDisabled}
                                aria-invalid={errors.email ? 'true' : 'false'}
                                aria-describedby={errors.email ? 'contact-email-error' : undefined}
                                {...register('email')}
                            />
                        </div>
                        {errors.email && (
                            <span className="contact-field-error" id="contact-email-error" aria-live="polite">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className={`contact-field${errors.message ? ' has-error' : ''}`}>
                        <div className="contact-label-row">
                            <label htmlFor="contact-message">Message</label>
                            <span className="contact-counter" aria-live="polite" aria-atomic="true">
                                {messageValue.length} / {MESSAGE_MAX}
                            </span>
                        </div>
                        <div className="contact-input-wrap contact-textarea-wrap">
                            <ChatText weight="bold" size={16} className="contact-input-icon contact-textarea-icon" />
                            <textarea
                                id="contact-message"
                                placeholder="Role, timeline, useful links, and what you would like me to review."
                                rows={5}
                                maxLength={MESSAGE_MAX}
                                disabled={submitDisabled}
                                aria-invalid={errors.message ? 'true' : 'false'}
                                aria-describedby={errors.message ? 'contact-message-error' : undefined}
                                {...register('message')}
                            />
                        </div>
                        {errors.message && (
                            <span className="contact-field-error" id="contact-message-error" aria-live="polite">
                                {errors.message.message}
                            </span>
                        )}
                    </div>

                    <AnimatePresence>
                        {statusMsg && (
                            <motion.div
                                ref={bannerRef}
                                className={`contact-status-banner contact-status-${statusType}`}
                                role="status"
                                aria-live="polite"
                                tabIndex={-1}
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {statusType === 'success' ? (
                                    <CheckCircle weight="fill" size={16} />
                                ) : (
                                    <WarningCircle weight="fill" size={16} />
                                )}
                                <span>{statusMsg}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        className="contact-submit-v2"
                        disabled={submitDisabled}
                        aria-busy={isSubmitting ? 'true' : 'false'}
                        whileHover={reduced || submitDisabled ? undefined : { scale: 1.01 }}
                        whileTap={reduced || submitDisabled ? undefined : { scale: 0.98 }}
                    >
                        {isSubmitting ? (
                            <>
                                <SpinnerGap weight="bold" size={16} className="contact-spinner" />
                                Sending...
                            </>
                        ) : isCoolingDown && statusType === 'success' ? (
                            <>
                                <CheckCircle weight="fill" size={16} />
                                Sent
                            </>
                        ) : (
                            <>
                                <PaperPlaneTilt weight="bold" size={16} />
                                Send Message
                            </>
                        )}
                    </motion.button>
                </form>
            </div>
        </div>
    );
}
