"use client";

import type { ReactNode } from "react";

type InvitationArtworkProps = {
  template: "botanical" | "editorial" | "minimal";
  theme: "sage" | "rose" | "sand";
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
  dateCaption?: string;
  compact?: boolean;
};

function BotanicalOrnament() {
  return (
    <svg className="artwork-botanical-ornament" viewBox="0 0 260 180" fill="none" aria-hidden="true">
      <path d="M5 175C52 145 82 100 111 10M27 155C5 130 8 105 28 86C52 105 58 131 39 148M58 116C36 92 42 65 68 48C87 75 85 99 65 117M91 65C85 35 103 15 132 9C144 38 129 59 99 70M108 26C134 38 154 31 171 7C191 28 181 53 151 63M149 61C176 68 199 55 210 29C236 47 233 75 205 91M178 82C203 99 229 95 250 73C264 101 249 126 218 132" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round"/>
      <path d="M28 86C45 105 49 126 39 148M68 48C82 72 81 95 65 117M132 9C144 38 129 59 99 70M171 7C191 28 181 53 151 63M210 29C236 47 233 75 205 91M250 73C264 101 249 126 218 132" stroke="currentColor" strokeWidth=".7" opacity=".55"/>
      <circle cx="111" cy="10" r="2.5" fill="currentColor"/><circle cx="250" cy="73" r="2" fill="currentColor"/>
    </svg>
  );
}

function EditorialOrnament() {
  return (
    <div className="artwork-editorial-seal" aria-hidden="true">
      <span className="artwork-seal-ring" />
      <span className="artwork-seal-letter">A<span>&</span>M</span>
      <i>✳</i>
    </div>
  );
}

function MinimalOrnament() {
  return (
    <div className="artwork-minimal-arch" aria-hidden="true">
      <span className="artwork-arch-inner" />
      <i>✳</i>
    </div>
  );
}

function BotanicalLayout({ hosts, title, date, time, locationLabel, venue, address, message, invitationLabel, dateCaption, footerLabel }: Omit<InvitationArtworkProps, "template" | "theme" | "compact">) {
  return (
    <>
      <div className="artwork-botanical-top"><span>✦</span><span>AN INVITATION TO CELEBRATE</span><span>✦</span></div>
      <div className="artwork-botanical-flora"><BotanicalOrnament /></div>
      <span className="preview-kicker">{invitationLabel}</span>
      <h1>{hosts || title}</h1>
      <div className="artwork-botanical-separator"><span />❧<span /></div>
      <p className="preview-title">{title}</p>
      <div className="artwork-botanical-date">
        <span>{dateCaption}</span><strong>{date}</strong>{time && <small>{time}</small>}
      </div>
      {(venue || address) && <div className="preview-location"><b>{locationLabel}</b>{venue && <span>{venue}</span>}{address && <small>{address}</small>}</div>}
      <p className="preview-message">{message}</p>
      <div className="artwork-bottomline"><span>WITH LOVE</span><span>✦</span><span>{footerLabel}</span></div>
    </>
  );
}

function EditorialLayout({ hosts, title, date, time, locationLabel, venue, address, message, invitationLabel, dateCaption, footerLabel }: Omit<InvitationArtworkProps, "template" | "theme" | "compact">) {
  return (
    <>
      <div className="artwork-editorial-top"><span>THE CELEBRATION</span><span>EST. IN LOVE · 2027</span></div>
      <div className="artwork-editorial-hero">
        <div className="artwork-editorial-copy">
          <span className="preview-kicker">{invitationLabel}</span>
          <h1>{hosts || title}</h1>
          <p className="preview-title">{title}</p>
        </div>
        <EditorialOrnament />
      </div>
      <div className="artwork-editorial-date">
        <span>{dateCaption}</span><strong>{date}</strong>{time && <small>{time}</small>}
      </div>
      {(venue || address) && <div className="preview-location"><b>{locationLabel}</b>{venue && <span>{venue}</span>}{address && <small>{address}</small>}</div>}
      <p className="preview-message">{message}</p>
      <div className="artwork-editorial-footer"><span>YOU ARE CORDIALLY INVITED</span><b>{footerLabel}</b></div>
    </>
  );
}

function MinimalLayout({ hosts, title, date, time, locationLabel, venue, address, message, invitationLabel, dateCaption, footerLabel }: Omit<InvitationArtworkProps, "template" | "theme" | "compact">) {
  return (
    <>
      <div className="artwork-minimal-top"><span>№ 01</span><span>THE DAY WE CELEBRATE</span></div>
      <MinimalOrnament />
      <span className="preview-kicker">{invitationLabel}</span>
      <h1>{hosts || title}</h1>
      <p className="preview-title">{title}</p>
      <div className="artwork-minimal-date">
        <span>{dateCaption}</span><strong>{date}</strong>{time && <small>{time}</small>}
      </div>
      {(venue || address) && <div className="preview-location"><b>{locationLabel}</b>{venue && <span>{venue}</span>}{address && <small>{address}</small>}</div>}
      <p className="preview-message">{message}</p>
      <div className="artwork-minimal-footer"><span>MADE FOR YOUR MOMENT</span><span>{footerLabel}</span></div>
    </>
  );
}

export default function InvitationArtwork(props: InvitationArtworkProps) {
  const {
    template, theme, invitationLabel, hosts, title, date, time, locationLabel,
    venue, address, message, footerLabel = "ASTRON · DIGITAL INVITATIONS",
    dateCaption = "SAVE THE DATE", compact = false,
  } = props;

  const shared = { hosts, title, date, time, locationLabel, venue, address, message, invitationLabel, dateCaption, footerLabel };
  const layouts: Record<InvitationArtworkProps["template"], ReactNode> = {
    botanical: <BotanicalLayout {...shared} />,
    editorial: <EditorialLayout {...shared} />,
    minimal: <MinimalLayout {...shared} />,
  };

  return (
    <article className={`invitation-preview public-invitation invitation-artwork invitation-artwork--${template} preview-${theme} invitation-${template} ${compact ? "invitation-artwork--compact" : ""}`} data-template={template}>
      <div className="artwork-frame" aria-hidden="true" />
      {layouts[template]}
    </article>
  );
}
