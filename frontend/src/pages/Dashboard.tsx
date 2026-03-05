import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const fetchProjects = async () => {
    const res = await api.get('/projects');
    setProjects(res.data.projects);
  };

  useEffect(() => { fetchProjects(); }, []);

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/projects', { name, description });
    setName(''); setDescription(''); setShowForm(false);
    fetchProjects();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Projects</h1>
        <div style={styles.headerActions}>
          <button style={styles.button} onClick={() => setShowForm(!showForm)}>+ New Project</button>
          <button style={styles.logoutBtn} onClick={() => { logout(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={createProject} style={styles.form}>
          <input style={styles.input} placeholder="Project name" value={name} onChange={e => setName(e.target.value)} required />
          <input style={styles.input} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <button style={styles.button} type="submit">Create</button>
        </form>
      )}

      <div style={styles.grid}>
        {projects.map(p => (
          <div key={p.id} style={styles.card} onClick={() => navigate(`/projects/${p.id}`)}>
            <h3 style={styles.cardTitle}>{p.name}</h3>
            <p style={styles.cardDesc}>{p.description || 'No description'}</p>
            <p style={styles.cardDate}>{new Date(p.created_at).toLocaleDateString()}</p>
          </div>
        ))}
        {projects.length === 0 && <p style={styles.empty}>No projects yet. Create your first one!</p>}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  headerActions: { display: 'flex', gap: '12px' },
  title: { fontSize: '28px', color: '#1a1a2e', margin: 0 },
  form: { background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  input: { flex: 1, minWidth: '200px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  button: { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  logoutBtn: { padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' },
  card: { background: '#fff', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s' },
  cardTitle: { margin: '0 0 8px', fontSize: '18px', color: '#1a1a2e' },
  cardDesc: { margin: '0 0 12px', color: '#666', fontSize: '14px' },
  cardDate: { margin: 0, color: '#999', fontSize: '12px' },
  empty: { color: '#999', gridColumn: '1/-1' },
};
