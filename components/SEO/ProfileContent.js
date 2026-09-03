import React from 'react';
import PROFILE from '../../content/profile';

/**
 * The profile as a linear document. This element has two jobs:
 *
 *   < md  : it IS the site. The tiling window manager is unusable at phone
 *           widths, so mobile visitors get this terminal-styled page instead.
 *   >= md : it collapses to `sr-only` and the desktop UI takes over. The text
 *           stays in the DOM for crawlers and screen readers, since the desktop
 *           renders all of its real content inside windows that only mount on
 *           click.
 *
 * One copy either way -- never duplicated, never `display:none`.
 */

const ACCENT = '#1793D1';

function Section({ path, children }) {
    return (
        <section className="mt-10">
            <h2 className="flex items-center text-xs mb-4" style={{ color: ACCENT }}>
                <span aria-hidden="true" className="mr-2" style={{ width: '3px', height: '14px', background: ACCENT, display: 'inline-block' }} />
                ~/{path}
            </h2>
            {children}
        </section>
    );
}

function Entry({ title, org, meta, points }) {
    return (
        <article className="mb-6">
            <h3 className="text-sm leading-snug" style={{ color: '#e0e0e0' }}>{title}</h3>
            {org && <p className="text-xs mt-0.5" style={{ color: ACCENT }}>{org}</p>}
            {meta && <p className="text-xs mt-0.5" style={{ color: '#555' }}>{meta}</p>}
            {points && (
                <ul className="mt-2">
                    {points.map((p, i) => (
                        <li key={i} className="text-xs leading-relaxed flex" style={{ color: '#999' }}>
                            <span aria-hidden="true" className="mr-2" style={{ color: '#444' }}>·</span>
                            <span>{p}</span>
                        </li>
                    ))}
                </ul>
            )}
        </article>
    );
}

export default function ProfileContent() {
    const p = PROFILE;

    return (
        <main
            className="md:sr-only w-full min-h-screen font-mono px-5 py-10"
            style={{ backgroundColor: '#0c0c0c', color: '#c5c8c6' }}
            aria-label={`About ${p.name}`}
        >
            <div className="max-w-xl mx-auto">
                <p className="text-xs" style={{ color: '#555' }}>
                    <span style={{ color: '#4E9A06' }}>avery@archlinux</span>
                    <span style={{ color: '#555' }}>:~$</span> whoami
                </p>

                <h1 className="text-2xl font-bold mt-4" style={{ color: '#e0e0e0' }}>{p.name}</h1>
                <p className="text-sm mt-1" style={{ color: ACCENT }}>{p.headline}</p>
                <p className="text-xs mt-1" style={{ color: '#555' }}>{p.location}</p>

                <div className="my-5" style={{ height: '1px', background: 'rgba(255,255,255,0.06)' }} />

                {p.intro.map((t, i) => (
                    <p key={i} className="text-xs leading-relaxed mb-3" style={{ color: '#999' }}>{t}</p>
                ))}

                <div className="flex flex-wrap gap-2 mt-5">
                    <a
                        href={p.resume}
                        className="text-xs px-3 py-2 rounded no-underline"
                        style={{ color: '#0c0c0c', backgroundColor: ACCENT, fontWeight: 500 }}
                    >
                        Resume (PDF)
                    </a>
                    {p.links.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            rel="me noopener noreferrer"
                            className="text-xs px-3 py-2 rounded no-underline"
                            style={{ color: ACCENT, border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            {l.label}
                        </a>
                    ))}
                </div>

                <Section path="education">
                    <Entry
                        title={p.education.school}
                        org={p.education.degree}
                        meta={p.education.detail}
                        points={[p.education.notes]}
                    />
                </Section>

                <Section path="experience">
                    {p.experience.map((e) => (
                        <Entry key={e.role + e.org} title={e.role} org={e.org} meta={e.meta} points={e.points} />
                    ))}
                </Section>

                <Section path="projects">
                    {p.projects.map((pr) => (
                        <Entry key={pr.name} title={pr.name} org={pr.tech} points={[pr.body]} />
                    ))}
                </Section>

                <Section path="competitions">
                    {p.competitions.map((c) => (
                        <Entry key={c.name} title={c.name} points={[c.detail]} />
                    ))}
                </Section>

                <Section path="skills">
                    <ul>
                        {p.skills.map((s) => (
                            <li key={s.group} className="mb-3">
                                <span className="text-xs" style={{ color: '#e0e0e0' }}>{s.group}</span>
                                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#999' }}>{s.items}</p>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section path="honors">
                    <ul>
                        {p.honors.map((h) => (
                            <li key={h} className="text-xs leading-relaxed flex" style={{ color: '#999' }}>
                                <span aria-hidden="true" className="mr-2" style={{ color: '#444' }}>·</span>
                                <span>{h}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                <Section path="contact">
                    <a href={`mailto:${p.email}`} className="text-xs no-underline" style={{ color: ACCENT }}>
                        {p.email}
                    </a>
                    <p className="text-xs mt-6" style={{ color: '#333' }}>
                        This site is an interactive Arch Linux desktop on wider screens.
                    </p>
                </Section>
            </div>
        </main>
    );
}
