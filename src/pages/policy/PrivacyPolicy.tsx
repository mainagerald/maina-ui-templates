import { Mail } from 'lucide-react';
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-20 min-w-full bg-white text-gray-700">
      <h1 className="text-2xl font-medium mb-6 font-sans">Privacy Policy</h1>
      <p className="mb-4 text-sm text-gray-500 font-sans">Last Updated: May 17, 2025</p>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">1. Introduction</h2>
        <p className="mb-4 font-sans text-sm">
          Welcome to the TEMPLATE Community. We are committed to protecting your privacy and the information 
          you share with us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
          when you use our website and services (collectively, the "Service").
        </p>
        <p className="mb-4 font-sans text-sm">
          By accessing or using the Service, you consent to the practices described in this Privacy Policy. If you do not agree 
          with the terms of this Privacy Policy, please do not access the Service.
        </p>
        {/* <p className="mb-4 font-sans text-xs">
          This Privacy Policy complies with the Data Protection Act of Kenya (2019) and has been designed to align with international 
          standards including the General Data Protection Regulation (GDPR) where applicable to our users.
        </p> */}
      </section>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">2. Information We Collect</h2>
        <h3 className="text-lg font-medium mb-2 font-sans">2.1 Personal Information</h3>
        <p className="mb-4 font-sans text-sm">
          We may collect personal information that you provide directly to us, including:
        </p>
        <ul className="list-disc pl-6 mb-4 font-sans text-sm">
          <li>Name and username</li>
          <li>Email address</li>
          <li>Profile information (bio, profile image, etc.)</li>
          <li>Website and social media links</li>
          <li>Communications you send to us</li>
        </ul>

        <h3 className="text-lg font-medium mb-2 font-sans">2.2 Information Collected Through Authentication</h3>
        <p className="mb-4 font-sans text-sm">
          When you register or log in using third-party services like Google, we may collect information provided by those services, 
          such as your name, email address, and profile picture. The specific information we receive depends on your privacy settings 
          with the third-party service.
        </p>

        <h3 className="text-lg font-medium mb-2 font-sans">2.3 Usage Information</h3>
        <p className="mb-4 font-sans text-sm">
          We may automatically collect certain information about your device and how you interact with our Service, including:
        </p>
        <ul className="list-disc pl-6 mb-4 font-sans text-sm">
          <li>IP address</li>
          {/* <li>Device information (type, model, operating system)</li> */}
          <li>Browser type and version</li>
          {/* <li>Pages viewed and time spent on pages</li> */}
          <li>Links clicked and actions taken</li>
          <li>Referring website or source</li>
          {/* <li>Date and time of visits</li> */}
          {/* <li>Error logs and performance data</li> */}
        </ul>

        {/* <h3 className="text-lg font-medium mb-2 font-sans">2.4 Cookies and Similar Technologies</h3>
        <p className="mb-4 font-sans text-sm">
          We use cookies and similar tracking technologies to collect information about your browsing activities. These technologies 
          help us analyze Service usage, remember your preferences, and provide personalized experiences.
        </p>
        <p className="mb-4">Types of cookies we use:</p>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>Essential cookies:</strong> Required for the basic functionality of our Service</li>
          <li><strong>Analytical cookies:</strong> Help us understand how visitors interact with our Service</li>
          <li><strong>Functional cookies:</strong> Remember your preferences and settings</li>
          <li><strong>Targeting/advertising cookies:</strong> Track your browsing habits to deliver targeted advertising</li>
        </ul> */}
      </section>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">3. Basis for Processing</h2>
        <p className="mb-4 font-sans text-sm">We process your personal information on the following legal bases:</p>
        <ul className="list-disc pl-6 mb-4 font-sans text-sm">
          <li><strong>Consent:</strong> Where you have given clear consent for us to process your personal information for a specific purpose.</li>
          <li><strong>Contract:</strong> Where processing is necessary for the performance of a contract with you or to take steps at your request before entering into a contract.</li>
          <li><strong>Legitimate interests:</strong> Where processing is necessary for our legitimate interests or the legitimate interests of a third party, except where these interests are overridden by your data protection rights.</li>
          <li><strong>Legal obligation:</strong> Where processing is necessary to comply with our legal obligations.</li>
        </ul>
      </section>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">4. How We Use Collected Information</h2>
        <p className="mb-4 font-sans text-sm">We use the information we collect to:</p>
        <ul className="list-disc pl-6 mb-4 font-sans text-sm">
          <li>Provide, maintain, and improve our Service</li>
          {/* <li>Process and complete transactions</li> */}
          <li>Send you technical notices, updates, security alerts, and support messages</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Communicate with you about events, offers, promotions, and news about services we think will be of interest to you</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our Service</li>
          <li>Detect, investigate, and prevent illegal activities</li>
          <li>Personalize and improve the Service</li>
          {/* <li>Generate aggregated or anonymized data for analytical purposes</li> */}
          <li>Enforce our Terms and Conditions</li>
          <li>Protect our legal rights and prevent misuse</li>
        </ul>
      </section>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">5. Data Retention</h2>
        <p className="mb-4 font-sans text-sm">
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, 
          unless a longer retention period is required or permitted by law. The criteria used to determine our retention periods include:
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm font-sans">
          <li>The duration of our ongoing relationship with you and provision of the Service</li>
          <li>Whether we have a legal obligation to retain the data</li>
          <li>Whether retention is advisable in light of our legal position (such as for statutes of limitations, litigation, or regulatory investigations)</li>
        </ul>
        <p className="mb-4 font-sans text-sm">
          When we no longer need personal information, we securely delete any data associated with you.
        </p>
      </section>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">6. Sharing of Information</h2>
        <p className="mb-4 text-sm font-sans">We may share your information as follows:</p>
        <ul className="list-disc pl-6 mb-4 text-sm font-sans">
          <li><strong>Service Providers:</strong> With third-party vendors, consultants, and other service providers who need access to your information to perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
          <li><strong>Legal Requirements:</strong> In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law or legal process.</li>
          <li><strong>Protection of Rights:</strong> If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of TEMPLATE or others.</li>
          <li><strong>With Your Consent:</strong> With your consent or at your direction.</li>
        </ul>
        <p className="mb-4 text-sm font-sans">
          We do not sell your personal information to third parties.
        </p>
      </section>

      {/* <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">7. International Data Transfers</h2>
        <p className="mb-4 text-sm font-sans">
          TEMPLATE is based in Kenya, but we may transfer, process, and store information about you in countries other than your own. 
          These countries may have data protection laws that are different from those of your country.
        </p>
        <p className="mb-4 text-sm font-sans">
          When we transfer information outside of Kenya or your region, we take measures to ensure that your information continues to be protected. 
          These measures include implementing standard contractual clauses approved by relevant regulatory authorities and ensuring third-party 
          recipients of your information have appropriate safeguards in place.
        </p>
        <p className="mb-4">
          By using our Service, you consent to the transfer of your information to any country where we operate, including countries that may not 
          provide the same level of data protection as your home country.
        </p>
      </section> */}

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">7. Data Security</h2>
        <p className="mb-4 text-sm font-sans">
          We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, 
          alteration, and destruction. These measures include encryption of sensitive data, regular security assessments, and restricted 
          access to personal information.
        </p>
        <p className="mb-4 text-xs font-sans">
          However, no internet or email transmission is ever fully secure or error-free. In particular, email sent to or from the Service 
          may not be secure. Therefore, you should take special care in deciding what information you send via email or share on the Service. We cannot guarantee 
          the security of information transmitted to or from our Service.
        </p>
      </section>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">8. Your Rights</h2>
        <p className="mb-4 text-sm font-sans">
          Depending on your location, you may have certain rights regarding your personal information. These may include:
        </p>
        <ul className="list-disc pl-6 mb-4 text-sm font-sans">
          <li><strong>Access:</strong> You can request a copy of the personal information we hold about you.</li>
          <li><strong>Correction:</strong> You can ask us to correct inaccurate or incomplete information.</li>
          <li><strong>Deletion:</strong> You can ask us to delete your personal information in certain circumstances.</li>
          <li><strong>Restriction:</strong> You can ask us to restrict the processing of your information in certain circumstances.</li>
          <li><strong>Data portability:</strong> You can ask us to transfer your information to another organization or directly to you.</li>
          <li><strong>Objection:</strong> You can object to our processing of your information in certain circumstances.</li>
          <li><strong>Withdraw consent:</strong> Where we rely on your consent to process your information, you can withdraw your consent at any time.</li>
        </ul>
        <p className="mb-4 text-sm font-sans">
          To exercise these rights, please see the "Contact Us" section below. We may need to verify your identity before fulfilling your request. 
          We will respond to your request within the timeframe required by applicable law.
        </p>
      </section>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">9. Your Choices</h2>
        <h3 className="text-lg font-medium mb-2 font-sans">9.1 Account Information</h3>
        <p className="mb-4 text-sm font-sans">
          You may update, correct, or delete your account information at any time by logging into your online account. 
          If you wish to delete your account, please contact us using the information in the "Contact Us" section.
        </p>

        {/* <h3 className="text-lg font-medium mb-2 font-sans">9.2 Cookies</h3>
        <p className="mb-4 text-sm font-sans">
          Most web browsers are set to accept cookies by default. If you prefer, you can usually choose to set your browser 
          to remove or reject browser cookies. You can also manage your cookie preferences through our cookie consent banner. 
          Please note that if you choose to remove or reject cookies, this could affect the availability and functionality of our Service.
        </p> */}

        <h3 className="text-lg font-medium mb-2 font-sans">9.2 Promotional Communications</h3>
        <p className="mb-4 text-sm font-sans">
          You may opt out of receiving promotional emails from TEMPLATE by following the instructions in those emails or by adjusting your 
          communication preferences in your account settings. If you opt out, we may still send you non-promotional emails, such as those 
          about your account or our ongoing business relations.
        </p>
      </section>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">10. Children's Privacy</h2>
        <p className="mb-4 text-sm font-sans">
          Our Service is not directed to children under 13 (or the applicable age of digital consent in your jurisdiction), and we do not 
          knowingly collect personal information from children. If we learn we have collected personal information from a child without 
          parental consent where it is required, we will delete that information as quickly as possible. If you believe we have collected 
          information from a child inappropriately, please contact us.
        </p>
      </section>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">11. Links to Other Websites</h2>
        <p className="mb-4 text-sm font-sans">
          Our Service may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed 
          to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and 
          assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
        </p>
      </section>

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">12. Changes to this Privacy Policy</h2>
        <p className="mb-4 text-sm font-sans">
          We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or through the Service 
          prior to the changes becoming effective. We will also update the "Last Updated" date at the top of this Privacy Policy.
        </p>
        <p className="mb-4 text-sm font-sans">
          We encourage you to review the Privacy Policy whenever you access the Service to stay informed about our information practices.
        </p>
      </section>

      {/* <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">13. Data Protection Officer</h2>
        <p className="mb-4 text-sm font-sans">
          We have appointed a Data Protection Officer (DPO) who is responsible for overseeing questions regarding this Privacy Policy. 
          If you have any questions about this Privacy Policy, including any requests to exercise your legal rights, please contact our DPO 
          using the details provided in the "Contact Us" section.
        </p>
      </section> */}

      <section className="mb-8 bg-white">
        <h2 className="text-xl font-medium mb-4 font-sans">14. Contact Us</h2>
        <p className="mb-4 text-sm font-sans">
          If you have any questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p className="mb-4 text-sm font-sans">
        Email: <a href="mailto:TEMPLATEaiorg@gmail.com" className="text-red-600">TEMPLATEaiorg@gmail.com</a><br />
        </p>
        <ul className="flex flex-col gap-2 mb-4 text-sm font-sans text-blue-500">
          <a href="https://x.com/TEMPLATE_ai" target="_blank" rel="noopener noreferrer" className='inline-block px-2 py-1 text-blue-500 underline'>Twitter</a>
          <a href="https://www.meetup.com/TEMPLATEai/" target="_blank" rel="noopener noreferrer" className='inline-block px-2 py-1 text-blue-500 underline'>Meetup</a>
          <a href="https://www.linkedin.com/company/TEMPLATE-ai-community/" target="_blank" rel="noopener noreferrer" className='inline-block px-2 py-1 text-blue-500 underline'>LinkedIn</a>
        </ul>
        <p className="mb-4 text-sm font-sans">
          TEMPLATE<br />
          TEMPLATE, Kenya
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
