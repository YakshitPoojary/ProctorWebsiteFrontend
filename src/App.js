import React from 'react';
import './App.css';
import Layout from './Layout';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthHook } from './components/Login/AuthHook';

function App() {
  return (
    <AuthHook>
      <Router>
        <div className="App">
          <Layout />
        </div>
      </Router>
    </AuthHook>
  );
}

export default App;
