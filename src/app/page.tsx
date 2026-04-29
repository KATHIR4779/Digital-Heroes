import Link from 'next/link';
import { ArrowRight, Trophy, Medal } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className="container">
          <div className={styles.navContent}>
            <div className={styles.logo}>
              <span className="text-gradient">Digital Heroes</span>
            </div>
            <div className={styles.navLinks}>
              <Link href="/charities" className={styles.link}>Charities</Link>
              <Link href="/login" className={styles.link}>Login</Link>
              <Link href="/signup" className="btn btn-primary">Join the Club</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.glowOrb}></div>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeDot}></span>
              Play Golf. Win Prizes. Change the World.
            </div>
            <h1 className={styles.title}>
              Your Score is More Than <br/>
              <span className="text-gradient">Just a Number.</span>
            </h1>
            <p className={styles.subtitle}>
              Digital Heroes is the exclusive club where your Stableford scores enter you into massive monthly prize pools—all while funding world-changing charities.
            </p>
            <div className={styles.heroActions}>
              <Link href="/signup" className="btn btn-primary btn-lg">
                Subscribe Now <ArrowRight size={20} />
              </Link>
              <Link href="#how-it-works" className="btn btn-secondary btn-lg">
                How It Works
              </Link>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            {/* Abstract dynamic representation of golf & rewards */}
            <div className={styles.abstractCard}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>Monthly Draw Pool</div>
                  <div className={styles.cardValue}>$14,500.00</div>
                </div>
                <Trophy size={32} className={styles.cardIcon} />
              </div>
              <div className={styles.cardDivider}></div>
              <div className={styles.cardStats}>
                <div className={styles.statGroup}>
                  <div className={styles.statLabel}>Next Draw</div>
                  <div className={styles.statValue}>5 Days</div>
                </div>
                <div className={styles.statGroup}>
                  <div className={styles.statLabel}>Charity Impact</div>
                  <div className={styles.statValue}>$3,200.00</div>
                </div>
              </div>
            </div>
            
            <div className={`${styles.abstractCard} ${styles.abstractCardSecondary}`}>
              <div className={styles.cardHeader}>
                <div>
                  <div className={styles.cardTitle}>Your Latest Score</div>
                  <div className={styles.cardValue}>38 pts</div>
                </div>
                <Medal size={32} className={styles.cardIconAlt} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / How it works */}
      <section id="how-it-works" className={styles.features}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2>Elevate Your Game</h2>
            <p>Three simple steps to transform your weekend round into a meaningful mission.</p>
          </div>
          
          <div className={styles.grid}>
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div className={styles.featureIcon}>1</div>
              <h3>Subscribe & Select</h3>
              <p>Choose your monthly or yearly plan and select the charity you want to support with a portion of your subscription.</p>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div className={styles.featureIcon}>2</div>
              <h3>Enter Your Scores</h3>
              <p>After your round, log your Stableford score. We keep your last 5 scores active for the monthly draw.</p>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div className={styles.featureIcon}>3</div>
              <h3>Win & Give Back</h3>
              <p>Match your scores in our monthly draw to win huge cash prizes, all while your charity receives vital funding.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer CTA */}
      <section className={styles.footerCta}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Ready to Become a Hero?</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>Join thousands of players making a difference.</p>
          <div>
            <Link href="/signup" className="btn btn-accent" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
