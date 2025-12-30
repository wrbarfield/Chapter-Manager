
import React, { useState, useEffect } from 'react';
import { Member } from '../types';

interface MemberListProps {
  members: Member[];
  onDelete: (id: string) => void;
  onEdit: (member: Member) => void;
  themeColor: string;
  themeMode: 'light' | 'dark';
}

const MemberList: React.FC<MemberListProps> = ({ members, onDelete, onEdit, themeColor, themeMode }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const isLight = themeMode === 'light';

  // Reset confirmation state if user switches members or collapses
  useEffect(() => {
    setConfirmDeleteId(null);
  }, [expandedId]);

  // Auto-reset delete confirmation after 3 seconds
  useEffect(() => {
    if (confirmDeleteId) {
      const timer = setTimeout(() => setConfirmDeleteId(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [confirmDeleteId]);

  if (members.length === 0) {
    return (
      <div className={`text-center p-12 rounded-xl border border-dashed transition-colors ${
        isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-800/20 border-slate-700'
      }`}>
        <p className="text-slate-500 text-sm italic">No members patched in yet.</p>
      </div>
    );
  }

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirmDeleteId === id) {
      onDelete(id);
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
    }
  };

  const handleEditClick = (e: React.MouseEvent, member: Member) => {
    e.stopPropagation();
    onEdit(member);
  };

  return (
    <div className="space-y-3">
      {members.map(member => (
        <div key={member.id} className={`border rounded-xl overflow-hidden transition-all shadow-md ${
          isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'
        }`}>
          <div 
            className={`p-4 flex justify-between items-center cursor-pointer transition-colors ${
              isLight ? 'active:bg-slate-50' : 'active:bg-slate-700'
            }`}
            onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors overflow-hidden ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'
              }`}>
                {member.photo ? (
                  <img src={member.photo} alt={member.firstName} className="w-full h-full object-cover" />
                ) : (
                  <span className={`font-bold transition-colors text-${themeColor}-500`}>
                    {member.firstName[0]}{member.lastName[0]}
                  </span>
                )}
              </div>
              <div>
                <h3 className={`font-bold flex items-center gap-2 transition-colors ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                  {member.firstName} {member.lastName}
                  {member.roadName && (
                    <span className={`text-${themeColor}-500 text-xs font-bold tracking-wider transition-colors italic`}>
                      "{member.roadName}"
                    </span>
                  )}
                </h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                  #{member.membershipNo || 'NO ID'}
                </p>
              </div>
            </div>
            <svg 
              className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedId === member.id ? 'rotate-180' : ''}`} 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {expandedId === member.id && (
            <div className={`px-4 pb-4 border-t animate-in slide-in-from-top-2 duration-200 transition-colors ${
              isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-slate-900/50 border-slate-700/50'
            }`}>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-4 text-xs">
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[9px] tracking-tighter">Phone</p>
                  <p className={`mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{member.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[9px] tracking-tighter">Email</p>
                  <p className={`mt-0.5 truncate ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{member.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[9px] tracking-tighter">Location</p>
                  <p className={`mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{member.city ? `${member.city}, ${member.state}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-bold uppercase text-[9px] tracking-tighter">Zip</p>
                  <p className={`mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{member.zip || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-slate-500 font-bold uppercase text-[9px] tracking-tighter">Full Address</p>
                  <p className={`mt-0.5 ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{member.address || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button 
                  onClick={(e) => handleEditClick(e, member)}
                  className={`flex-1 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest border rounded-lg active:scale-95 transition-all text-${themeColor}-600 border-${themeColor}-600/30 hover:bg-${themeColor}-600/10`}
                >
                  EDIT PROFILE
                </button>
                <button 
                  onClick={(e) => handleDeleteClick(e, member.id)}
                  className={`flex-1 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all active:scale-95 border ${
                    confirmDeleteId === member.id 
                      ? 'bg-red-600 border-red-500 text-white animate-pulse shadow-lg shadow-red-900/40' 
                      : 'text-red-500 border-red-200 hover:bg-red-50'
                  } ${!isLight && confirmDeleteId !== member.id ? 'border-red-900/40 hover:bg-red-900/10' : ''}`}
                >
                  {confirmDeleteId === member.id ? 'CONFIRM DELETE?' : 'REMOVE MEMBER'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MemberList;
