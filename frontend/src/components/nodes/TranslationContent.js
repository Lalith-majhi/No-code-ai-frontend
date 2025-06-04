import React, { useState } from 'react';

const TranslationContent = ({ data, onChange }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  
  const languages = [
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' }
  ];

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
    if (onChange) {
      onChange({ ...data, targetLanguage: e.target.value });
    }
  };

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ marginBottom: '8px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontSize: '12px', color: '#666' }}>
          Target Language
        </label>
        <select 
          value={selectedLanguage}
          onChange={handleLanguageChange}
          style={{
            width: '100%',
            padding: '6px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      
      <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
        Input text will be translated to the selected language
      </div>
    </div>
  );
};

export default TranslationContent; 