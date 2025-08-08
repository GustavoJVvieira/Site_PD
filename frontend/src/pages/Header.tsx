import React from 'react';
import { motion } from 'framer-motion';
import DropdownMenu from './DropdownMenu';

const Header: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="header"
    >
      <div className="header-left">
        <div className="header-logo">PROJETO<span style={{ color: '#6b46c1' }}>DESENVOLVE</span></div>
        <div className="flex-col">
          <h1 className="header-title">PD for Teachers</h1>
          <p className="header-subtitle">Olá, Professor(a)! Pronto para criar aulas incríveis?</p>
        </div>
      </div>
      <div className="header-right">
        <DropdownMenu />
      </div>
    </motion.div>
  );
};

export default Header;