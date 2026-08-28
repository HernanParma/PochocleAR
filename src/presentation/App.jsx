import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar.jsx';
import { Footer } from './components/Footer/Footer.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { HomeView } from './views/HomeView.jsx';
import { SearchView } from './views/SearchView.jsx';
import { DetailView } from './views/DetailView.jsx';
import { WishlistView } from './views/WishlistView.jsx';
import { HistoryView } from './views/HistoryView.jsx';
import { ContactView } from './views/ContactView.jsx';

export function App() {
  return (
    <WishlistProvider>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomeView />} />
            <Route path="/buscar" element={<SearchView />} />
            <Route path="/lista-deseos" element={<WishlistView />} />
            <Route path="/historial" element={<HistoryView />} />
            <Route path="/contacto" element={<ContactView />} />
            <Route path="/:mediaType/:id" element={<DetailView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </WishlistProvider>
  );
}
