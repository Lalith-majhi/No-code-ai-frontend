import { useState } from 'react';
import BaseNode from '../components/BaseNode';
import { BsImage } from 'react-icons/bs';

export const ImageProcessingNode = ({ id, data = { isExpanded: true }, ...props }) => {
  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        if (data?.onDataChange) {
          data.onDataChange(id, 'image', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const titleContent = (
    <div style={{ width: '100%', padding: '4px 0' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        width: '100%'
      }}>
        <BsImage size={18} />
        <span style={{ flex: 1 }}>Image Processing</span>
      </div>
      <div style={{
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '4px',
        lineHeight: '1.4',
        width: '100%'
      }}>
        Upload and process images in your workflow
      </div>
    </div>
  );

  const nodeContent = (
    <div style={{ 
      width: '100%', 
      padding: '8px 0', 
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      position: 'relative',
      zIndex: 1
    }}>
      <div style={{
        marginBottom: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        width: '100%'
      }}>
        <label style={{
          fontSize: '0.8rem',
          color: '#666',
          fontWeight: '500',
          marginBottom: '2px'
        }}>
          Image
        </label>
        <div style={{
          width: '100%',
          minHeight: '120px',
          border: '2px dashed #ddd',
          borderRadius: '6px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          gap: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          backgroundColor: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {image ? (
            <img 
              src={image} 
              alt="Uploaded preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                objectFit: 'contain'
              }}
            />
          ) : (
            <>
              <BsImage size={24} color="#666" />
              <div style={{
                fontSize: '0.9rem',
                color: '#666',
                textAlign: 'center'
              }}>
                Click to upload an image
              </div>
              <button style={{
                padding: '8px 16px',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '0.9rem',
                color: '#333',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: '#e5e5e5'
                }
              }}>
                Select File
              </button>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer',
              zIndex: 2
            }}
          />
        </div>
      </div>
    </div>
  );

  const handleStyle = {
    opacity: 0,
    width: 0,
    height: 0,
    border: 'none',
    background: 'transparent'
  };

  return (
    <BaseNode
      id={id}
      type="ImageProcessingNode"
      label={titleContent}
      inputs={[
        { id: 'input', type: 'target', position: 'left', style: handleStyle }
      ]}
      outputs={[
        { id: 'output', type: 'source', position: 'right', style: handleStyle }
      ]}
      data={{
        ...data,
        isExpanded: data.isExpanded ?? true,
        label: titleContent,
        image
      }}
      content={nodeContent}
      {...props}
    />
  );
}; 