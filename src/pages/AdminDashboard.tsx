import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Users, FileText, Calendar, Search, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import techwonLogo from '@/assets/techwon-logo.jpg';

interface Submission {
  id: number;
  name: string;
  email: string;
  service: string;
  message: string;
  date: string;
  notes: string;
}

// Demo data for first load
const demoSubmissions: Submission[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    service: 'Website Development',
    message: 'Looking for a complete website redesign for my e-commerce business.',
    date: new Date(Date.now() - 86400000).toISOString(),
    notes: '',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    email: 'sarah@startup.io',
    service: 'AI Agents',
    message: 'Need an AI chatbot for customer support integration.',
    date: new Date(Date.now() - 172800000).toISOString(),
    notes: 'Follow up scheduled',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@company.com',
    service: 'Digital Marketing',
    message: 'Want to improve our online presence and SEO rankings.',
    date: new Date(Date.now() - 259200000).toISOString(),
    notes: '',
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    // Check auth
    const isAdmin = localStorage.getItem('techwon-admin');
    if (!isAdmin) {
      navigate('/admin');
      return;
    }

    // Load submissions
    const stored = localStorage.getItem('techwon-submissions');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSubmissions(parsed.length > 0 ? parsed : demoSubmissions);
    } else {
      setSubmissions(demoSubmissions);
      localStorage.setItem('techwon-submissions', JSON.stringify(demoSubmissions));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('techwon-admin');
    toast.success('Logged out successfully');
    navigate('/admin');
  };

  const handleDelete = (id: number) => {
    const updated = submissions.filter((s) => s.id !== id);
    setSubmissions(updated);
    localStorage.setItem('techwon-submissions', JSON.stringify(updated));
    setSelectedSubmission(null);
    toast.success('Submission deleted');
  };

  const handleNotesUpdate = (id: number, notes: string) => {
    const updated = submissions.map((s) => (s.id === id ? { ...s, notes } : s));
    setSubmissions(updated);
    localStorage.setItem('techwon-submissions', JSON.stringify(updated));
    toast.success('Notes updated');
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: submissions.length,
    today: submissions.filter(
      (s) => new Date(s.date).toDateString() === new Date().toDateString()
    ).length,
    services: [...new Set(submissions.map((s) => s.service))].length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-card border-b border-border/50 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <img src={techwonLogo} alt="TECHWON" className="h-8 w-auto" />
            <span className="text-foreground-muted text-sm">Admin Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-foreground-muted hover:text-destructive transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-foreground-muted text-sm">Total Submissions</p>
                <p className="font-display text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-foreground-muted text-sm">Today</p>
                <p className="font-display text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-foreground-muted text-sm">Services Requested</p>
                <p className="font-display text-2xl font-bold">{stats.services}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search submissions..."
              className="w-full pl-10 pr-4 py-3 rounded-lg bg-background-card border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
            />
          </div>
        </div>

        {/* Submissions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 text-sm font-medium text-foreground-muted">Name</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground-muted">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground-muted">Service</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground-muted">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-foreground-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-foreground-muted">
                      No submissions found
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="border-b border-border/30 hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <td className="p-4">
                        <p className="font-medium">{submission.name}</p>
                      </td>
                      <td className="p-4 text-foreground-secondary">{submission.email}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {submission.service}
                        </span>
                      </td>
                      <td className="p-4 text-foreground-muted text-sm">
                        {new Date(submission.date).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(submission.id);
                          }}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Detail Modal */}
        {selectedSubmission && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedSubmission(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-6 max-w-lg w-full neon-border"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl font-bold mb-4">Submission Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-foreground-muted text-sm">Name</p>
                  <p className="font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <p className="text-foreground-muted text-sm">Email</p>
                  <p className="font-medium">{selectedSubmission.email}</p>
                </div>
                <div>
                  <p className="text-foreground-muted text-sm">Service</p>
                  <p className="font-medium text-primary">{selectedSubmission.service}</p>
                </div>
                <div>
                  <p className="text-foreground-muted text-sm">Message</p>
                  <p className="text-foreground-secondary">{selectedSubmission.message}</p>
                </div>
                <div>
                  <p className="text-foreground-muted text-sm">Date</p>
                  <p className="text-foreground-secondary">
                    {new Date(selectedSubmission.date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-foreground-muted text-sm mb-2">Notes</p>
                  <textarea
                    value={selectedSubmission.notes}
                    onChange={(e) => {
                      setSelectedSubmission({ ...selectedSubmission, notes: e.target.value });
                    }}
                    onBlur={() => handleNotesUpdate(selectedSubmission.id, selectedSubmission.notes)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border focus:border-primary outline-none text-sm resize-none"
                    rows={3}
                    placeholder="Add notes..."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => handleDelete(selectedSubmission.id)}
                  className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="btn-primary text-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
