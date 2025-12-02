
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnTete from './components/layout/EnTete';
import PiedDePage from './components/layout/PiedDePage';
import Accueil from './pages/Accueil';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Tournois from './pages/Tournois';
import DetailsTournoi from './pages/DetailsTournoi';
import Profil from './pages/Profil';
import Classement from './pages/Classement';
import './index.css';

function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <EnTete />
                <main className="flex-1">
                    <Routes>
                        <Route path="/" element={<Accueil />} />
                        <Route path="/connexion" element={<Connexion />} />
                        <Route path="/inscription" element={<Inscription />} />
                        <Route path="/tournois" element={<Tournois />} />
                        <Route path="/tournois/:id" element={<DetailsTournoi />} />
                        <Route path="/profil" element={<Profil />} />
                        <Route path="/classement" element={<Classement />} />
                    </Routes>
                </main>
                <PiedDePage />
            </div>
        </Router>
    );
}

export default App;
