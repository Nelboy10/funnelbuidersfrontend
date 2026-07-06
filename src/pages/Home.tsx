// ============================================================
// Funnel Builders — Home Page (Premium Sales-Oriented)
// 10 Sections: Hero · Stats · Audience · Courses · Mentors · 
//              Testimonials · Benefits · Guarantee · FAQ · CTA
// ============================================================

import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import Button from '../components/ui/Button';

/* ── Helpers ───────────────────────────────────────────────── */

/** Star rating SVG (filled) */
const Star = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

/** Animated counter hook */
function useCounter(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration]);

  return { count, ref };
}

/** Scroll Reveal Hook for fade-in animations on scroll */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

/* ── Data ──────────────────────────────────────────────────── */

const audiencePoints = {
  forYou: [
    "Vous voulez automatiser vos ventes en ligne",
    "Vous êtes expert, coach, ou créateur de contenu",
    "Vous cherchez des résultats concrets, pas de la théorie",
    "Vous êtes prêt à investir en vous et passer à l'action"
  ],
  notForYou: [
    "Vous cherchez une formule magique pour devenir riche",
    "Vous n'êtes pas prêt à appliquer les stratégies",
    "Vous n'avez aucun produit ou compétence à vendre",
    "Vous attendez que le succès vienne tout seul"
  ]
};

const mentors = [
  {
    name: 'Alexandre',
    role: 'Expert Acquisition & Scaling',
    desc: 'Ancien directeur marketing ayant géré plus de 5M€ de budget publicitaire. Il a aidé plus de 300 entrepreneurs à passer de 10k à 100k/mois.',
    img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    stats: '+10M€ générés pour ses clients'
  },
  {
    name: 'Sarah',
    role: 'Maître Copywriter',
    desc: "Spécialiste de la psychologie de vente. Ses pages de vente convertissent en moyenne 3x plus que la moyenne du marché. Elle vous apprendra l'art de persuader par les mots.",
    img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
    stats: '+150 pages de vente rédigées'
  }
];

const faqs = [
  {
    q: 'Ces formations sont-elles adaptées aux débutants ?',
    a: 'Absolument. Nos programmes sont structurés étape par étape. Nous partons des bases pour vous amener vers des stratégies avancées, sans vous perdre dans un jargon technique.'
  },
  {
    q: 'Combien de temps ai-je accès au contenu ?',
    a: 'L\'accès est à vie (lifetime). Une fois que vous rejoignez une formation, le contenu vous appartient pour toujours, y compris toutes les futures mises à jour.'
  },
  {
    q: 'Puis-je payer en plusieurs fois ?',
    a: 'Oui, nous proposons des facilités de paiement en 3x ou 4x sans frais sur nos programmes premium pour vous permettre d\'investir sans bloquer votre trésorerie.'
  },
  {
    q: 'Et si ça ne me plaît pas ?',
    a: 'Vous bénéficiez d\'une garantie "Satisfait ou Remboursé" de 14 jours. Si vous appliquez la méthode et que vous n\'êtes pas satisfait, on vous rembourse intégralement, sans poser de questions.'
  },
  {
    q: 'Y a-t-il un accompagnement personnalisé ?',
    a: 'Certains programmes incluent un accès à notre communauté privée et à des sessions de coaching de groupe hebdomadaires. Vous ne serez jamais seul face à vos doutes.'
  }
];

const financialResults = [
  {
    name: 'Julien T.',
    background: 'Ancien étudiant en Droit (Zéro expérience pro)',
    amount: '1 500 000 FCFA / mois',
    time: 'En 4 mois',
    desc: 'A lancé son agence de copywriting B2B en partant de zéro. A signé ses premiers clients sans même avoir de site web.',
    color: 'var(--color-success)'
  },
  {
    name: 'Sophie M.',
    background: 'Ancienne vendeuse en prêt-à-porter',
    amount: '850 000 FCFA / mois',
    time: 'En 6 mois',
    desc: 'Création et automatisation complète de funnels pour des coachs sportifs. Elle gère tout depuis son ordinateur portable.',
    color: 'var(--color-accent-primary)'
  },
  {
    name: 'Karim B.',
    background: 'Chauffeur VTC',
    amount: '450 000 FCFA / mois',
    time: 'En 3 mois',
    desc: 'A suivi la formation en conduisant. Il a appliqué la méthode pas à pas et a quitté son emploi le mois dernier.',
    color: 'var(--color-warning)'
  }
];

const testimonials = [
  {
    name: 'Aminata D.',
    role: 'Entrepreneure digitale',
    avatar: 'AD',
    text: "En 3 mois j'ai généré plus de 2 500 000 FCFA de chiffre d'affaires grâce à la formation sur les funnels de vente. C'est la meilleure décision que j'ai prise pour mon business.",
    result: '+2.5M FCFA en 3 mois',
    color: '#4645E7',
  },
  {
    name: 'Moussa K.',
    role: 'Freelance Marketing',
    avatar: 'MK',
    text: "Le copywriting a transformé mes résultats. Mes clients ont vu leurs conversions augmenter de 340%. J'ai doublé mes tarifs depuis.",
    result: '+340% de conversions',
    color: '#10b981',
  },
  {
    name: 'Fatou S.',
    role: 'Coach en développement personnel',
    avatar: 'FS',
    text: "J'avais zéro connaissance technique. Aujourd'hui j'ai un système automatisé qui me génère des ventes pendant que je dors. Incroyable.",
    result: 'Ventes automatisées',
    color: '#f59e0b',
  },
];

const courses = [
  {
    title: 'Le Système de Vente Parfait',
    desc: 'Créez des funnels de conversion qui génèrent des ventes en automatique, même si vous partez de zéro.',
    price: '49 000 FCFA',
    oldPrice: '99 000 FCFA',
    rating: 4.9,
    reviews: '1.2k',
    badge: 'Best-seller',
    badgeColor: 'var(--color-warning)',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    students: '4,200+',
  },
  {
    title: 'Maîtrise du Copywriting',
    desc: "L'art d'écrire des pages de vente qui convertissent les simples visiteurs en clients fidèles.",
    price: '29 000 FCFA',
    oldPrice: '59 000 FCFA',
    rating: 4.8,
    reviews: '850',
    badge: 'Populaire',
    badgeColor: 'var(--color-accent-primary)',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    students: '3,100+',
  },
  {
    title: 'Automatisation Avancée',
    desc: 'Gagnez 20 heures par semaine en automatisant vos process marketing avec Zapier et Make.',
    price: '19 000 FCFA',
    oldPrice: '39 000 FCFA',
    rating: 5.0,
    reviews: '420',
    badge: 'Nouveau',
    badgeColor: 'var(--color-success)',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    students: '1,800+',
  },
];

/* ── FAQ Component ─────────────────────────────────────────── */

function FAQItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div style={{ marginBottom: 'var(--space-4)', background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', transition: 'all 0.3s ease', boxShadow: isOpen ? 'var(--shadow-md)' : 'var(--shadow-sm)' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-5) var(--space-6)', textAlign: 'left', background: isOpen ? 'var(--color-bg-secondary)' : 'transparent', fontWeight: 700, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}
      >
        {q}
        <span style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', color: 'var(--color-accent-primary)', display: 'flex', alignItems: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
        </span>
      </button>
      <div style={{ maxHeight: isOpen ? '200px' : '0px', opacity: isOpen ? 1 : 0, transition: 'all 0.3s ease', overflow: 'hidden' }}>
        <div style={{ padding: '0 var(--space-6) var(--space-5)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          {a}
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────── */

export default function Home() {
  const students = useCounter(15000);
  const coursesCount = useCounter(47);
  const satisfaction = useCounter(98);
  const revenue = useCounter(500000000); // 500M FCFA

  // Scroll reveals
  const srAudience = useScrollReveal();
  const srCourses = useScrollReveal();
  const srMentors = useScrollReveal();
  const srFinancial = useScrollReveal();
  const srTestimonials = useScrollReveal();
  const srBenefits = useScrollReveal();
  const srGuarantee = useScrollReveal();
  const srFaq = useScrollReveal();

  const fadeInStyles = (isVisible: boolean) => ({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out'
  });

  return (
    <div className="home-page" style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — HERO
          ═══════════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Animated grid background */}
        <div className="animated-bg-mesh" style={{ opacity: 0.7 }}></div>
        
        {/* Ambient glow orbs */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(70, 69, 231, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-30%', left: '-15%', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(118, 117, 245, 0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center', paddingTop: 'var(--space-16)', paddingBottom: 'var(--space-16)' }}>
          {/* Eyebrow badge */}
          <div className="animate-fade-in-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '8px 20px', borderRadius: '9999px', background: 'var(--color-accent-lighter)', border: '1px solid rgba(70, 69, 231, 0.12)', marginBottom: 'var(--space-8)', fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-accent-primary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-success)', boxShadow: '0 0 8px var(--color-success)', display: 'inline-block' }} />
            +200 étudiants inscrits cette semaine
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up" style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)', lineHeight: 1.03, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--color-text-primary)', maxWidth: '900px', margin: '0 auto var(--space-6)', animationDelay: '0.08s' }}>
            Lancez votre business,{' '}
            <span className="text-gradient">dominez votre marché.</span>
          </h1>

          <p className="animate-fade-in-up" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'var(--color-text-secondary)', maxWidth: '640px', margin: '0 auto var(--space-10)', lineHeight: 1.65, animationDelay: '0.16s' }}>
            Des formations concrètes, créées par des entrepreneurs qui ont déjà fait le chemin.
            Zéro théorie inutile — que des résultats.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-in-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-6)', animationDelay: '0.24s' }}>
            <Link to="/courses">
              <Button size="lg" variant="primary" className="hover-glow" style={{ padding: '0 40px', height: '64px', fontSize: 'var(--font-size-lg)', borderRadius: '9999px', fontWeight: 800, boxShadow: '0 8px 30px rgba(70, 69, 231, 0.35)' }}>
                Voir les formations
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '10px' }}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="secondary" style={{ padding: '0 32px', height: '64px', fontSize: 'var(--font-size-lg)', borderRadius: '9999px', fontWeight: 700, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', border: '1px solid var(--color-glass-border)' }}>
                Créer un compte gratuit
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-6)', flexWrap: 'wrap', animationDelay: '0.32s' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              Garantie 14 jours
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              Paiement sécurisé
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
              Accès à vie
            </span>
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════
          SECTION 2 — STATS COUNTER
          ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-bg-primary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="stats-grid">
            <div ref={students.ref}>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--color-accent-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {students.count.toLocaleString('fr-FR')}+
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', fontWeight: 600, marginTop: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Étudiants formés</div>
            </div>
            <div ref={coursesCount.ref}>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--color-accent-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {coursesCount.count}+
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', fontWeight: 600, marginTop: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Formations disponibles</div>
            </div>
            <div ref={satisfaction.ref}>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--color-accent-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {satisfaction.count}%
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', fontWeight: 600, marginTop: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Taux de satisfaction</div>
            </div>
            <div ref={revenue.ref}>
              <div style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--color-accent-primary)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {(revenue.count / 1_000_000).toFixed(0)}M FCFA
              </div>
              <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', fontWeight: 600, marginTop: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Générés par nos élèves</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 3 — AUDIENCE (Qualification)
          ═══════════════════════════════════════════════════════ */}
      <section ref={srAudience.ref} style={{ padding: 'var(--space-24) 0', background: 'var(--color-bg-secondary)', ...fadeInStyles(srAudience.isVisible) }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">À qui s'adresse ce programme ?</div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: 'var(--space-4)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Nos méthodes fonctionnent, <br/> mais pas pour tout le monde.
            </h2>
          </div>

          <div className="cards-grid-2">
            
            {/* NO */}
            <div className="glass-card" style={{ padding: 'var(--space-10)', borderRadius: 'var(--radius-2xl)', borderTop: '4px solid var(--color-error)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-6)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-error-bg)', color: 'var(--color-error)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </div>
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>Ce n'est PAS pour vous si...</h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {audiencePoints.notForYou.map((point, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* YES */}
            <div className="glass-card" style={{ padding: 'var(--space-10)', borderRadius: 'var(--radius-2xl)', borderTop: '4px solid var(--color-success)', boxShadow: '0 15px 40px rgba(16, 185, 129, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--space-6)' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-success-bg)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>C'est FAIT pour vous si...</h3>
              </div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {audiencePoints.forYou.map((point, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'var(--color-text-primary)', fontWeight: 500, lineHeight: 1.6 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 4 — FEATURED COURSES (The Engine)
          ═══════════════════════════════════════════════════════ */}
      <section ref={srCourses.ref} style={{ padding: 'var(--space-24) 0', position: 'relative', ...fadeInStyles(srCourses.isVisible) }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Nos formations vedettes</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: 'var(--space-4)', letterSpacing: '-0.02em' }}>
              Des programmes qui ont prouvé<br />leur efficacité
            </h2>
          </div>

          <div className="cards-grid">
            {courses.map((course, i) => (
              <div key={i} className="course-card">
                {/* Image */}
                <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10' }}>
                  <img src={course.img} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', top: '16px', left: '16px', background: course.badgeColor, color: 'white', padding: '5px 14px', borderRadius: 'var(--radius-full)', fontWeight: 800, fontSize: '12px', letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>{course.badge}</div>
                </div>

                {/* Content */}
                <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', color: 'var(--color-warning)' }}>
                      {[...Array(5)].map((_, j) => <Star key={j} />)}
                    </div>
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-text-primary)' }}>{course.rating}</span>
                  </div>
                  <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: 'var(--space-2)', lineHeight: 1.3 }}>{course.title}</h3>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, flex: 1, marginBottom: 'var(--space-6)' }}>{course.desc}</p>
                  
                  {/* Price & CTA */}
                  <div className="price-row">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                      <span style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, color: 'var(--color-text-primary)' }}>{course.price}</span>
                      <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)', textDecoration: 'line-through' }}>{course.oldPrice}</span>
                    </div>
                    <Link to="/courses">
                      <Button variant="primary" style={{ borderRadius: 'var(--radius-full)', padding: '0 var(--space-6)', height: '44px', fontWeight: 700 }}>
                        Rejoindre
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5 — MENTORS (Authority)
          ═══════════════════════════════════════════════════════ */}
      <section ref={srMentors.ref} style={{ padding: 'var(--space-24) 0', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', ...fadeInStyles(srMentors.isVisible) }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">L'équipe pédagogique</div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: 'var(--space-4)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Ne prenez pas de conseils <br/> de ceux qui n'ont rien fait.
            </h2>
            <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Vos formateurs pratiquent tous les jours ce qu'ils vous enseignent. 
              Ils ont investi des centaines de milliers d'euros en tests pour vous livrer ce qui marche VRAIMENT.
            </p>
          </div>

          <div className="cards-grid-2">
            {mentors.map((mentor, idx) => (
              <div key={idx} className="glass-card mentor-card">
                <img src={mentor.img} alt={mentor.name} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '3px solid white', boxShadow: 'var(--shadow-md)', flexShrink: 0 }} />
                <div>
                  <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, marginBottom: '4px' }}>{mentor.name}</h3>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-accent-primary)', fontWeight: 700, marginBottom: 'var(--space-3)' }}>{mentor.role}</div>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>{mentor.desc}</p>
                  <div style={{ display: 'inline-flex', padding: '4px 12px', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    💡 {mentor.stats}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 5.5 — FINANCIAL RESULTS (Zero to Hero)
          ═══════════════════════════════════════════════════════ */}
      <section ref={srFinancial.ref} style={{ padding: 'var(--space-24) 0', position: 'relative', ...fadeInStyles(srFinancial.isVisible) }}>
        <div className="container">
          <div className="section-header" style={{ maxWidth: '800px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', background: 'var(--color-success-bg)', color: 'var(--color-success)', fontWeight: 800, fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              Des résultats concrets, sans diplôme
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: 'var(--space-4)', letterSpacing: '-0.02em' }}>
              Ils sont partis de zéro. <br/> Voici ce qu'ils génèrent aujourd'hui.
            </h2>
            <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Aucune compétence technique requise. Si vous savez utiliser un clavier et que vous êtes prêt à appliquer nos méthodes à la lettre, l'argent suivra.
            </p>
          </div>

          <div className="cards-grid">
            {financialResults.map((res, i) => (
              <div key={i} className="glass-card financial-card" style={{ borderTop: `4px solid ${res.color}` }}>
                {/* Background watermark */}
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke={res.color} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05, pointerEvents: 'none' }}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                
                <div style={{ marginBottom: 'var(--space-6)' }}>
                  <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 900, color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>{res.amount}</div>
                  <div style={{ display: 'inline-flex', padding: '4px 10px', background: 'var(--color-bg-secondary)', borderRadius: '6px', fontSize: '13px', fontWeight: 700, color: 'var(--color-text-tertiary)', marginTop: '8px' }}>
                    ⏳ Atteint {res.time}
                  </div>
                </div>

                <div style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)', color: 'var(--color-text-primary)' }}>{res.name}</div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{res.background}</div>
                </div>

                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: 'var(--font-size-md)', margin: 0 }}>
                  "{res.desc}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 6 — TESTIMONIALS (Social Proof)
          ═══════════════════════════════════════════════════════ */}
      <section ref={srTestimonials.ref} style={{ padding: 'var(--space-24) 0', position: 'relative', overflow: 'hidden', ...fadeInStyles(srTestimonials.isVisible) }}>
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">Témoignages</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, marginBottom: 'var(--space-4)', letterSpacing: '-0.02em' }}>
              Ils ont transformé leur vie
            </h2>
          </div>

          <div className="cards-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ color: 'var(--color-accent-lighter)', marginBottom: 'var(--space-4)' }}>
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor" />
                </svg>
                <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', lineHeight: 1.7, flex: 1, marginBottom: 'var(--space-6)' }}>"{t.text}"</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: 'var(--radius-full)', background: `${t.color}10`, color: t.color, fontWeight: 800, fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-6)', alignSelf: 'flex-start' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                  {t.result}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 'var(--font-size-sm)', flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-size-md)', color: 'var(--color-text-primary)' }}>{t.name}</div>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 7 — BENEFITS (Pourquoi Nous Choisir)
          ═══════════════════════════════════════════════════════ */}
      <section ref={srBenefits.ref} style={{ padding: 'var(--space-24) 0', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', ...fadeInStyles(srBenefits.isVisible) }}>
        <div className="container">
          <div className="benefits-grid">
            <div>
              <div style={{ color: 'var(--color-accent-primary)', fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 'var(--space-3)', fontSize: 'var(--font-size-sm)' }}>Pourquoi nous choisir</div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: 'var(--space-6)', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Pas une simple plateforme de cours en ligne.
              </h2>
              <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-10)' }}>
                Nous vendons une transformation. Chaque formation est un système complet pour atteindre un objectif précis.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                {[
                  { icon: '🎯', title: 'Orienté résultats', desc: 'Chaque module a un objectif clair. Pas de blabla, que du concret.' },
                  { icon: '🔄', title: 'Mises à jour à vie', desc: 'Les stratégies évoluent, nos formations aussi. Sans frais supplémentaires.' },
                  { icon: '👥', title: 'Communauté privée', desc: 'Accès à un groupe exclusif d\'entraide entre étudiants et mentors.' },
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: 'var(--radius-xl)', background: 'var(--color-accent-lighter)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0, border: '1px solid rgba(70, 69, 231, 0.08)' }}>{b.icon}</div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 'var(--font-size-md)', marginBottom: '4px', color: 'var(--color-text-primary)' }}>{b.title}</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'var(--gradient-glow)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', width: '100%', maxWidth: '480px' }}>
                <div style={{ background: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-xl)', position: 'relative', zIndex: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-xl)', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 'var(--font-size-lg)' }}>Votre progression</div>
                      <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-tertiary)' }}>Mise à jour en temps réel</div>
                    </div>
                  </div>
                  {[
                    { label: 'Module 1 — Fondations', pct: 100 },
                    { label: 'Module 2 — Stratégie', pct: 100 },
                    { label: 'Module 3 — Exécution', pct: 65 },
                  ].map((m, i) => (
                    <div key={i} style={{ marginBottom: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 600, color: m.pct === 100 ? 'var(--color-success)' : 'var(--color-text-primary)' }}>{m.label}</span>
                        <span style={{ fontWeight: 700, color: m.pct === 100 ? 'var(--color-success)' : 'var(--color-text-tertiary)' }}>{m.pct}%</span>
                      </div>
                      <div style={{ height: '6px', borderRadius: '9999px', background: 'var(--color-bg-tertiary)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${m.pct}%`, borderRadius: '9999px', background: m.pct === 100 ? 'var(--color-success)' : 'var(--gradient-primary)', transition: 'width 1s ease' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 8 — GUARANTEE (Réassurance forte)
          ═══════════════════════════════════════════════════════ */}
      <section ref={srGuarantee.ref} style={{ padding: 'var(--space-20) 0', ...fadeInStyles(srGuarantee.isVisible) }}>
        <div className="container">
          <div className="guarantee-card">
            <div style={{ width: '100px', height: '100px', flexShrink: 0, background: 'var(--color-warning)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 30px rgba(245, 158, 11, 0.4)', border: '4px solid #fff' }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
            </div>
            <div>
              <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 900, marginBottom: 'var(--space-3)', color: 'var(--color-text-primary)' }}>Garantie 14 jours "Béton"</h3>
              <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6, fontSize: 'var(--font-size-md)', marginBottom: '0' }}>
                Testez la méthode complète pendant 14 jours. Si vous appliquez nos stratégies et que vous ne voyez aucun résultat, envoyez-nous un email et nous vous rembourserons chaque centime. <strong>Le risque est 100% sur nos épaules.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 9 — FAQ (Traitement des Objections)
          ═══════════════════════════════════════════════════════ */}
      <section ref={srFaq.ref} style={{ padding: 'var(--space-20) 0 var(--space-24)', ...fadeInStyles(srFaq.isVisible) }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto var(--space-12)' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 900, marginBottom: 'var(--space-4)' }}>Questions Fréquentes</h2>
            <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-text-secondary)' }}>Vous avez un doute ? On y répond en toute transparence.</p>
          </div>
          
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTION 10 — FINAL CTA
          ═══════════════════════════════════════════════════════ */}
      <section style={{ padding: '0 0 var(--space-24) 0', position: 'relative' }}>
        <div className="container">
          <div className="cta-final" style={{ background: 'var(--gradient-primary)', borderRadius: 'var(--radius-3xl)', textAlign: 'center', color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 25px 60px -12px rgba(70, 69, 231, 0.5)' }}>
            <div style={{ position: 'absolute', top: '-40%', right: '-20%', width: '60%', height: '140%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-40%', left: '-20%', width: '60%', height: '140%', background: 'radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
            
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(255,255,255,0.15)', fontSize: 'var(--font-size-sm)', fontWeight: 700, marginBottom: 'var(--space-6)', border: '1px solid rgba(255,255,255,0.2)' }}>
                🔥 Places limitées — Ne perdez plus de temps
              </div>

              <h2 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 900, marginBottom: 'var(--space-6)', color: 'white', letterSpacing: '-0.03em', lineHeight: 1.08 }}>
                Le meilleur moment<br />pour commencer, c'est maintenant.
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-5)' }}>
                <Link to="/courses">
                  <Button size="lg" style={{ background: 'white', color: 'var(--color-accent-primary)', padding: '0 48px', height: '72px', fontSize: 'var(--font-size-xl)', borderRadius: '9999px', fontWeight: 900, boxShadow: '0 10px 30px rgba(0,0,0,0.15)', transition: 'all 0.3s ease' }}>
                    Explorer les formations
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
