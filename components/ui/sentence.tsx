"use client";

import { useEffect, useId, useRef, useState, type Ref } from "react";

// The "sentence is the form" pieces shared by /contact and /careers: a message
// set in large type with gaps to fill. <Fill> is a text input that grows with
// what's typed; <Choose> is a gap that opens a short list of options (a
// listbox: arrow keys, Enter, Escape; a bottom sheet on phones). Styles live in
// components/ui/sentence.css.

type Opt = { label: string; v: string };

// Empty gaps are tinted boxes with an icon (a pencil to type, a caret to pick)
// so they read as fields, and the form passes `cue` to the next one to fill,
// which pulses gently until it's done.

/** A text gap. The hidden twin (data-v) sizes the field to its text. */
export function Fill({
  label,
  value,
  onChange,
  placeholder,
  invalid,
  cue,
  ref,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  invalid?: boolean;
  cue?: boolean;
  ref?: Ref<HTMLInputElement>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "placeholder">) {
  return (
    <span className="sn-fill" data-filled={value ? "" : undefined} data-cue={cue || undefined}>
      <span className="sn-fill-in" data-v={value || placeholder}>
        <input
        ref={ref}
        aria-label={label}
        aria-invalid={invalid || undefined}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
          size={1}
          {...rest}
        />
      </span>
      <svg className="sn-icon" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M10.6 2.6a1.6 1.6 0 0 1 2.3 2.3L5.6 12.2 2.5 13l.8-3.1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** A gap that opens a list. Shows the chosen option's `v` in the sentence. */
export function Choose({
  label,
  placeholder,
  options,
  value,
  onChange,
  invalid,
  cue,
  ref,
}: {
  label: string;
  placeholder: string;
  options: Opt[];
  value: string;
  onChange: (v: string) => void;
  invalid?: boolean;
  cue?: boolean;
  ref?: Ref<HTMLButtonElement>;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const id = useId();
  const box = useRef<HTMLSpanElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const btn = useRef<HTMLButtonElement | null>(null);
  const chosen = options.find((o) => o.v === value);

  const show = () => {
    setActive(Math.max(0, options.findIndex((o) => o.v === value)));
    setOpen(true);
  };
  const close = (focus = true) => {
    setOpen(false);
    if (focus) btn.current?.focus();
  };
  const pick = (i: number) => {
    const o = options[i];
    onChange(o.v === value ? "" : o.v);
    close();
  };

  useEffect(() => {
    if (!open) return;
    list.current?.focus();
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [open]);

  const onListKey = (e: React.KeyboardEvent) => {
    const n = options.length;
    if (e.key === "ArrowDown") setActive((a) => (a + 1) % n);
    else if (e.key === "ArrowUp") setActive((a) => (a - 1 + n) % n);
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(n - 1);
    else if (e.key === "Enter" || e.key === " ") pick(active);
    else if (e.key === "Escape") close();
    else if (e.key === "Tab") return close(false);
    else return;
    e.preventDefault();
  };

  return (
    <span ref={box} className="sn-choose" data-open={open || undefined}>
      <button
        ref={(el) => {
          btn.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
        type="button"
        className="sn-gap"
        data-filled={chosen ? "" : undefined}
        data-cue={cue || undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-invalid={invalid || undefined}
        aria-label={`${label}: ${chosen ? chosen.label : "not chosen"}`}
        onClick={() => (open ? close(false) : show())}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            show();
          }
        }}
      >
        <span className="sn-gap-t">{chosen ? chosen.v : placeholder}</span>
        <svg className="sn-caret" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <span className="sn-scrim" aria-hidden="true" onClick={() => close(false)} />
          <ul
            ref={list}
            id={`${id}-list`}
            className="sn-pop"
            role="listbox"
            aria-label={label}
            tabIndex={-1}
            aria-activedescendant={`${id}-${active}`}
            onKeyDown={onListKey}
          >
            <li className="sn-pop-h" aria-hidden="true">
              {label}
            </li>
            {options.map((o, i) => (
              <li
                key={o.label}
                id={`${id}-${i}`}
                role="option"
                aria-selected={o.v === value}
                data-active={i === active || undefined}
                onPointerEnter={() => setActive(i)}
                onClick={() => pick(i)}
              >
                {o.label}
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 8.5 6.5 12 13 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </li>
            ))}
          </ul>
        </>
      )}
    </span>
  );
}

/** The "Received" rubber stamp shown on a sent sheet. */
export function Stamp({ top, bottom }: { top: string; bottom: string }) {
  return (
    <span className="sn-stamp" aria-hidden="true">
      <span className="sn-stamp-t">{top}</span>
      <b>Received</b>
      <span className="sn-stamp-t">{bottom}</span>
    </span>
  );
}
