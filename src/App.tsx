import React, { useState } from 'react';
import './App.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';

import certificateTemplate from './assets/template/template-1.png';
import certificateTemplate2 from './assets/template/template-2.png';

interface FormData {
  name: string;
  description: string;
  certificateId: string;
  date: string;
}

interface Position {
  x: number;
  y: number;
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

  const [positions, setPositions] = useState<{
    [key in keyof FormData]: Position;
  }>({
    name: { x: 0, y: 0 },
    description: { x: 0, y: 0 },
    certificateId: { x: 0, y: 0 },
    date: { x: 0, y: 0 },
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

  const handleDrag = (
    key: keyof typeof positions,
    _e: DraggableEvent,
    data: DraggableData,
  ) => {
    setPositions((prevPositions) => ({
      ...prevPositions,
      [key]: { x: data.x, y: data.y },
    }));
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
            {[certificateTemplate, certificateTemplate2].map(
              (template, index) => (
                <img
                  key={index}
                  src={template}
                  alt={`Certificate Template ${index + 1}`}
                  className={`template-option ${selectedTemplate === template ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(template)}
                />
              ),
            )}
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

            <button type="submit">Preview</button>
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
              <Draggable
                bounds="parent"
                position={positions.name}
                onStop={(e, data) => handleDrag('name', e, data)}
              >
                <p className="certificate-name">{formData.name}</p>
              </Draggable>
              <Draggable
                bounds="parent"
                position={positions.certificateId}
                onStop={(e, data) => handleDrag('certificateId', e, data)}
              >
                <p className="certificate-id">{formData.certificateId}</p>
              </Draggable>
              <Draggable
                bounds="parent"
                position={positions.description}
                onStop={(e, data) => handleDrag('description', e, data)}
              >
                <p className="certificate-description">
                  {formData.description}
                </p>
              </Draggable>
              <Draggable
                bounds="parent"
                position={positions.date}
                onStop={(e, data) => handleDrag('date', e, data)}
              >
                <p className="certificate-date">{formData.date}</p>
              </Draggable>
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
