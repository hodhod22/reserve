import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto text-center">
        <div className="flex justify-center space-x-6 mb-4">
          <Link
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaGithub size={24} />
          </Link>
          <Link
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaLinkedin size={24} />
          </Link>
        </div>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} MyApp. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
