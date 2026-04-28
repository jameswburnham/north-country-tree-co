'use client';

import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useState, type FormEvent } from 'react';

const PHONE_DISPLAY = '(518) 555-0142';
const PHONE_HREF = 'tel:+15185550142';

// TODO: replace with real Formspree endpoint
const FORM_ENDPOINT = 'https://formspree.io/f/PLACEHOLDER';

type Status = 'idle' | 'submitting' | 'success' | 'error';

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'submitting') return;

    setStatus('submitting');
    setErrorMessage(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        const json = (await res.json().catch(() => null)) as
          | { error?: string; errors?: Array<{ message: string }> }
          | null;
        const message =
          json?.errors?.map((x) => x.message).join(' ') ||
          json?.error ||
          'Something went wrong. Please try again or call us.';
        setErrorMessage(message);
        setStatus('error');
      }
    } catch {
      setErrorMessage('Connection error. Please try again or call us.');
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-10 text-center md:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-forest">
            Contact
          </p>
          <h2 className="font-serif text-4xl text-charcoal md:text-5xl">
            Get a Free Quote
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-charcoal/75 md:text-lg">
            We respond to every request within 24 hours. Emergency?{' '}
            <a
              href={PHONE_HREF}
              className="font-semibold text-forest underline-offset-2 hover:underline"
            >
              Call us directly at {PHONE_DISPLAY}
            </a>
            .
          </p>
        </div>

        <div className="rounded-xl border border-charcoal/10 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)] md:p-10">
          {status === 'success' ? (
            <SuccessState />
          ) : (
            <form onSubmit={handleSubmit} aria-busy={status === 'submitting'}>
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                />
                <Field
                  label="Phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                />
              </div>
              <Field
                label="Service Address"
                name="address"
                type="text"
                autoComplete="street-address"
                required
                className="mt-5"
              />
              <Field
                label="What do you need?"
                name="message"
                as="textarea"
                rows={5}
                required
                className="mt-5"
              />

              <label className="mt-5 flex cursor-pointer items-start gap-3 text-sm text-charcoal/85">
                <input
                  type="checkbox"
                  name="emergency"
                  value="yes"
                  className="mt-0.5 h-4 w-4 cursor-pointer accent-forest"
                />
                <span>This is an emergency</span>
              </label>

              {status === 'error' && (
                <div
                  role="alert"
                  className="mt-5 flex items-start gap-2 rounded-md border border-emergency/30 bg-emergency/5 p-3 text-sm text-emergency"
                >
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="inline-flex items-center justify-center rounded-md bg-forest px-6 py-3 text-base font-semibold text-cream transition-colors hover:bg-forest-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-70 sm:px-8"
                >
                  {status === 'submitting' ? 'Sending…' : 'Request Free Quote'}
                </button>
                <p className="text-xs text-charcoal/55">
                  We never share your information.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  name: string;
  type?: string;
  as?: 'textarea';
  rows?: number;
  required?: boolean;
  autoComplete?: string;
  className?: string;
};

function Field({
  label,
  name,
  type = 'text',
  as,
  rows,
  required = false,
  autoComplete,
  className = '',
}: FieldProps) {
  const baseInputClass =
    'w-full rounded-md border border-charcoal/20 bg-white px-3.5 py-2.5 text-base text-charcoal placeholder:text-charcoal/40 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/20';

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-charcoal"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-emergency">
            *
          </span>
        )}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          rows={rows}
          required={required}
          autoComplete={autoComplete}
          className={baseInputClass}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          className={baseInputClass}
        />
      )}
    </div>
  );
}

function SuccessState() {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center md:py-10">
      <CheckCircle2
        className="h-12 w-12 text-forest"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h3 className="font-serif text-2xl text-charcoal md:text-3xl">
        Thanks — we&apos;ll be in touch within 24 hours.
      </h3>
      <p className="text-sm text-charcoal/65">
        Need it faster? Call{' '}
        <a
          href={PHONE_HREF}
          className="font-semibold text-forest hover:underline"
        >
          {PHONE_DISPLAY}
        </a>
        .
      </p>
    </div>
  );
}
