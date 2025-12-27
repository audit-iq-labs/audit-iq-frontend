const Privacy = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground mb-12">Last updated: January 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <p className="text-lg">
              Audit-IQ ("we", "our") is committed to protecting your personal information.
              This Privacy Policy explains what data we collect and how we use it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold mt-4 mb-2">a. Information you provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email, company information</li>
              <li>Documents uploaded for analysis</li>
              <li>Messages submitted via contact forms</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">b. Usage data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Browser type and device information</li>
              <li>Page views and feature usage</li>
              <li>Interaction logs (for support and troubleshooting)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4 mb-2">c. Cookies</h3>
            <p>We use minimal cookies to maintain session and platform functionality.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p>We process data to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Provide the core features of the platform</li>
              <li>Respond to demo or contact requests</li>
              <li>Improve service reliability and accuracy</li>
              <li>Maintain security and troubleshoot issues</li>
              <li>Communicate updates, features, and support information</li>
            </ul>
            <p className="mt-2">We do not sell or share your data with third-party advertisers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Document Processing</h2>
            <p>Documents uploaded to Audit-IQ are:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Processed securely</li>
              <li>Not used to train third-party AI models</li>
              <li>Not accessed by unauthorised personnel</li>
              <li>Deleted upon request</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Data Sharing</h2>
            <p>We may share limited data with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Infrastructure providers (cloud hosting)</li>
              <li>Email service providers (to send notifications)</li>
              <li>Analytics tools (usage and performance analysis)</li>
            </ul>
            <p className="mt-2">All subprocessors follow strict security requirements.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Data Retention</h2>
            <p>We retain:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Account information until deletion</li>
              <li>Uploaded documents only as long as required to provide the service</li>
              <li>Contact form submissions for support follow-up</li>
            </ul>
            <p className="mt-2">You may request deletion at any time.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
            <p>You may:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Request access to your data</li>
              <li>Request correction or deletion</li>
              <li>Object to or restrict certain processing</li>
              <li>Withdraw consent</li>
            </ul>
            <p className="mt-2">
              Requests can be made at: <a href="mailto:founder@audit-iq.com" className="text-accent hover:underline">founder@audit-iq.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Security</h2>
            <p>
              We use secure cloud infrastructure, encryption, access controls, and monitoring to protect your data.
              Full details are listed in our <a href="/security" className="text-accent hover:underline">Security page</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
            <p>We may update this policy to reflect improvements or regulatory requirements.</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;