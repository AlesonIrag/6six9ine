export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/images/logo.png" alt="6six9ine" className="footer-logo" />
            <p>Against All Odds. Premium streetwear crafted for those who refuse to conform.</p>
            <div className="footer-socials">
              <a href="https://www.instagram.com/6six9ineapparelco/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>
              <a href="https://www.facebook.com/hanzcube" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 6six9ine. All rights reserved.</span>
          <span>Against All Odds</span>
        </div>
      </div>
    </footer>
  );
}
