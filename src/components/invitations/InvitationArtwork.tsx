"use client";

import type { ReactNode } from "react";

type InvitationArtworkProps = {
  template: "botanical" | "editorial" | "minimal";
  theme: "sage" | "sand" | "rose";
  invitationLabel: string;
  hosts: string;
  title: string;
  date: string;
  time?: string;
  locationLabel: string;
  venue?: string;
  address?: string;
  message: string;
  footerLabel?: string;
  compact?: boolean;
};

function BotanicalMark() {
  return (
    <svg className="artwork-botanical-mark" viewBox="0 0 140 100" aria-hidden="true">
      <path d="M14 91C43 72 55 47 64 9M35 71C18 65 13 52 16 40c14 2 24 11 23 26M49 52C39 36 42 22 53 12c10 11 12 24 2 37M68 29C83 13 99 13 111 22c-8 13-21 19-39 12M31 78C18 79 9 88 7 98M65 9c6 11 13 16 25 18" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M17 40c12 3 19 12 22 26M53 12c7 11 8 24 2 37M111 22c-8 13-21 19-39 12" fill="none" stroke="currentColor" strokeWidth=".65" opacity=".65"/>
      <circle cx="64" cy="9" r="2" fill="currentColor"/>
    </svg>
  );
}

function EditorialMark() {
  return <div className="artwork-editorial-monogram" aria-hidden="true"><span>A</span><i>✦</i></div>;
}

function MinimalMark() {
  return <div className="artwork-minimal-mark" aria-hidden="true"><span>✳</span><i>✧</i><span>✳</span></div>;
}

export default function InvitationArtwork({
  template, theme, invitationLabel, hosts, title, date, time, locationLabel,
  venue, address, message, footerLabel = "ASTRON · DIGITAL INVITATIONS", compact = false,
}: InvitationArtworkProps) {
  const mark: Record<InvitationArtworkProps["template"], ReactNode> = {
    botanical: <BotanicalMark />,
    editorial: <EditorialMark />,
    minimal: <MinimalMark />,
  };

  return (
    <article className={`invitation-preview public-invitation invitation-artwork invitation-artwork--${template} preview-${theme} invitation-${template} ${compact ? "invitation-artwork--compact" : ""}`} data-template={template}>
      <div className="artwork-frame" aria-hidden="true" />
      <div className="artwork-topline"><span>№ 001</span><span>EST. WITH LOVE</span></div>
      <div className="artwork-mark">{mark[template]}</div>
      <span className="preview-kicker">{invitationLabel}</span>
      <h1>{hosts || title}</h1>
      <span className="artwork-divider" aria-hidden="true"><i />✦<i /></span>
      <p className="preview-title">{title}</p>
      <div className="artwork-date-block">
        <span className="artwork-date-caption">{template === "editorial" ? "SAVE THE DATE" : "THE CELEBRATION"}</span>
        <strong>{date}</strong>
        {time && <span className="artwork-time">{time}</span>}
      </div>
      {(venue || address) && (
        <div className="preview-location">
          <b>{locationLabel}</b>
          {venue && <span>{venue}</span>}
          {address && <small>{address}</small>}
        </div>
      )}
      <p className="preview-message">{message}</p>
      <div className="artwork-bottomline"><span>WITH JOY</span><span>♥</span><span>{footerLabel}</span></div>
    </article>
  );
}
