import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotifications } from '../../context/NotificationContext';

const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message is too long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactApp() {
    const { showToast } = useNotifications();
    const [statusMsg, setStatusMsg] = useState('');
    const [statusType, setStatusType] = useState<'success' | 'error' | ''>('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        setStatusMsg('');
        setStatusType('');

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
                showToast('Message sent successfully!', 'fas fa-check-circle');
            } else {
                throw new Error('Form submission failed');
            }
        } catch {
            setStatusMsg('Oops! Something went wrong. Try emailing me directly.');
            setStatusType('error');
        }
    };

    return (
        <>
            <h2>Get in Touch</h2>
            <div className="contact-items">
                <div className="contact-item">
                    <i className="fas fa-envelope" aria-hidden="true" />
                    <div>
                        <strong>Email</strong>
                        <a href="mailto:minwn2244@gmail.com">minwn2244@gmail.com</a>
                    </div>
                </div>
                <div className="contact-item">
                    <i className="fas fa-map-marker-alt" aria-hidden="true" />
                    <div>
                        <strong>Location</strong>
                        <span>Singapore</span>
                    </div>
                </div>
                <div className="contact-item">
                    <i className="fas fa-circle status-available" aria-hidden="true" />
                    <div>
                        <strong>Status</strong>
                        <span>Available for opportunities</span>
                    </div>
                </div>
            </div>

            <form
                className="contact-form"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
            >
                <p className="contact-form-intro">Send me a message and I&apos;ll get back to you.</p>
                <div className="form-group">
                    <label htmlFor="contact-name">Name</label>
                    <input
                        type="text"
                        id="contact-name"
                        placeholder="Your name"
                        autoComplete="name"
                        {...register('name')}
                    />
                    {errors.name && <span className="form-error">{errors.name.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="contact-email">Email</label>
                    <input
                        type="email"
                        id="contact-email"
                        placeholder="Your email"
                        autoComplete="email"
                        {...register('email')}
                    />
                    {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                        id="contact-message"
                        placeholder="Your message"
                        rows={5}
                        {...register('message')}
                    />
                    {errors.message && <span className="form-error">{errors.message.message}</span>}
                </div>
                <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <><i className="fas fa-spinner fa-spin" aria-hidden="true" /> Sending...</>
                    ) : (
                        <><i className="fas fa-paper-plane" aria-hidden="true" /> Send Message</>
                    )}
                </button>
                {statusMsg && (
                    <div className={`form-status ${statusType}`} aria-live="polite">
                        {statusMsg}
                    </div>
                )}
            </form>

            <div className="resume-section">
                <h3><i className="fas fa-file-alt" aria-hidden="true" /> Resume</h3>
                <a href="resume/SYH_resume.pdf" download className="resume-download-btn">
                    <i className="fas fa-download" aria-hidden="true" /> Download Resume
                </a>
            </div>
        </>
    );
}
