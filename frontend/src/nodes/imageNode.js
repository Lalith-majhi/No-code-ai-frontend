import { useState, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import BaseNode from '../components/BaseNode';
import { BsImage, BsUpload } from 'react-icons/bs';

export const ImageNode = ({ id, data = { isExpanded: true }, ...props }) => {
  const [image, setImage] = useState(data?.image || null);
  const [previewUrl, setPreviewUrl] = useState(data?.previewUrl || null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      if (data?.onDataChange) {
        data.onDataChange(id, 'image', file);
        data.onDataChange(id, 'previewUrl', url);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const inputGroupStyle = {
    marginBottom: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    width: '100%'
  };

  const labelStyle = {
    fontSize: '0.8rem',
    color: '#666',
    fontWeight: '500',
    marginBottom: '2px'
  };

  const uploadAreaStyle = {
    padding: '16px',
    borderRadius: '6px',
    border: '2px dashed #ddd',
    backgroundColor: '#fafafa',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    '&:hover': {
      borderColor: '#6466f1',
      backgroundColor: '#f8f8ff'
    }
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    color: '#666',
    fontSize: '0.9rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#6466f1',
      color: '#6466f1',
      backgroundColor: '#f8f8ff'
    }
  };

  const previewStyle = {
    width: '100%',
    height: '120px',
    borderRadius: '6px',
    objectFit: 'cover',
    backgroundColor: '#f0f0f0'
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
      gap: '12px'
    }}>
      <div style={inputGroupStyle}>
        <label style={labelStyle}>Image</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        {previewUrl ? (
          <div style={uploadAreaStyle} onClick={handleUploadClick}>
            <img src={previewUrl} alt="Preview" style={previewStyle} />
            <button style={buttonStyle}>
              <BsUpload size={16} />
              Change Image
            </button>
          </div>
        ) : (
          <div style={uploadAreaStyle} onClick={handleUploadClick}>
            <BsUpload size={24} color="#666" />
            <span style={{ color: '#666', fontSize: '0.9rem' }}>
              Click to upload an image
            </span>
            <button style={buttonStyle}>
              <BsUpload size={16} />
              Select File
            </button>
          </div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-image`}
        style={{
          background: '#6466f1',
          width: '8px',
          height: '8px',
          border: '2px solid #fff',
          opacity: !data?.isExpanded ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-processed`}
        style={{
          background: '#6466f1',
          width: '8px',
          height: '8px',
          border: '2px solid #fff',
          opacity: !data?.isExpanded ? 0 : 1,
          transition: 'opacity 0.3s ease'
        }}
      />
    </div>
  );

  return (
    <BaseNode
      id={id}
      type="ImageNode"
      label={titleContent}
      data={{
        ...data,
        isExpanded: data.isExpanded ?? true,
        label: titleContent,
        image,
        previewUrl
      }}
      content={nodeContent}
      {...props}
    />
  );
}; 