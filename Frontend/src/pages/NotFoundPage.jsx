import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../NotFoundPage.css';

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [angle, setAngle] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = ((e.clientX / window.innerWidth) - 0.5) * 30;
      const y = ((e.clientY / window.innerHeight) - 0.5) * 30;
      setAngle({ x: y, y: x });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="glass-404-container">
      <div
        className="glass-card"
        style={{
          transform: `rotateX(${angle.x}deg) rotateY(${angle.y}deg)`
        }}
      >
        <h1 className="glass-404">404</h1>
        <p className="glass-subtitle">Oops! Page Not Found</p>
        <p className="glass-desc">This page doesn't exist or has been moved.</p>
        <button onClick={() => navigate('/')} className="glass-button">
          Go Home
        </button>
      </div>
    </div>
  );
}
