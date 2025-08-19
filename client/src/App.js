import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// --- API Service Configuration ---
const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('userInfo')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('userInfo')).token}`;
  }
  return req;
});


// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'register', 'dashboard', 'tasks', 'profile', 'documents', 'training', 'salary'
  const [isChatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userInfo');
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setCurrentView('dashboard');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('userInfo', JSON.stringify(userData));
    setUser(userData);
    setCurrentView('dashboard');
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setCurrentView('login');
  };

  const navigate = (view) => {
    setCurrentView(view);
  };

  const renderView = () => {
    const pages = {
      login: <LoginPage onLoginSuccess={handleLoginSuccess} switchToRegister={() => navigate('register')} />,
      register: <RegisterPage switchToLogin={() => navigate('login')} />,
      dashboard: <DashboardPage user={user} onLogout={handleLogout} navigate={navigate} setChatOpen={setChatOpen} />,
      tasks: <OnboardingTasksPage user={user} onLogout={handleLogout} navigate={navigate} setChatOpen={setChatOpen} />,
      profile: <ProfilePage user={user} onLogout={handleLogout} navigate={navigate} setChatOpen={setChatOpen} />,
      documents: <DocumentsPage user={user} onLogout={handleLogout} navigate={navigate} setChatOpen={setChatOpen} />,
      training: <TrainingPage user={user} onLogout={handleLogout} navigate={navigate} setChatOpen={setChatOpen} />,
      salary: <SalaryPage user={user} onLogout={handleLogout} navigate={navigate} setChatOpen={setChatOpen} />,
    };

    return (
      <>
        {pages[currentView] || pages.login}
        {user && <Chatbot isOpen={isChatOpen} onClose={() => setChatOpen(false)} user={user} />}
      </>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {renderView()}
    </div>
  );
}


// --- Login Page Component ---
function LoginPage({ onLoginSuccess, switchToRegister }) {
  const [email, setEmail] = useState('employee@test.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { data } = await API.post('/api/users/login', { email, password });
      onLoginSuccess(data);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">Tushar Polymers</h1>
        <h2 className="text-xl font-semibold text-center text-gray-600">Employee Portal Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          <div>
            <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <button onClick={switchToRegister} className="font-medium text-blue-600 hover:underline">Register</button>
        </p>
      </div>
    </div>
  );
}

// --- Register Page Component ---
function RegisterPage({ switchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsLoading(true);
        try {
            await API.post('/api/users/register', { name, email, password, role: 'employee' });
            setSuccess('Registration successful! Please log in.');
            setTimeout(() => switchToLogin(), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-3xl font-bold text-center text-gray-800">Create Account</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Priyanshu Indra" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="you@example.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Minimum 8 characters" />
                    </div>
                    {error && <p className="text-sm text-center text-red-600">{error}</p>}
                    {success && <p className="text-sm text-center text-green-600">{success}</p>}
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400">
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <button onClick={switchToLogin} className="font-medium text-blue-600 hover:underline">Sign In</button>
                </p>
            </div>
        </div>
    );
}

// --- Sidebar Component (Reusable) ---
const Sidebar = ({ onLogout, navigate, activeView }) => {
    const HomeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>);
    const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
    const DocumentIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
    const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
    const BriefcaseIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>);
    const LogoutIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>);
    const SalaryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);

    const navItemClasses = "flex items-center p-2 rounded-lg hover:bg-gray-600 transition-colors w-full text-left";
    const activeNavItemClasses = "bg-gray-700";

    return (
        <aside className="w-full md:w-64 bg-gray-800 text-white p-4 md:min-h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-8">Tushar Polymers</h1>
            <nav className="flex-grow">
                <ul>
                    <li className="mb-4"><button onClick={() => navigate('dashboard')} className={`${navItemClasses} ${activeView === 'dashboard' ? activeNavItemClasses : ''}`}><HomeIcon /><span className="ml-3">Dashboard</span></button></li>
                    <li className="mb-4"><button onClick={() => navigate('profile')} className={`${navItemClasses} ${activeView === 'profile' ? activeNavItemClasses : ''}`}><UserIcon /><span className="ml-3">My Profile</span></button></li>
                    <li className="mb-4"><button onClick={() => navigate('documents')} className={`${navItemClasses} ${activeView === 'documents' ? activeNavItemClasses : ''}`}><DocumentIcon /><span className="ml-3">Documents</span></button></li>
                    <li className="mb-4"><button onClick={() => navigate('tasks')} className={`${navItemClasses} ${activeView === 'tasks' ? activeNavItemClasses : ''}`}><CheckCircleIcon /><span className="ml-3">Onboarding Tasks</span></button></li>
                    <li className="mb-4"><button onClick={() => navigate('salary')} className={`${navItemClasses} ${activeView === 'salary' ? activeNavItemClasses : ''}`}><SalaryIcon /><span className="ml-3">Salary Details</span></button></li>
                    <li className="mb-4"><button onClick={() => navigate('training')} className={`${navItemClasses} ${activeView === 'training' ? activeNavItemClasses : ''}`}><BriefcaseIcon /><span className="ml-3">Training</span></button></li>
                </ul>
            </nav>
            <div>
                 <button onClick={onLogout} className="flex items-center w-full p-2 rounded-lg text-red-400 hover:bg-gray-600 hover:text-red-300 transition-colors">
                    <LogoutIcon />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </aside>
    );
};


// --- Dashboard Page Component ---
function DashboardPage({ user, onLogout, navigate, setChatOpen }) {
    const UserIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>);
    const DocumentIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>);
    const CheckCircleIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
    const ChatIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);
    const SalaryIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);

    const announcements = [
        { id: 1, title: "Welcome to the Team!", content: "We are thrilled to have you join us. Please complete your onboarding tasks by the end of the week.", date: "2025-08-19" },
        { id: 2, title: "All-Hands Meeting Scheduled", content: "Our quarterly all-hands meeting will be held this Friday at 10:00 AM.", date: "2025-08-18" },
    ];
    const userName = user ? user.name : 'Employee';

    return (
        <>
            <div className="flex flex-col md:flex-row">
                <Sidebar onLogout={onLogout} navigate={navigate} activeView="dashboard" />
                <main className="flex-1 p-6 md:p-10">
                    <header className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-semibold text-gray-800">Welcome, {userName}!</h2>
                        <div className="flex items-center">
                            <span className="mr-4 hidden sm:inline">{userName}</span>
                            <img src={`https://placehold.co/40x40/E2E8F0/4A5568?text=${userName.substring(0,2).toUpperCase()}`} alt="User Avatar" className="w-10 h-10 rounded-full" />
                        </div>
                    </header>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <button onClick={() => navigate('profile')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center text-left"><UserIcon /><div className="ml-4"><h3 className="font-semibold text-lg">My Profile</h3><p className="text-gray-600 text-sm">View your employee information.</p></div></button>
                        <button onClick={() => navigate('documents')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center text-left"><DocumentIcon /><div className="ml-4"><h3 className="font-semibold text-lg">Upload Documents</h3><p className="text-gray-600 text-sm">Submit your required paperwork.</p></div></button>
                        <button onClick={() => navigate('tasks')} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center text-left"><CheckCircleIcon /><div className="ml-4"><h3 className="font-semibold text-lg">View Onboarding Tasks</h3><p className="text-gray-600 text-sm">Check your to-do list to get started.</p></div></button>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800">Company Announcements</h3>
                        <div className="space-y-4">
                            {announcements.map(ann => (<div key={ann.id} className="border-l-4 border-blue-500 pl-4"><h4 className="font-bold">{ann.title}</h4><p className="text-gray-700">{ann.content}</p><p className="text-xs text-gray-500 mt-1">{ann.date}</p></div>))}
                        </div>
                    </div>
                </main>
            </div>
            <button onClick={() => setChatOpen(true)} className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <ChatIcon />
            </button>
        </>
    );
}

// --- Onboarding Tasks Page Component ---
function OnboardingTasksPage({ user, onLogout, navigate, setChatOpen }) {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const ChatIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setIsLoading(true);
                const { data } = await API.get('/api/tasks');
                setTasks(data);
            } catch (err) {
                setError('Could not fetch tasks. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    const handleToggleTask = async (taskId, currentStatus) => {
        setTasks(tasks.map(task => 
            task._id === taskId ? { ...task, isCompleted: !currentStatus } : task
        ));
        try {
            await API.put(`/api/tasks/${taskId}`, { isCompleted: !currentStatus });
        } catch (err) {
            setError('Failed to update task. Please refresh and try again.');
            setTasks(tasks.map(task => 
                task._id === taskId ? { ...task, isCompleted: currentStatus } : task
            ));
        }
    };
    
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return (
        <>
            <div className="flex flex-col md:flex-row">
                <Sidebar onLogout={onLogout} navigate={navigate} activeView="tasks" />
                <main className="flex-1 p-6 md:p-10">
                    <header className="mb-8">
                        <h2 className="text-3xl font-semibold text-gray-800">Your Onboarding Checklist</h2>
                        <p className="text-gray-600 mt-1">Complete these tasks to get started at Innovate Inc.</p>
                    </header>

                    {isLoading ? (
                        <p>Loading tasks...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="mb-6">
                                <div className="flex justify-between mb-1">
                                    <span className="text-base font-medium text-blue-700">Progress</span>
                                    <span className="text-sm font-medium text-blue-700">{completedTasks} of {totalTasks} completed</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {tasks.length > 0 ? tasks.map(task => (
                                    <div key={task._id} className={`p-4 rounded-lg flex items-center transition-colors ${task.isCompleted ? 'bg-green-50' : 'bg-gray-50'}`}>
                                        <input 
                                            type="checkbox"
                                            checked={task.isCompleted}
                                            onChange={() => handleToggleTask(task._id, task.isCompleted)}
                                            className="h-6 w-6 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <div className="ml-4">
                                            <h3 className={`font-semibold ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>{task.title}</h3>
                                            <p className={`text-sm ${task.isCompleted ? 'line-through text-gray-400' : 'text-gray-600'}`}>{task.description}</p>
                                        </div>
                                    </div>
                                )) : <p>No tasks assigned yet.</p>}
                            </div>
                        </div>
                    )}
                </main>
            </div>
            <button onClick={() => setChatOpen(true)} className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <ChatIcon />
            </button>
        </>
    );
}

// --- Profile Page Component ---
function ProfilePage({ user, onLogout, navigate, setChatOpen }) {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const ChatIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await API.get('/api/users/profile');
                setProfile(data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, []);

    return (
        <>
            <div className="flex flex-col md:flex-row">
                <Sidebar onLogout={onLogout} navigate={navigate} activeView="profile" />
                <main className="flex-1 p-6 md:p-10">
                    <header className="mb-8">
                        <h2 className="text-3xl font-semibold text-gray-800">My Profile</h2>
                    </header>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {isLoading ? <p>Loading profile...</p> : profile ? (
                            <div className="space-y-4">
                                <div><strong className="w-32 inline-block">Name:</strong> {profile.name}</div>
                                <div><strong className="w-32 inline-block">Email:</strong> {profile.email}</div>
                                <div><strong className="w-32 inline-block">Role:</strong> {profile.role}</div>
                            </div>
                        ) : <p>Could not load profile information.</p>}
                    </div>
                </main>
            </div>
            <button onClick={() => setChatOpen(true)} className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <ChatIcon />
            </button>
        </>
    );
}

// --- Documents Page Component ---
function DocumentsPage({ user, onLogout, navigate, setChatOpen }) {
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [documentType, setDocumentType] = useState('PAN');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const ChatIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);

    const fetchDocuments = async () => {
        try {
            const { data } = await API.get('/api/documents');
            setDocuments(data);
        } catch (err) {
            setError('Could not fetch documents.');
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file to upload.');
            return;
        }
        setIsLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('document', file);
        formData.append('documentType', documentType);

        try {
            await API.post('/api/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setSuccess('Document uploaded successfully!');
            setFile(null);
            e.target.reset();
            fetchDocuments(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'File upload failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex flex-col md:flex-row">
                <Sidebar onLogout={onLogout} navigate={navigate} activeView="documents" />
                <main className="flex-1 p-6 md:p-10">
                    <header className="mb-8">
                        <h2 className="text-3xl font-semibold text-gray-800">My Documents</h2>
                    </header>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Upload New Document</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Document Type</label>
                                    <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md">
                                        <option>PAN</option>
                                        <option>Aadhar</option>
                                        <option>Certificate</option>
                                        <option>OfferLetter</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Select File</label>
                                    <input type="file" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mt-1" />
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                                {success && <p className="text-sm text-green-600">{success}</p>}
                                <button type="submit" disabled={isLoading} className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                                    {isLoading ? 'Uploading...' : 'Upload'}
                                </button>
                            </form>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Submitted Documents</h3>
                            <div className="space-y-3">
                                {documents.length > 0 ? documents.map(doc => (
                                    <div key={doc._id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{doc.documentType}</p>
                                            <p className="text-sm text-gray-500">{doc.fileName}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            doc.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            doc.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>{doc.status}</span>
                                    </div>
                                )) : <p>You have not uploaded any documents yet.</p>}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <button onClick={() => setChatOpen(true)} className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <ChatIcon />
            </button>
        </>
    );
}

// --- Training Page Component ---
function TrainingPage({ user, onLogout, navigate, setChatOpen }) {
    const ChatIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);
    return (
        <>
            <div className="flex flex-col md:flex-row">
                <Sidebar onLogout={onLogout} navigate={navigate} activeView="training" />
                <main className="flex-1 p-6 md:p-10">
                    <header className="mb-8">
                        <h2 className="text-3xl font-semibold text-gray-800">Training & Development</h2>
                    </header>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-4">Available Courses</h3>
                        <p>Training modules will be listed here. This feature is coming soon!</p>
                    </div>
                </main>
            </div>
            <button onClick={() => setChatOpen(true)} className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <ChatIcon />
            </button>
        </>
    );
}

// --- Salary Page Component (NEW) ---
function SalaryPage({ user, onLogout, navigate, setChatOpen }) {
    const ChatIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>);
    
    // Static data for demonstration
    const salaryData = {
        baseSalary: 50000,
        hra: 20000,
        specialAllowance: 10000,
        providentFund: -6000,
        professionalTax: -200,
    };

    const totalEarnings = salaryData.baseSalary + salaryData.hra + salaryData.specialAllowance;
    const totalDeductions = salaryData.providentFund + salaryData.professionalTax;
    const netSalary = totalEarnings + totalDeductions;

    return (
        <>
            <div className="flex flex-col md:flex-row">
                <Sidebar onLogout={onLogout} navigate={navigate} activeView="salary" />
                <main className="flex-1 p-6 md:p-10">
                    <header className="mb-8">
                        <h2 className="text-3xl font-semibold text-gray-800">Compensation Details</h2>
                        <p className="text-gray-600 mt-1">Here is a breakdown of your monthly salary.</p>
                    </header>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Earnings</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between"><span>Base Salary:</span> <span>₹{salaryData.baseSalary.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>House Rent Allowance (HRA):</span> <span>₹{salaryData.hra.toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Special Allowance:</span> <span>₹{salaryData.specialAllowance.toLocaleString()}</span></div>
                                </div>
                                <div className="flex justify-between font-bold mt-4 pt-2 border-t">
                                    <span>Total Earnings:</span> <span>₹{totalEarnings.toLocaleString()}</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold mb-4 border-b pb-2">Deductions</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between"><span>Provident Fund (PF):</span> <span>₹{Math.abs(salaryData.providentFund).toLocaleString()}</span></div>
                                    <div className="flex justify-between"><span>Professional Tax:</span> <span>₹{Math.abs(salaryData.professionalTax).toLocaleString()}</span></div>
                                </div>
                                <div className="flex justify-between font-bold mt-4 pt-2 border-t">
                                    <span>Total Deductions:</span> <span>₹{Math.abs(totalDeductions).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 pt-4 border-t-2 border-dashed">
                            <div className="flex justify-between font-bold text-lg">
                                <span>Net Salary (Take Home):</span>
                                <span className="text-green-600">₹{netSalary.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <button onClick={() => setChatOpen(true)} className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <ChatIcon />
            </button>
        </>
    );
}

// --- Chatbot Component (NEW) ---
function Chatbot({ isOpen, onClose, user }) {
    const [messages, setMessages] = useState([
        { sender: 'bot', text: `Hi ${user.name}! I'm your onboarding assistant. How can I help you?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const { data } = await API.post('/api/chatbot/ask', { message: input });
            const botMessage = { sender: 'bot', text: data.reply };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            const errorMessage = { sender: 'bot', text: "Sorry, I'm having trouble connecting. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-8 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300">
            <header className="bg-blue-600 text-white p-3 flex justify-between items-center rounded-t-lg">
                <h3 className="font-semibold">Onboarding Assistant</h3>
                <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl leading-none">&times;</button>
            </header>
            <div className="flex-1 p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`my-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg max-w-xs ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="my-2 flex justify-start">
                        <div className="p-2 rounded-lg bg-gray-200 text-gray-800">
                           <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-2 border-t border-gray-200">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
            </form>
        </div>
    );
}
