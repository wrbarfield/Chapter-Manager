
import React, { useState, useEffect } from 'react';
import { Member, AppTab } from './types';
import MemberForm from './components/MemberForm';
import MemberList from './components/MemberList';
import AttendanceGrid from './components/AttendanceGrid';
import LogoSection from './components/LogoSection';
import Dashboard from './components/Dashboard';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const THEME_COLORS = [
  { name: 'Orange', value: 'orange' },
  { name: 'Red', value: 'red' },
  { name: 'Blue', value: 'blue' },
  { name: 'Emerald', value: 'emerald' },
  { name: 'Purple', value: 'purple' },
  { name: 'Amber', value: 'amber' },
];

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [chapterLogo, setChapterLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState<number>(48);
  const [chapterName, setChapterName] = useState<string>("Chapter Name");
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [themeColor, setThemeColor] = useState<string>('orange');
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    const savedMembers = localStorage.getItem('mc_members');
    const savedLogo = localStorage.getItem('mc_logo');
    const savedLogoSize = localStorage.getItem('mc_logo_size');
    const savedName = localStorage.getItem('mc_name');
    const savedTheme = localStorage.getItem('mc_theme');
    const savedMode = localStorage.getItem('mc_mode') as 'light' | 'dark';
    
    if (savedMembers) setMembers(JSON.parse(savedMembers));
    if (savedLogo) setChapterLogo(savedLogo);
    if (savedLogoSize) setLogoSize(parseInt(savedLogoSize, 10));
    if (savedName) setChapterName(savedName);
    if (savedTheme) setThemeColor(savedTheme);
    if (savedMode) setThemeMode(savedMode);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('mc_members', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    if (chapterLogo) localStorage.setItem('mc_logo', chapterLogo);
  }, [chapterLogo]);

  useEffect(() => {
    localStorage.setItem('mc_logo_size', logoSize.toString());
  }, [logoSize]);

  useEffect(() => {
    localStorage.setItem('mc_name', chapterName);
  }, [chapterName]);

  useEffect(() => {
    localStorage.setItem('mc_theme', themeColor);
  }, [themeColor]);

  useEffect(() => {
    localStorage.setItem('mc_mode', themeMode);
    document.body.style.backgroundColor = themeMode === 'light' ? '#f1f5f9' : '#0f172a';
  }, [themeMode]);

  const handleAddMember = (newMember: Member) => {
    setMembers(prev => [...prev, newMember]);
  };

  const handleUpdateMember = (updatedMember: Member) => {
    setMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(prev => prev.filter(m => m.id !== id));
    if (editingMember?.id === id) setEditingMember(null);
  };

  const handleEditMember = (member: Member) => {
    setEditingMember(member);
    setActiveTab('members');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateAttendance = (memberId: string, year: number, month: number, attended: boolean) => {
    setMembers(prev => prev.map(m => {
      if (m.id === memberId) {
        const newAttendance = { ...m.attendance };
        newAttendance[year] = { ...(newAttendance[year] || {}), [month]: attended };
        return { ...m, attendance: newAttendance };
      }
      return m;
    }));
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(33, 33, 33);
    doc.text(chapterName, 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Official Member Roster - Generated on ${new Date().toLocaleDateString()}`, 14, 28);
    doc.setFontSize(10);
    doc.text(`Total Active Members: ${members.length}`, 14, 34);

    const tableColumn = ["ID", "Member Name", "Road Name", "Email", "Phone", "Location"];
    const tableRows = members.map(m => [
      m.membershipNo || '-',
      `${m.firstName} ${m.lastName}`,
      m.roadName ? `"${m.roadName}"` : '-',
      m.email || '-',
      m.phone || '-',
      m.city ? `${m.city}, ${m.state}` : '-'
    ]);

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { 
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });

    const fileName = `${chapterName.replace(/\s+/g, '_')}_Members.pdf`;
    doc.save(fileName);
  };

  const isLight = themeMode === 'light';

  return (
    <div className={`min-h-screen pb-20 max-w-lg mx-auto shadow-2xl overflow-hidden relative border-x transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-900 border-slate-200' : 'bg-slate-900 text-slate-100 border-slate-800'
    }`}>
      {/* Header - Minimum height 80px (matching footer), centered content */}
      <header className="min-h-20 py-3 bg-black border-b border-slate-800 sticky top-0 z-50 transition-colors duration-300 flex items-center justify-center px-4">
        <div className="flex flex-row items-center justify-center gap-4 max-w-full">
          {/* Text on the Left */}
          <div className="flex flex-col items-end text-right min-w-0">
            <h1 className={`text-lg md:text-xl font-bold tracking-tight text-${themeColor}-500 transition-colors duration-300 leading-none uppercase break-words`}>
              {chapterName}
            </h1>
            <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-slate-500 mt-1 whitespace-nowrap">
              Membership & Attendance
            </p>
          </div>
          
          {/* Resizable Logo - Now scales up to 100px */}
          <div 
            className="flex items-center justify-center transition-all shrink-0"
            style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
          >
            {chapterLogo ? (
              <img src={chapterLogo} alt="Chapter Logo" className="w-full h-full object-contain" />
            ) : (
              <div className="bg-slate-900 rounded-lg w-full h-full flex items-center justify-center">
                <svg className="w-1/2 h-1/2 text-slate-800" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4">
        {activeTab === 'dashboard' && (
          <Dashboard members={members} themeColor={themeColor} themeMode={themeMode} />
        )}

        {activeTab === 'members' && (
          <div className="space-y-6">
            <section className={`p-4 rounded-xl border transition-colors duration-300 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-800/50 border-slate-700/50'
            }`}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className={`w-1 h-6 bg-${themeColor}-600 rounded-full transition-colors`}></span>
                {editingMember ? 'Update Member Profile' : 'Add Member'}
              </h2>
              <MemberForm 
                onAdd={handleAddMember} 
                onUpdate={handleUpdateMember}
                onCancel={() => setEditingMember(null)}
                initialData={editingMember}
                themeColor={themeColor}
                themeMode={themeMode}
              />
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <span className={`w-1 h-6 bg-${themeColor}-600 rounded-full transition-colors`}></span>
                  Active Members ({members.length})
                </h2>
                {members.length > 0 && (
                  <button 
                    onClick={exportToPDF}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all active:scale-95 text-${themeColor}-500 border-${themeColor}-500/30 hover:bg-${themeColor}-500/10 shadow-sm`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF Export
                  </button>
                )}
              </div>
              <MemberList 
                members={members} 
                onDelete={handleDeleteMember} 
                onEdit={handleEditMember}
                themeColor={themeColor}
                themeMode={themeMode}
              />
            </section>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <section className={`p-4 rounded-xl border transition-colors duration-300 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-800/50 border-slate-700/50'
            }`}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span className={`w-1 h-6 bg-${themeColor}-600 rounded-full transition-colors`}></span>
                Monthly Attendance
              </h2>
              <AttendanceGrid 
                members={members} 
                onUpdateAttendance={handleUpdateAttendance} 
                themeColor={themeColor}
                themeMode={themeMode}
              />
            </section>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <section className={`p-6 rounded-xl border transition-colors duration-300 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-800/50 border-slate-700/50'
            }`}>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <span className={`w-1 h-6 bg-${themeColor}-600 rounded-full transition-colors`}></span>
                Chapter Settings
              </h2>
              <div className="space-y-6">
                {/* Logo Section */}
                <div className="flex flex-col items-center justify-center p-4 border-b border-slate-700/30 mb-2">
                  <label className={`block text-xs font-bold uppercase mb-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Chapter Logo</label>
                  <LogoSection logo={chapterLogo} onLogoChange={setChapterLogo} themeColor={themeColor} />
                  
                  {/* Logo Scale Slider - Range increased to 100px */}
                  <div className="w-full max-w-xs mt-6 px-2">
                    <div className="flex justify-between items-center mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Logo Scale</span>
                      <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{logoSize}px</span>
                    </div>
                    <input 
                      type="range" 
                      min="32" 
                      max="100" 
                      value={logoSize} 
                      onChange={(e) => setLogoSize(parseInt(e.target.value, 10))}
                      className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer ${isLight ? 'bg-slate-200' : 'bg-slate-700'}`}
                      style={{
                        accentColor: themeColor === 'orange' ? '#f97316' : 
                                     themeColor === 'red' ? '#ef4444' : 
                                     themeColor === 'blue' ? '#3b82f6' : 
                                     themeColor === 'emerald' ? '#10b981' : 
                                     themeColor === 'purple' ? '#a855f7' : '#f59e0b'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Chapter Name</label>
                  <input 
                    type="text" 
                    value={chapterName}
                    onChange={(e) => setChapterName(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 transition-all outline-none focus:ring-2 focus:ring-${themeColor}-500 ${
                      isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Display Mode</label>
                  <div className={`flex p-1 rounded-xl border ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-700'}`}>
                    <button 
                      onClick={() => setThemeMode('light')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        themeMode === 'light' 
                          ? `bg-white text-${themeColor}-600 shadow-sm` 
                          : 'text-slate-500 hover:text-slate-400'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.243 16.243l.707.707M7.757 7.757l.707.707M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg>
                      Light
                    </button>
                    <button 
                      onClick={() => setThemeMode('dark')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        themeMode === 'dark' 
                          ? `bg-slate-800 text-${themeColor}-500 shadow-sm` 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                      Dark
                    </button>
                  </div>
                </div>

                <div>
                  <label className={`block text-xs font-bold uppercase mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Primary App Color</label>
                  <div className="grid grid-cols-3 gap-2">
                    {THEME_COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setThemeColor(color.value)}
                        className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                          themeColor === color.value 
                            ? isLight ? `bg-${color.value}-50 border-${color.value}-500` : `bg-${color.value}-600/20 border-${color.value}-500` 
                            : isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-${color.value}-500 shadow-sm shadow-black/50`}></div>
                        <span className={`text-[10px] font-bold uppercase ${isLight ? 'text-slate-700' : 'text-slate-200'}`}>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full bg-${themeColor}-600 hover:bg-${themeColor}-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Bottom Navigation - Fixed height exactly 80px (h-20) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto backdrop-blur-xl border-t border-slate-800 bg-black flex justify-around items-center h-20 z-50 transition-colors duration-300">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? `text-${themeColor}-500` : 'text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          <span className="text-[10px] font-bold uppercase">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('members')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'members' ? `text-${themeColor}-500` : 'text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.481 12.012a4.5 4.5 0 11-1.427-1.427" /></svg>
          <span className="text-[10px] font-bold uppercase">Members</span>
        </button>
        <button 
          onClick={() => setActiveTab('attendance')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'attendance' ? `text-${themeColor}-500` : 'text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
          <span className="text-[10px] font-bold uppercase">Attendance</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'settings' ? `text-${themeColor}-500` : 'text-slate-500'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-[10px] font-bold uppercase">Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
