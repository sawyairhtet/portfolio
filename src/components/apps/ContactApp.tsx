import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotifications } from '../../context/NotificationContext';
import { PROFILE, SOCIAL_LINKS } from '../../config/profile';

const MESSAGE_MAX = 2000;
const COOLDOWN_MS = 8000;

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    message: z
        .string()
        .min(10, 'Message must be at least 10 characters')
        .max(2000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface FormspreeFieldError {
    field?: string;
    message?: string;
}

export function ContactApp() {
    const { showToast } = useNotifications();
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
        // Defer to the next frame so the banner is in the DOM when we focus it.
        requestAnimationFrame(() => bannerRef.current?.focus());
    };

    const onSubmit = async (data: ContactFormData) => {
        setStatusMsg('');
        setStatusType('');

        // Honeypot check — silently no-op if bots filled the trap field.
        if (honeypotRef.current?.value) {
            // Pretend success to the bot; do not actually submit.
            reset();
            startCooldown();
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('message', data.message);

            const response = await fetch('https://formspree.io/f/mqewakad', {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                setStatusMsg("Message sent! I'll get back to you soon.");
                setStatusType('success');
                reset();
                startCooldown();
                showToast('Message sent successfully!', 'fas fa-check-circle');
                focusBanner();
            } else {
                // Surface per-field Formspree errors when present, e.g.
                // { errors: [{ field: "email", message: "is invalid" }] }
                let fieldErrors: FormspreeFieldError[] | undefined;
                try {
                    const body = await response.json();
                    fieldErrors = body?.errors;
                } catch {
                    // Response wasn't JSON — fall through to generic error
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
            // Clipboard API unavailable (non-HTTPS or denied).
            showToast('Copy unavailable — long-press to copy', 'fas fa-circle-exclamation');
        }
    };

    return (
        <div className="adw-page contact-page">
            {/* Status header — Adwaita AdwStatusPage style, compact */}
            <header className="adw-status-header">
                <div className="adw-status-row">
                    <div className="adw-status-icon">
                        <i className="fas fa-envelope" aria-hidden="true" />
                    </div>
                    <div className="adw-status-text">
                        <h2>Contact Saw Ye Htet</h2>
                        <p>
                            {PROFILE.role}. Email is the fastest path for roles, interviews, or
                            project questions.
                        </p>
                    </div>
                    <div className="adw-availability-badge" aria-label="Availability">
                        <span className="adw-availability-dot" />
                        Available
                    </div>
                </div>
            </header>

            {/* Quick contact — boxed list of action rows */}
            <section className="adw-section">
                <h3 className="adw-section-title">Quick Contact</h3>
                <div className="adw-boxed-list">
                    <div className="adw-row">
                        <div className="adw-row-icon adw-icon-blue">
                            <i className="fas fa-envelope" aria-hidden="true" />
                        </div>
                        <a
                            className="adw-row-text adw-row-main-link"
                            href={`mailto:${PROFILE.email}`}
                            aria-label={`Email ${PROFILE.email}`}
                        >
                            <span className="adw-row-title">Email</span>
                            <span className="adw-row-subtitle">{PROFILE.email}</span>
                        </a>
                        <div className="adw-row-actions">
                            <button
                                type="button"
                                className="adw-row-icon-btn"
                                onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    copyEmail();
                                }}
                                aria-label={copyState === 'copied' ? 'Copied' : 'Copy email'}
                                title={copyState === 'copied' ? 'Copied' : 'Copy email'}
                            >
                                <i
                                    className={
                                        copyState === 'copied' ? 'fas fa-check' : 'fas fa-copy'
                                    }
                                    aria-hidden="true"
                                />
                            </button>
                            <a
                                className="adw-row-icon-btn"
                                href={`mailto:${PROFILE.email}`}
                                aria-label="Open mail client"
                                title="Open mail"
                            >
                                <i
                                    className="fas fa-arrow-up-right-from-square"
                                    aria-hidden="true"
                                />
                            </a>
                        </div>
                    </div>
                    <a
                        className="adw-row adw-row-link"
                        href={PROFILE.resumePath}
                        download
                        aria-label="Resume"
                    >
                        <div className="adw-row-icon adw-icon-purple">
                            <i className="fas fa-file-pdf" aria-hidden="true" />
                        </div>
                        <div className="adw-row-text">
                            <span className="adw-row-title">Resume</span>
                            <span className="adw-row-subtitle">PDF · Download</span>
                        </div>
                        <i className="fas fa-download adw-row-chevron" aria-hidden="true" />
                    </a>
                </div>
            </section>

            {/* Connect — social profiles */}
            <section className="adw-section">
                <h3 className="adw-section-title">Connect</h3>
                <div className="adw-boxed-list">
                    {SOCIAL_LINKS.map(link => (
                        <a
                            key={link.label}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="adw-row adw-row-link"
                            aria-label={link.label}
                        >
                            <div className="adw-row-icon adw-icon-neutral">
                                <i className={link.icon} aria-hidden="true" />
                            </div>
                            <div className="adw-row-text">
                                <span className="adw-row-title">{link.label}</span>
                                <span className="adw-row-subtitle">{link.handle}</span>
                            </div>
                            <i
                                className="fas fa-arrow-up-right-from-square adw-row-chevron"
                                aria-hidden="true"
                            />
                        </a>
                    ))}
                </div>
            </section>

            {/* Availability details */}
            <section className="adw-section">
                <h3 className="adw-section-title">Availability</h3>
                <div className="adw-boxed-list">
                    <div className="adw-row">
                        <div className="adw-row-icon adw-icon-green">
                            <i className="fas fa-circle-check" aria-hidden="true" />
                        </div>
                        <div className="adw-row-text">
                            <span className="adw-row-title">Open to opportunities</span>
                            <span className="adw-row-subtitle">
                                Junior Java/backend roles, internships, or practical collaborations
                            </span>
                        </div>
                    </div>
                    <div className="adw-row">
                        <div className="adw-row-icon adw-icon-purple">
                            <i className="fas fa-code" aria-hidden="true" />
                        </div>
                        <div className="adw-row-text">
                            <span className="adw-row-title">Best fit</span>
                            <span className="adw-row-subtitle">
                                {PROFILE.roleTarget} · Spring Boot · SQL · React/TypeScript
                            </span>
                        </div>
                    </div>
                    <div className="adw-row">
                        <div className="adw-row-icon adw-icon-blue">
                            <i className="fas fa-location-dot" aria-hidden="true" />
                        </div>
                        <div className="adw-row-text">
                            <span className="adw-row-title">Location</span>
                            <span className="adw-row-subtitle">{PROFILE.location}</span>
                        </div>
                    </div>
                    <div className="adw-row">
                        <div className="adw-row-icon adw-icon-orange">
                            <i className="fas fa-clock" aria-hidden="true" />
                        </div>
                        <div className="adw-row-text">
                            <span className="adw-row-title">Response time</span>
                            <span className="adw-row-subtitle">Usually within 24 hours</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Send a message — form group */}
            <section className="adw-section">
                <h3 className="adw-section-title">Send a Message</h3>
                <form
                    className={`adw-boxed-list adw-form${submitDisabled ? ' is-submitting' : ''}`}
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                >
                    {/* Honeypot — invisible to humans, off-screen so naive bots
                        that fill every input get caught. Uses an innocuous field
                        name that bots tend to auto-fill. */}
                    <input
                        ref={honeypotRef}
                        type="text"
                        name="website_url"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="contact-honeypot"
                    />
                    <div className={`adw-form-row${errors.name ? ' has-error' : ''}`}>
                        <label htmlFor="contact-name" className="adw-form-label">
                            Name
                        </label>
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
                        {errors.name && (
                            <span
                                className="adw-form-error"
                                id="contact-name-error"
                                aria-live="polite"
                            >
                                {errors.name.message}
                            </span>
                        )}
                    </div>
                    <div className={`adw-form-row${errors.email ? ' has-error' : ''}`}>
                        <label htmlFor="contact-email" className="adw-form-label">
                            Email
                        </label>
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
                        {errors.email && (
                            <span
                                className="adw-form-error"
                                id="contact-email-error"
                                aria-live="polite"
                            >
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                    <div
                        className={`adw-form-row adw-form-row-textarea${errors.message ? ' has-error' : ''}`}
                    >
                        <div className="adw-form-label-row">
                            <label htmlFor="contact-message" className="adw-form-label">
                                Message
                            </label>
                            <span
                                className="adw-form-counter"
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                {messageValue.length} / {MESSAGE_MAX}
                            </span>
                        </div>
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
                        {errors.message && (
                            <span
                                className="adw-form-error"
                                id="contact-message-error"
                                aria-live="polite"
                            >
                                {errors.message.message}
                            </span>
                        )}
                    </div>
                    <div className="adw-form-actions">
                        {statusMsg && (
                            <div
                                ref={bannerRef}
                                className={`adw-banner adw-banner-${statusType}`}
                                role="status"
                                aria-live="polite"
                                tabIndex={-1}
                            >
                                <i
                                    className={
                                        statusType === 'success'
                                            ? 'fas fa-circle-check'
                                            : 'fas fa-circle-exclamation'
                                    }
                                    aria-hidden="true"
                                />
                                <span>{statusMsg}</span>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="adw-btn adw-btn-suggested"
                            disabled={submitDisabled}
                            aria-busy={isSubmitting ? 'true' : 'false'}
                        >
                            {isSubmitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin" aria-hidden="true" />
                                    Sending…
                                </>
                            ) : isCoolingDown && statusType === 'success' ? (
                                <>
                                    <i className="fas fa-circle-check" aria-hidden="true" />
                                    Sent
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane" aria-hidden="true" />
                                    Send Message
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
