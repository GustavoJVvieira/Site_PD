import React from 'react';
import { motion } from 'framer-motion';
import DropdownMenu from './DropdownMenu';


const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="header"
    >
      <div className="header-left">
        <motion.img
          src="https://storage.googleapis.com/hostinger-horizons-assets-prod/6ec2d8a5-910f-4ce0-b30d-ff109657bb02/71fcca377b62f4a5fa0294b960e95e5b.png"
          alt="Logo Projeto Desenvolve"
          style={{ height: '30px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        />
        <div className="flex-col">
          <h1 className="header-title">    PD for Teachers</h1>
          <p className="header-subtitle">   Olá, Professor(a)! Pronto para criar aulas incríveis?</p>
        </div>
      </div>
      <div className="header-right">
        <DropdownMenu />
      </div>
    </motion.header>
  );
};

export default Header;