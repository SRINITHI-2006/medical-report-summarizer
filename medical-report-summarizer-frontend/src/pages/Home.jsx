import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaStethoscope,
  FaHospital,
  FaFileMedical,
  FaPills,
  FaFlask,
  FaFilePdf,
  FaBolt,
  FaShieldAlt,
  FaPlay,
  FaChevronRight,
  FaQuoteLeft,
  FaUserMd,
  FaUserGraduate,
  FaUser,
  FaChartLine,
} from 'react-icons/fa'
import { GiBrain } from 'react-icons/gi'
import './Home.css'

/* ---------- animation presets ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

/* ---------- static content ---------- */
const STATS = [
  { value: '1,000+', label: 'Reports Processed' },
  { value: '99%', label: 'Accuracy' },
  { value: '24/7', label: 'Available' },
  { value: 'JWT', label: 'Secure & Protected' },
]

const FEATURES = [
  { icon: <FaShieldAlt />, title: 'Secure Upload', desc: 'Reports are encrypted in transit and at rest, so sensitive health data stays private end to end.' },
  { icon: <GiBrain />, title: 'AI Summary', desc: 'Gemini AI reads dense medical language and rewrites it in plain, easy-to-understand terms.' },
  { icon: <FaPills />, title: 'Medicine Detection', desc: 'Automatically identifies prescribed medicines and flags what each one is commonly used for.' },
  { icon: <FaFlask />, title: 'Laboratory Analysis', desc: 'Lab values are extracted and compared against normal ranges, so outliers are easy to spot.' },
  { icon: <FaFilePdf />, title: 'PDF Download', desc: 'Every summary can be exported as a clean, shareable PDF for you, your doctor, or your records.' },
  { icon: <FaBolt />, title: 'Fast Processing', desc: 'Reports are parsed and summarized in seconds, not the minutes it takes to read them manually.' },
]

const STEPS = [
  { icon: <FaFileMedical />, title: 'Upload Medical Report' },
  { icon: <GiBrain />, title: 'AI Extracts Text' },
  { icon: <FaChartLine />, title: 'Generate Smart Summary' },
  { icon: <FaFilePdf />, title: 'Download PDF' },
]

const TECH = ['Spring Boot', 'React', 'Java', 'MySQL', 'JWT', 'Apache PDFBox', 'Gemini AI', 'REST API']

const TESTIMONIALS = [
  {
    quote: 'My patients arrive already understanding their bloodwork. It cuts our explanation time in half.',
    name: 'Dr. Ananya Rao',
    role: 'Internal Medicine',
    icon: <FaUserMd />,
  },
  {
    quote: 'I finally understood what my prescription was actually treating. The summary felt like a second opinion.',
    name: 'Rahul Menon',
    role: 'Patient',
    icon: <FaUser />,
  },
  {
    quote: 'I use it to double-check how I read lab panels. The AI catches ranges I sometimes skim past.',
    name: 'Sneha Iyer',
    role: 'Medical Student',
    icon: <FaUserGraduate />,
  },
]

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Technology', href: '#technology' },
  { label: 'About', href: '#about' },
]

const Home = () => {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="home">
      {/* ============ NAVBAR ============ */}
      <header className={`home-nav ${scrolled ? 'home-nav--scrolled' : ''}`}>
        <div className="home-nav__inner">
          <a href="#home" className="home-nav__logo" onClick={(e) => { e.preventDefault(); scrollTo('#home') }}>
            <span className="home-nav__logo-icon"><FaStethoscope /></span>
            Medical Report Summarizer
          </a>

          <nav className="home-nav__links">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href) }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="home-nav__actions">
            <button className="btn btn--ghost" onClick={() => navigate('/login')}>Sign In</button>
            <button className="btn btn--solid" onClick={() => navigate('/register')}>Create Account</button>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section id="home" className="hero">
        <div className="hero__blobs" aria-hidden="true">
          <span className="hero__blob hero__blob--a" />
          <span className="hero__blob hero__blob--b" />
          <span className="hero__blob hero__blob--c" />
        </div>

        <div className="hero__inner">
          <motion.div
            className="hero__copy"
            initial="hidden"
            animate="show"
            variants={stagger}
          >
            <motion.span className="eyebrow" variants={fadeUp}>AI Powered Healthcare Intelligence</motion.span>
            <motion.h1 variants={fadeUp}>
              Medical Report
              <br />
              <span className="text-gradient">Summarizer</span>
            </motion.h1>
            <motion.p className="hero__desc" variants={fadeUp}>
              Understand complex medical reports instantly using Artificial Intelligence.
              Upload reports securely, receive simplified summaries, identify medicines,
              laboratory values, and download professional PDF summaries.
            </motion.p>
            <motion.div className="hero__actions" variants={fadeUp}>
              <button className="btn btn--solid btn--lg" onClick={() => navigate('/login')}>Sign In</button>
              <button className="btn btn--ghost btn--lg" onClick={() => navigate('/register')}>Create Account</button>
              <button className="btn btn--text" onClick={() => scrollTo('#how-it-works')}>
                <span className="btn__play"><FaPlay /></span> Watch Demo
              </button>
            </motion.div>
          </motion.div>

          {/* signature visual: live report scan */}
          <motion.div
            className="hero__visual"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <div className="scan-card">
              <div className="scan-card__head">
                <FaFileMedical />
                <div>
                  <p className="scan-card__title">Blood_Panel_Report.pdf</p>
                  <p className="scan-card__sub">Original report</p>
                </div>
              </div>

              <div className="scan-card__lines">
                <span style={{ width: '92%' }} />
                <span style={{ width: '78%' }} />
                <span style={{ width: '85%' }} />
                <span style={{ width: '60%' }} />
                <span style={{ width: '88%' }} />
                <span style={{ width: '70%' }} />
              </div>

              <div className="scan-card__beam" />

              <div className="scan-card__chip scan-card__chip--1">
                <FaPills /> Metformin 500mg
              </div>
              <div className="scan-card__chip scan-card__chip--2">
                <FaFlask /> HbA1c: 6.1% — Normal
              </div>
              <div className="scan-card__chip scan-card__chip--3">
                <GiBrain /> AI Summary Ready
              </div>
            </div>

            <span className="orbit-icon orbit-icon--hospital"><FaHospital /></span>
            <span className="orbit-icon orbit-icon--brain"><GiBrain /></span>
            <span className="orbit-icon orbit-icon--chart"><FaChartLine /></span>
            <span className="orbit-icon orbit-icon--stethoscope"><FaStethoscope /></span>
          </motion.div>
        </div>
      </section>

      {/* ============ STATISTICS ============ */}
      <motion.section
        className="stats"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
      >
        {STATS.map((s) => (
          <motion.div className="stat-card" key={s.label} variants={scaleIn}>
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__label">{s.label}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="section">
        <motion.div
          className="section__head"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <span className="eyebrow">Capabilities</span>
          <h2>Why Choose Medical Report Summarizer?</h2>
        </motion.div>

        <motion.div
          className="features-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          {FEATURES.map((f) => (
            <motion.div className="feature-card" key={f.title} variants={fadeUp}>
              <div className="feature-card__icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="section section--muted">
        <motion.div
          className="section__head"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <span className="eyebrow">Process</span>
          <h2>How It Works</h2>
        </motion.div>

        <motion.div
          className="timeline"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          {STEPS.map((step, i) => (
            <motion.div className="timeline__step" key={step.title} variants={fadeUp}>
              <div className="timeline__circle">{step.icon}</div>
              <p className="timeline__label">Step {i + 1}</p>
              <p className="timeline__title">{step.title}</p>
              {i < STEPS.length - 1 && <span className="timeline__arrow"><FaChevronRight /></span>}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============ TECHNOLOGY ============ */}
      <section id="technology" className="section">
        <motion.div
          className="section__head"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <span className="eyebrow">Under the hood</span>
          <h2>Built With Reliable Technology</h2>
        </motion.div>

        <motion.div
          className="tech-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          {TECH.map((t) => (
            <motion.span className="tech-chip" key={t} variants={scaleIn}>{t}</motion.span>
          ))}
        </motion.div>
      </section>

      {/* ============ ABOUT ============ */}
      <section id="about" className="section section--muted">
        <div className="about">
          <motion.div
            className="about__visual"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={scaleIn}
          >
            <div className="about__card">
              <FaFileMedical className="about__card-icon" />
              <div className="about__card-arrow"><FaChevronRight /></div>
              <GiBrain className="about__card-icon about__card-icon--accent" />
              <div className="about__card-arrow"><FaChevronRight /></div>
              <FaUser className="about__card-icon" />
            </div>
          </motion.div>

          <motion.div
            className="about__copy"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            variants={fadeUp}
          >
            <span className="eyebrow">About the platform</span>
            <h2>Every detail preserved. Nothing lost in translation.</h2>
            <p>
              Medical Report Summarizer reads your original report exactly as it was issued,
              then rewrites it in plain language without dropping a single medicine, lab value,
              or clinical note. The source document stays intact and downloadable, while the
              AI-generated summary sits alongside it, so you always have both the full picture
              and the easy version.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="section">
        <motion.div
          className="section__head"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
        >
          <span className="eyebrow">Trusted by</span>
          <h2>Doctors, Patients and Students</h2>
        </motion.div>

        <motion.div
          className="testimonials-grid"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
        >
          {TESTIMONIALS.map((t) => (
            <motion.div className="testimonial-card" key={t.name} variants={fadeUp}>
              <FaQuoteLeft className="testimonial-card__quote-icon" />
              <p className="testimonial-card__quote">{t.quote}</p>
              <div className="testimonial-card__person">
                <span className="testimonial-card__avatar">{t.icon}</span>
                <div>
                  <p className="testimonial-card__name">{t.name}</p>
                  <p className="testimonial-card__role">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ============ CALL TO ACTION ============ */}
      <motion.section
        className="cta"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        variants={fadeUp}
      >
        <h2>Ready to simplify medical reports?</h2>
        <p>Join now and turn your next report into a summary you actually understand.</p>
        <div className="cta__actions">
          <button className="btn btn--light btn--lg" onClick={() => navigate('/register')}>Get Started</button>
          <button className="btn btn--outline-light btn--lg" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      </motion.section>

      {/* ============ FOOTER ============ */}
      <footer className="home-footer">
        <div className="home-footer__inner">
          <div className="home-footer__brand">
            <span className="home-nav__logo-icon"><FaStethoscope /></span>
            <span>Medical Report Summarizer</span>
          </div>

          <div className="home-footer__links">
            <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('#home') }}>Home</a>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('#features') }}>Features</a>
            <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login') }}>Login</a>
            <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register') }}>Register</a>
            <a href="#technology" onClick={(e) => { e.preventDefault(); scrollTo('#technology') }}>Technology</a>
            <a href="mailto:support@medreportai.com">Contact</a>
          </div>

          <p className="home-footer__copy">© {new Date().getFullYear()} Medical Report Summarizer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home