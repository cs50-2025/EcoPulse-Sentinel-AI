import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DetectionHub from './pages/DetectionHub';
import ConservationLogs from './pages/ConservationLogs';
import { LogProvider } from './context/LogContext';

export default function App() {
  return (
    <LogProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="hub" element={<DetectionHub />} />
            <Route path="logs" element={<ConservationLogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LogProvider>
  );
}
