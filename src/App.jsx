import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import ScrollManager from './components/ScrollManager.jsx';
import Home from './pages/Home.jsx';
import WorkDetail from './pages/WorkDetail.jsx';
import WritingDetail from './pages/WritingDetail.jsx';
import Experience from './pages/Experience.jsx';
import NotFound from './pages/NotFound.jsx';

/**
 * App.jsx: the page frame and the list of routes.
 * To add a new page: create src/pages/MyPage.jsx and add a <Route> below.
 */
export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollManager />
      <Nav />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<WorkDetail />} />
          <Route path="/writing/:slug" element={<WritingDetail />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
