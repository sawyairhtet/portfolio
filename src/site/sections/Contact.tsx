import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PROFILE, SOCIAL_LINKS } from '../../config/profile';

const MESSAGE_MAX = 2000;
const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL || 'https://formspree.io/f/mqewakad';
const INJECTION_PATTERN = /<\s*\/?\s*(script|img|iframe|object|embed|link|style|svg|math)\b/i;

const contactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, 'Name is required')
        .max(100, 'Name is too long')
        .refine(v => !INJECTION_PATTERN.test(v), 'Invalid characters in name'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
    message: z
        .string()
        .trim()
        .min(10, 'Message must be at least 10 characters')
        .max(MESSAGE_MAX, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const RATE_LIMIT_KEY = 'contact_submit_ts';
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;

function isRateLimited(): boolean {
    try {
        const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
        const timestamps: number[] = raw ? JSON.parse(raw) : [];
        const now = Date.now();
        return timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS).length >= RATE_LIMIT_MAX;
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
        /* no-op */
    }
}

export function Contact() {
    const [status, setStatus] = useState<{ type: 'ok' | 'err'; msg: string } | null>(null);
    const [copied, setCopied] = useState(false);
    const honeypotRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

    const messageValue = watch('message') ?? '';

    const onSubmit = async (data: ContactFormData) => {
        setStatus(null);

        if (honeypotRef.current?.value) {
            reset();
            return;
        }
        if (isRateLimited()) {
            setStatus({ type: 'err', msg: 'Too many messages — please wait a few minutes.' });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('email', data.email);
            formData.append('message', data.message);

            const res = await fetch(FORMSPREE_URL, {
                method: 'POST',
                body: formData,
                headers: { Accept: 'application/json' },
            });

            if (res.ok) {
                setStatus({ type: 'ok', msg: "Message sent — I'll get back to you soon." });
                reset();
                recordSubmission();
            } else {
                setStatus({
                    type: 'err',
                    msg: 'Something went wrong — try emailing me directly.',
                });
            }
        } catch {
            setStatus({ type: 'err', msg: 'Something went wrong — try emailing me directly.' });
        }
    };

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(PROFILE.email);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
        } catch {
            /* clipboard unavailable */
        }
    };

    return (
        <section className="ed-section ed-container" id="contact">
            <div className="ed-section-head">
                <span className="ed-section-num">05</span>
                <h2 className="ed-section-title">Contact</h2>
                <span className="ed-section-meta">Usually replies in a day</span>
            </div>

            <div className="ed-contact-grid">
                <div>
                    <p className="ed-contact-lead">
                        Let&apos;s work <span className="accent">together.</span>
                    </p>
                    <a className="ed-contact-email" href={`mailto:${PROFILE.email}`}>
                        {PROFILE.email}
                    </a>
                    <button type="button" className="ed-copy-btn" onClick={copyEmail}>
                        {copied ? 'Copied' : 'Copy'}
                    </button>

                    <nav className="ed-contact-socials" aria-label="Social links">
                        {SOCIAL_LINKS.map(link => (
                            <a
                                key={link.label}
                                className="ed-social-link"
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <span className="label">{link.label}</span>
                                <span className="handle">{link.handle} ↗</span>
                            </a>
                        ))}
                    </nav>
                </div>

                <form className="ed-form" onSubmit={handleSubmit(onSubmit)} noValidate>
                    <input
                        ref={honeypotRef}
                        type="text"
                        name="website_url"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        className="ed-honeypot"
                    />

                    <div className={`ed-field${errors.name ? ' has-error' : ''}`}>
                        <label htmlFor="ed-name">Name</label>
                        <input
                            id="ed-name"
                            className="ed-input"
                            type="text"
                            placeholder="Your name"
                            autoComplete="name"
                            disabled={isSubmitting}
                            aria-invalid={errors.name ? 'true' : 'false'}
                            {...register('name')}
                        />
                        {errors.name && (
                            <span className="ed-error" aria-live="polite">
                                {errors.name.message}
                            </span>
                        )}
                    </div>

                    <div className={`ed-field${errors.email ? ' has-error' : ''}`}>
                        <label htmlFor="ed-email">Email</label>
                        <input
                            id="ed-email"
                            className="ed-input"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isSubmitting}
                            aria-invalid={errors.email ? 'true' : 'false'}
                            {...register('email')}
                        />
                        {errors.email && (
                            <span className="ed-error" aria-live="polite">
                                {errors.email.message}
                            </span>
                        )}
                    </div>

                    <div className={`ed-field${errors.message ? ' has-error' : ''}`}>
                        <div className="ed-field-top">
                            <label htmlFor="ed-message">Message</label>
                            <span className="ed-counter" aria-live="polite">
                                {messageValue.length} / {MESSAGE_MAX}
                            </span>
                        </div>
                        <textarea
                            id="ed-message"
                            className="ed-textarea"
                            rows={5}
                            maxLength={MESSAGE_MAX}
                            placeholder="Role, timeline, and what you'd like me to look at."
                            disabled={isSubmitting}
                            aria-invalid={errors.message ? 'true' : 'false'}
                            {...register('message')}
                        />
                        {errors.message && (
                            <span className="ed-error" aria-live="polite">
                                {errors.message.message}
                            </span>
                        )}
                    </div>

                    {status && (
                        <div className={`ed-form-status ${status.type}`} role="status">
                            <span>{status.msg}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="ed-btn ed-btn-primary"
                        disabled={isSubmitting}
                        aria-busy={isSubmitting ? 'true' : 'false'}
                    >
                        {isSubmitting ? 'Sending…' : 'Send message'}
                        {!isSubmitting && <span className="ed-btn-arrow">↗</span>}
                    </button>
                </form>
            </div>
        </section>
    );
}
