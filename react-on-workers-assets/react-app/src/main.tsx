import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Routes, Route } from 'react-router';
import Page from './pages/Page.tsx';
import Homepage from './pages/Homepage.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<App />
			<Routes>
				<Route path="/" element={<Homepage />} />
				<Route path="/page" element={<Page />} />
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
