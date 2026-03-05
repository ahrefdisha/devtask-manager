import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
}

const STATUSES = ['todo', 'in_progress', 'done'];

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');

  const fetchTasks = async () => {
    const res = await api.get(`/tasks?projectId=${id}`);
    setTasks(res.data.tasks);
  };

  useEffect(() => { fetchTasks(); }, [id]);

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.post('/tasks', { title, description, projectId: Number(id), priority });
    setTitle(''); setDescription(''); setPriority('medium'); setShowForm(false);
    fetchTasks();
  };

  const updateStatus = async (taskId: number, status: string) => {
    await api.patch(`/tasks/${taskId}`, { status });
    fetchTasks();
  };

  const priorityColor: Record<string, string> = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/')}>← Back</button>
        <h1 style={styles.title}>Project Tasks</h1>
        <button style={styles.button} onClick={() => setShowForm(!showForm)}>+ New Task</button>
      </div>

      {showForm && (
        <form onSubmit={createTask} style={styles.form}>
          <input style={styles.input} placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} required />
          <input style={styles.input} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
          <select style={styles.input} value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button style={styles.button} type="submit">Create Task</button>
        </form>
      )}

      <div style={styles.board}>
        {STATUSES.map(status => (
          <div key={status} style={styles.column}>
            <h3 style={styles.columnTitle}>{status.replace('_', ' ').toUpperCase()}</h3>
            {tasks.filter(t => t.status === status).map(task => (
              <div key={task.id} style={styles.taskCard}>
                <div style={styles.taskHeader}>
                  <span style={styles.taskTitle}>{task.title}</span>
                  <span style={{ ...styles.priority, background: priorityColor[task.priority] }}>{task.priority}</span>
                </div>
                {task.description && <p style={styles.taskDesc}>{task.description}</p>}
                <select
                  style={styles.statusSelect}
                  value={task.status}
                  onChange={e => updateStatus(task.id, e.target.value)}
                >
                  {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
            ))}
            {tasks.filter(t => t.status === status).length === 0 && (
              <p style={styles.empty}>No tasks</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
  title: { fontSize: '24px', color: '#1a1a2e', margin: 0 },
  backBtn: { padding: '8px 16px', background: 'transparent', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer' },
  button: { padding: '10px 20px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  form: { background: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap', boxShadow: '0 2px 10px rgba(0,0,0,0.08)' },
  input: { flex: 1, minWidth: '160px', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  board: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
  column: { background: '#f8fafc', borderRadius: '12px', padding: '16px', minHeight: '400px' },
  columnTitle: { margin: '0 0 16px', fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  taskCard: { background: '#fff', borderRadius: '8px', padding: '14px', marginBottom: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  taskHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' },
  taskTitle: { fontWeight: 600, fontSize: '14px', color: '#1a1a2e' },
  priority: { fontSize: '11px', color: '#fff', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 },
  taskDesc: { fontSize: '13px', color: '#666', margin: '0 0 10px' },
  statusSelect: { width: '100%', padding: '6px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', background: '#f8fafc' },
  empty: { color: '#cbd5e1', fontSize: '13px', textAlign: 'center', marginTop: '20px' },
};
