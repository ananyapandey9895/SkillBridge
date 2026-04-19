import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedPageProps {
  children: React.ReactNode;
  className?: string;
}

const AnimatedPage: React.FC<AnimatedPageProps> = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;
