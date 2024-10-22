import React, { useState } from 'react';
import './App.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas'; // Import html2canvas

import certificateTemplate from './assets/template/template-1.png';
import certificateTemplate2 from './assets/template/template-2.png';
import certificateTemplate3 from './assets/template/main.png';

interface FormData {
  name: string;
  description: string;
  certificateId: string;
  date: string;
}

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState(certificateTemplate);
  const [font, setFont] = useState('Poppins');

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    certificateId: '',
    date: new Date().toLocaleDateString(),
  });

  const [submitted, setSubmitted] = useState(false);

  const handleDownload = () => {
    const certificateElement = document.querySelector(
      '.certificate',
    ) as HTMLElement;

    html2canvas(certificateElement).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      const imgWidth = 300;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${formData.name}-certificate.pdf`);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFont(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container">
      {!submitted ? (
        <>
          <h1>Tublian Certificate Generator</h1>

          <h2>Select Template</h2>
          <div className="template-selection">
            {[
              certificateTemplate,
              certificateTemplate2,
              certificateTemplate3,
            ].map((template, index) => (
              <img
                key={index}
                src={template}
                alt={`Certificate Template ${index + 1}`}
                className={`template-option ${selectedTemplate === template ? 'selected' : ''}`}
                onClick={() => setSelectedTemplate(template)}
              />
            ))}
          </div>
          <form className="certificate-form" onSubmit={handleSubmit}>
            <label>
              Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Certificate Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Certificate ID:
              <input
                type="text"
                name="certificateId"
                value={formData.certificateId}
                onChange={handleChange}
                required
                maxLength={10}
                minLength={10}
              />
            </label>

            <label>
              Select Font:
              <select name="font" value={font} onChange={handleFontChange}>
                <option value="Poppins">Poppins</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Roboto">Roboto</option>
              </select>
            </label>

            <button type="submit">Generate Certificate</button>
          </form>
        </>
      ) : (
        <div className="certificate-container">
          <div className="certificate" style={{ fontFamily: font }}>
            <img
              src={selectedTemplate}
              alt="Selected Certificate Template"
              className="certificate-template"
            />
            <div className="certificate-details">
              <p className="certificate-name">{formData.name}</p>
              <p className="certificate-id">{formData.certificateId}</p>
              <p className="certificate-description">{formData.description}</p>
              <p className="certificate-date">{formData.date}</p>
            </div>
          </div>
          <button onClick={handleDownload}>Download Certificate as PDF</button>
          <button onClick={() => setSubmitted(false)}>Edit Details</button>
        </div>
      )}
    </div>
  );
}

export default App;
