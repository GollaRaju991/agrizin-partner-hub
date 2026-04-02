const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <h1 className="text-3xl font-heading font-bold mb-2">Privacy Policy – Agrizin Partner</h1>
        <p className="text-muted-foreground mb-8">Effective Date: April 2, 2026</p>

        <Section title="1. Introduction">
          <p>
            Agrizin Partner is a mobile application designed to connect farm workers, drivers, and vehicle owners with farmers and agricultural businesses across India. The app enables users to offer and access agricultural services such as renting tractors and farm equipment, hiring drivers, and providing farm labor services.
          </p>
          <p className="mt-2">
            This Privacy Policy explains how we collect, use, share, and protect your personal information when you use the Agrizin Partner application and related services. By using our app, you agree to the practices described in this policy.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following types of information:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Personal Details:</strong> Name, phone number, email address, date of birth, gender, and Aadhaar/PAN details for identity verification.</li>
            <li><strong>Location Data:</strong> Real-time GPS location to provide location-based services, match nearby service requests, and enable navigation.</li>
            <li><strong>Vehicle Details:</strong> Vehicle type, registration number, driving license number, and vehicle images (for drivers and vehicle owners).</li>
            <li><strong>Service & Booking Details:</strong> Service applications, booking history, availability status, and earnings information.</li>
            <li><strong>Device & Technical Information:</strong> Device model, operating system, app version, IP address, and usage analytics to improve performance.</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Connect farmers with workers, drivers, and vehicle owners for agricultural services.</li>
            <li>Provide accurate location-based service matching and navigation.</li>
            <li>Manage bookings, service applications, and rental transactions.</li>
            <li>Process referral bonuses and earnings withdrawals.</li>
            <li>Improve user experience through analytics and feedback.</li>
            <li>Send important notifications, updates, and promotional communications.</li>
            <li>Verify user identity and prevent fraud.</li>
          </ul>
        </Section>

        <Section title="4. Data Sharing">
          <p>We may share your information in the following circumstances:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>With Service Users:</strong> Your name, phone number, location, and vehicle details may be shared with customers or service providers to fulfill service requests.</li>
            <li><strong>With Legal Authorities:</strong> We may disclose information if required by law, regulation, or legal process.</li>
            <li><strong>With Service Partners:</strong> Payment processors and technology partners who help us operate the platform, bound by confidentiality agreements.</li>
          </ul>
          <p className="mt-3 font-semibold">We do not sell your personal data to any third party.</p>
        </Section>

        <Section title="5. Location Usage">
          <p>
            Agrizin Partner requires access to your device's location (GPS) to provide core functionality:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>Foreground Location:</strong> Used when the app is open to show nearby service requests, enable navigation to job sites, and display your position on maps.</li>
            <li><strong>Background Location:</strong> Used when you are marked as "online" to continuously match you with nearby service requests and provide real-time availability to customers, even when the app is minimized.</li>
          </ul>
          <p className="mt-2">
            Location data is collected only when you are logged in and have granted permission. You can disable location access at any time through your device settings, though this may limit app functionality.
          </p>
        </Section>

        <Section title="6. Data Security">
          <p>
            We implement industry-standard security measures to protect your personal information, including:
          </p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Encrypted data transmission using SSL/TLS protocols.</li>
            <li>Secure cloud storage with access controls and authentication.</li>
            <li>Regular security audits and vulnerability assessments.</li>
            <li>Role-based access controls for internal staff.</li>
          </ul>
          <p className="mt-2">
            While we strive to protect your data, no method of electronic transmission or storage is 100% secure. We encourage you to use strong passwords and keep your login credentials confidential.
          </p>
        </Section>

        <Section title="7. User Account & Data Deletion">
          <p>You have the right to delete your account and associated data:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li><strong>In-App Deletion:</strong> Navigate to <em>Profile → Settings → Delete Account</em> to permanently delete your account.</li>
            <li><strong>Email Request:</strong> Send a deletion request to <a href="mailto:agrizincontact@gmail.com" className="text-primary underline">agrizincontact@gmail.com</a> with your registered phone number.</li>
          </ul>
          <p className="mt-2">
            Upon receiving a deletion request, we will remove your personal data within 30 days. Some data may be retained for legal compliance, dispute resolution, or fraud prevention purposes.
          </p>
        </Section>

        <Section title="8. Data Retention">
          <p>
            We retain your personal data for as long as your account is active or as needed to provide services. After account deletion, we may retain certain data for up to 90 days for backup and legal compliance purposes. Transaction records and financial data may be retained for up to 7 years as required by applicable tax and financial regulations.
          </p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Agrizin Partner is intended for users who are 18 years of age or older. We do not knowingly collect personal information from children under 18. If we discover that a child under 18 has provided us with personal information, we will promptly delete such data. If you believe a minor has registered on our platform, please contact us at <a href="mailto:agrizincontact@gmail.com" className="text-primary underline">agrizincontact@gmail.com</a>.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of significant changes through in-app notifications or by posting a prominent notice on our website. We encourage you to review this policy periodically. Continued use of the app after changes constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or your personal data, please contact us:</p>
          <ul className="list-none mt-2 space-y-1">
            <li><strong>Email:</strong> <a href="mailto:agrizincontact@gmail.com" className="text-primary underline">agrizincontact@gmail.com</a></li>
            <li><strong>Website:</strong> <a href="https://agrizinpartner.in" className="text-primary underline" target="_blank" rel="noopener noreferrer">https://agrizinpartner.in</a></li>
          </ul>
        </Section>

        <div className="border-t border-border mt-12 pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Agrizin Partner. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-8">
    <h2 className="text-xl font-heading font-semibold mb-3">{title}</h2>
    <div className="text-muted-foreground leading-relaxed">{children}</div>
  </section>
);

export default PrivacyPolicy;
