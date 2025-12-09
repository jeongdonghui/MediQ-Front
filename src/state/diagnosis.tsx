import React, { createContext, useState, useContext } from 'react';

const DiagnosisContext = createContext();

export const DiagnosisProvider = ({ children }) => {
  const [bodyPart, setBodyPart] = useState(null);
  const [symptom, setSymptom] = useState('');
  return (
    <DiagnosisContext.Provider value={{ bodyPart, setBodyPart, symptom, setSymptom }}>
      {children}
    </DiagnosisContext.Provider>
  );
};
export const useDiagnosis = () => useContext(DiagnosisContext);
