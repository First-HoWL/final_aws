import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './Layout.css';
 
export default function Layout({ user, setUser }) {
  return (
    <div className="layout">
      <Navbar user={user} />
      
      <main className="layout__main">
        <Outlet context={{ user, setUser }} />
      </main>
      
      <Footer />
    </div>
  );
}
