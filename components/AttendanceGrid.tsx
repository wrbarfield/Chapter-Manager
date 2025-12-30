
import React, { useState } from 'react';
import { Member, MONTHS } from '../types';

interface AttendanceGridProps {
  members: Member[];
  onUpdateAttendance: (memberId: string, year: number, month: number, attended: boolean) => void;
  themeColor: string;
  themeMode: 'light' | 'dark';
}

const AttendanceGrid: React.FC<AttendanceGridProps> = ({ members, onUpdateAttendance, themeColor, themeMode }) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const isLight = themeMode === 'light';

  if (members.length === 0) {
    return (
      <div className={`text-center p-8 rounded-xl border border-dashed transition-colors ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/20 border-slate-700'
      }`}>
        <p className="text-slate-500 text-sm italic uppercase tracking-widest">No members added yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Year Selector */}
      <div className={`flex justify-between items-center p-4 rounded-xl border shadow-lg transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-950 border-slate-800'
      }`}>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentYear(prev => prev - 1)}
            className={`p-2 rounded-full transition-colors text-slate-400 hover:text-${themeColor}-500 ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800'}`}
            aria-label="Previous Year"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
        </div>

        <div className="text-center flex flex-col items-center">
          <span className={`text-2xl font-black tracking-[0.3em] font-mono leading-none transition-colors text-${themeColor}-500`}>
            {currentYear}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setCurrentYear(prev => prev + 1)}
            className={`p-2 rounded-full transition-colors text-slate-400 hover:text-${themeColor}-500 ${isLight ? 'hover:bg-slate-50' : 'hover:bg-slate-800'}`}
            aria-label="Next Year"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {members.map(member => (
          <div key={member.id} className={`rounded-xl border p-4 shadow-sm transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <div className="overflow-hidden">
                <h3 className={`text-sm font-bold truncate ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                  {member.firstName} {member.lastName}
                </h3>
                {member.roadName && (
                  <p className={`text-${themeColor}-500 text-[10px] font-black uppercase italic tracking-wider truncate transition-colors`}>
                    "{member.roadName}"
                  </p>
                )}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                #{member.membershipNo || '??'}
              </div>
            </div>
            
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {MONTHS.map((month, index) => {
                const isAttended = !!member.attendance[currentYear]?.[index];
                return (
                  <button 
                    key={month}
                    onClick={() => onUpdateAttendance(
                      member.id, 
                      currentYear, 
                      index, 
                      !isAttended
                    )}
                    className={`group flex flex-col items-center justify-center pt-1.5 pb-2 rounded-lg border transition-all active:scale-95 ${
                      isAttended 
                        ? `bg-${themeColor}-600 border-${themeColor}-400 shadow-md` 
                        : isLight ? 'bg-slate-50 border-slate-200 hover:border-slate-300' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    <span className={`text-[8px] font-bold uppercase mb-1 tracking-tighter transition-colors ${isAttended ? 'text-white' : 'text-slate-500'}`}>
                      {month}
                    </span>
                    <div className="flex items-center justify-center h-4 w-4">
                      {isAttended ? (
                         <svg className="w-4 h-4 text-white drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                         </svg>
                      ) : (
                        <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isLight ? 'bg-slate-300 group-hover:bg-slate-400' : 'bg-slate-700 group-hover:bg-slate-500'}`}></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded shadow-sm border border-${themeColor}-400 bg-${themeColor}-600 flex items-center justify-center transition-colors`}>
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attended</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`}></div>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absent</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceGrid;
