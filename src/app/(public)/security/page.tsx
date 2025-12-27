const Security = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Security Overview</h1>
        <p className="text-lg text-muted-foreground mb-12">
          Audit-IQ applies industry-standard security practices to safeguard your data and ensure reliability.
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Infrastructure</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Hosted on secure cloud environments with modern isolation controls</li>
              <li>Encrypted communication using TLS/HTTPS</li>
              <li>Regular patching and security updates</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Data Protection</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption in transit (HTTPS)</li>
              <li>Secure access to document processing pipelines</li>
              <li>No external model training using customer data</li>
              <li>Minimal data retention aligned with operational needs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Access Controls</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Role-based internal access</li>
              <li>Production data accessible only to authorised personnel</li>
              <li>Strict logging of administrative actions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Operational Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Continuous monitoring for anomalies</li>
              <li>Regular review of subprocessors</li>
              <li>Backup and recovery capabilities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Compliance Intent</h2>
            <p>While not yet certified, Audit-IQ follows principles aligned with:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>ISO 27001</li>
              <li>SOC 2</li>
              <li>Australian Privacy Act (APA 2024)</li>
              <li>GDPR (for future EU expansion)</li>
            </ul>
            <p className="mt-4">As the platform grows, we will formalise our compliance roadmap.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Contact</h2>
            <p>
              For security queries:<br />
              📧 <a href="mailto:founder@audit-iq.com" className="text-accent hover:underline">founder@audit-iq.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Security;