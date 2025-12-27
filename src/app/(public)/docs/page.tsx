const Documentation = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Product Documentation</h1>
        <p className="text-muted-foreground mb-12">Last updated: January 2025</p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <p className="text-lg">
              Audit-IQ helps organisations interpret regulatory documents and convert them into structured, 
              audit-ready insights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">1. How the Platform Works</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Step 1 — Upload Documents</h3>
            <p className="font-semibold">Upload:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Regulatory frameworks</li>
              <li>Internal policies</li>
              <li>Client compliance documents</li>
            </ul>
            
            <p className="font-semibold mt-4">Supported formats:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>PDF</li>
              <li>Word (DOCX)</li>
              <li>Text</li>
              <li>Web pages (coming soon)</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">Step 2 — AI Extraction</h3>
            <p>Audit-IQ automatically:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Extracts obligations, requirements, and responsibilities</li>
              <li>Summarises complex sections</li>
              <li>Identifies related evidence and controls</li>
              <li>Highlights key compliance actions</li>
            </ul>
            <p className="mt-2">Outputs are generated using advanced language models and proprietary logic.</p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Step 3 — Review & Export</h3>
            <p>You can:</p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Review extracted insights</li>
              <li>Map evidence to obligations</li>
              <li>Export data to PDF / Excel (beta)</li>
              <li>Share summaries with teams or clients</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Supported Frameworks (Current)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>APA 2024 (Australian Privacy Act)</li>
              <li>Essential Eight</li>
              <li>ISO 27001</li>
              <li>ISO 31000</li>
              <li>Australian AI Ethics Principles</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Roadmap Frameworks</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>GDPR</li>
              <li>NIS2</li>
              <li>EU AI Act</li>
              <li>ISO 42001</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Known Limitations (MVP Transparency)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI interpretations require human review</li>
              <li>Formatting of some PDFs may affect extraction</li>
              <li>Multi-document analysis is in beta</li>
              <li>Evidence auto-linking is improving</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Support</h2>
            <p>
              For documentation or product help:<br />
              📧 <a href="mailto:founder@audit-iq.com" className="text-accent hover:underline">founder@audit-iq.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Documentation;