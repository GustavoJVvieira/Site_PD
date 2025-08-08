import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const DropdownMenu: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const coursePlans = [
    { subject: 'Matemática', link: 'https://drive.google.com/your-math-link' },
    { subject: 'Ciências', link: 'https://drive.google.com/your-science-link' },
    { subject: 'História', link: 'https://drive.google.com/your-history-link' },
    { subject: 'Português', link: 'https://drive.google.com/your-portuguese-link' },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="dropdown-container">
      <button
        onClick={toggleDropdown}
        className="dropdown-button"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        Planos de Curso
        <ChevronDown style={{ width: '16px', height: '16px' }} />
      </button>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          {coursePlans.map((plan, index) => (
            <a
              key={index}
              href={plan.link}
              target="_blank"
              rel="noopener noreferrer"
              className="dropdown-item"
            >
              {plan.subject}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;