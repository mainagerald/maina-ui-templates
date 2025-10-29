import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  ArrowRight,
  X,
  LucideTwitter,
  LucideGroup,
} from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="min-h-[70vh] bg-black py-16 text-white lowercase">
      <div className="container mx-auto px-6">
        {/* Logo and tagline section */}
        <div className="mb-16 flex flex-row items-center justify-between text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            // className="mb-8"
          >
            <Link to="/" className="inline-block">
              <img alt="TEMPLATE Logo" className="h-16" />
            </Link>
          </motion.div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          <div>
            {/* <h3 className="text-xl font-bold mb-6 tracking-wide border-b border-gray-800 pb-2">PLATFORM</h3> */}
            <ul className="space-y-4">
              <FooterLink to="/about">About</FooterLink>
              <FooterLink to="/events">Events</FooterLink>
              <FooterLink to="/resources">Resources</FooterLink>
              <FooterLink to="/projects">Projects</FooterLink>
              <FooterLink to="/forums">Forums</FooterLink>
              <FooterLink to="/jobs">Jobs</FooterLink>
            </ul>
          </div>

          <div>
            {/* <h3 className="text-xl font-bold mb-6 tracking-wide border-b border-gray-800 pb-2">CONNECT</h3> */}
            <div className="flex flex-wrap gap-4 mb-6">
              <SocialLink
                href="https://x.com/TEMPLATE_ai"
                icon={<LucideTwitter size={20} className="text-white" />}
                label="Twitter"
              />
              <SocialLink
                href="https://www.meetup.com/TEMPLATEai/"
                icon={<LucideGroup size={20} className="text-white" />}
                label="Meetup"
              />
              {/* <SocialLink
                href="https://instagram.com"
                icon={
                  <Instagram
                    size={20}
                    className="bg-clip-text bg-transparent bg-gradient-to-r from-red-500 via-purple-500 to-blue-400"
                  />
                }
                label="Instagram"
              /> */}
              <SocialLink
                href="https://www.linkedin.com/company/TEMPLATE-ai-community/"
                icon={<Linkedin size={20} className="text-white" />}
                label="LinkedIn"
              />
              {/* <SocialLink
                href="https://github.com"
                icon={<Github size={20} className="text-white" />}
                label="GitHub"
              /> */}
            </div>
            <p className="text-gray-400 text-sm">
              Follow us for the latest updates and community highlights.
            </p>
          </div>

          {/* Column 4: Newsletter */}
          <div className="p-5 border rounded-2xl">
            <p className="text-gray-400 mb-4">
              Stay updated with our latest events and AI news.
            </p>
            <div className="flex p-4">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-l-md w-full focus:outline-none focus:border-gray-600 text-white"
              />
              <button className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-r-md transition-colors duration-300 flex items-center justify-center">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 mb-4 md:mb-0">
            © {currentYear} TEMPLATE. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <FooterLink
              to="/policy"
              className="text-sm text-gray-500 hover:text-white"
            >
              Privacy Policy
            </FooterLink>
            <FooterLink
              to="/terms-and-conditions"
              className="text-sm text-gray-500 hover:text-white"
            >
              Terms of Service
            </FooterLink>
            {/* <FooterLink
              to="#"
              className="text-sm text-gray-500 hover:text-white"
            >
              Code of Conduct
            </FooterLink> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const FooterLink = ({ to, children, className = "" }: FooterLinkProps) => (
  <li className="list-none">
    <a
      href={to}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-gray-400 hover:text-white transition-all duration-300 ${className}`}
    >
      {children}
    </a>
  </li>
);

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

const SocialLink = ({ href, icon, label, className = "" }: SocialLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`text-white p-0 m-1 rounded-full transition-all duration-300 hover:scale-110 ${className}`}
    aria-label={label}
  >
    {icon}
  </a>
);

export default Footer;
