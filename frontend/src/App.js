import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import UI from './ui';
import Toolbar from './toolbar';
import { SubmitButton } from './submit';
import 'reactflow/dist/style.css';

const App = () => {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <ReactFlowProvider>
        <UI />
        <Toolbar />
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          zIndex: 4
        }}>
      <SubmitButton />
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default App;
