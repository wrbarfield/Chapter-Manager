
import React from 'react';
import { Member, MONTHS } from '../types';

interface DashboardProps {
  members: Member[];
  themeColor: string;
  themeMode: 'light' | 'dark';
}

const Dashboard: React.FC<DashboardProps> = ({ members, themeColor, themeMode }) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const isLight = themeMode === 'light';

  /**
   * Chapter Rule: Nomination Eligibility Period
   * Specifically April (index 3) through September (index 8).
   */
  const nominationMonths: { m: number, y: number, name: string }[] = [];
  for (let m = 3; m <= 8; m++) {
    nominationMonths.push({ m, y: currentYear, name: MONTHS[m] });
  }

  /**
   * Chapter Rule: Voting Eligibility Period
   * Specifically May (index 4) through October (index 9).
   */
  const votingMonths: { m: number, y: number, name: string }[] = [];
  for (let m = 4; m <= 9; m++) {
    votingMonths.push({ m, y: currentYear, name: MONTHS[m] });
  }

  const getEligibleList = (periodMonths: { m: number, y: number, name: string }[]) => {
    return members.map(member => {
      let count = 0;
      periodMonths.forEach(period => {
        if (member.attendance[period.y]?.[period.m]) {
          count++;
        }
      });
      return { ...member, eligibilityCount: count };
    }).filter(m => m.eligibilityCount >= 3)
      .sort((a, b) => b.eligibilityCount - a.eligibilityCount);
  };

  const eligibleNomination = getEligibleList(nominationMonths);
  const eligibleVote = getEligibleList(votingMonths);

  // Stats calculations for chart
  const totalMembers = members.length;
  
  const monthlyStats = MONTHS.map((monthName, index) => {
    const attendedCount = members.filter(m => m.attendance[currentYear]?.[index]).length;
    const percent = totalMembers > 0 ? (attendedCount / totalMembers) * 100 : 0;
    return {
      month: monthName,
      count: attendedCount,
      percent: percent
    };
  });

  const hasAnyData = monthlyStats.some(s => s.percent > 0);

  const cardBase = isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-800/50 border-slate-700/50';
  const textPrimary = isLight ? 'text-slate-900' : 'text-slate-200';
  const textSecondary = isLight ? 'text-slate-500' : 'text-slate-400';

  const EligibilityList = ({ title, periodLabel, list }: { title: string, periodLabel: string, list: any[] }) => (
    <section className={`${cardBase} p-5 rounded-2xl border transition-colors`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${textPrimary}`}>
            <span className={`w-1 h-4 bg-${themeColor}-600 rounded-full transition-colors`}></span>
            {title}
          </h2>
          <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-wider">
            Period: {periodLabel}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase ${isLight ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-slate-400'}`}>
          3+ Meetings
        </div>
      </div>

      {list.length > 0 ? (
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {list.map(member => (
            <div key={member.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isLight ? 'bg-slate-50 border-slate-100' : 'bg-slate-900/50 border-slate-700/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border overflow-hidden ${isLight ? 'bg-white border-slate-200' : 'bg-slate-800 border-slate-700'}`}>
                  {member.photo ? (
                    <img src={member.photo} alt={member.firstName} className="w-full h-full object-cover" />
                  ) : (
                    <span>{member.firstName[0]}{member.lastName[0]}</span>
                  )}
                </div>
                <div>
                  <p className={`text-xs font-bold ${textPrimary}`}>
                    {member.firstName} {member.lastName}
                  </p>
                  {member.roadName && (
                    <p className={`text-[10px] font-bold text-${themeColor}-500 italic`}>"{member.roadName}"</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black tracking-tighter uppercase transition-colors bg-${themeColor}-600/10 text-${themeColor}-500`}>
                  {member.eligibilityCount} Attended
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 opacity-50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">No members meeting threshold</p>
        </div>
      )}
    </section>
  );

  return (
    <div className="space-y-6 pb-6">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1">
        <div className={`${cardBase} p-6 rounded-2xl border flex flex-col items-center justify-center text-center transition-colors`}>
          <span className={`text-4xl font-black text-${themeColor}-500 transition-colors`}>{totalMembers}</span>
          <span className={`text-xs font-bold uppercase tracking-[0.2em] mt-2 ${textSecondary}`}>Member Total</span>
        </div>
      </div>

      {/* Attendance Trend Chart */}
      <section className={`${cardBase} p-5 rounded-2xl border transition-colors relative`}>
        <h2 className={`text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 ${textPrimary}`}>
          <span className={`w-1 h-4 bg-${themeColor}-600 rounded-full transition-colors`}></span>
          Attendance Trend {currentYear}
        </h2>
        
        <div className="relative h-40 flex items-end justify-between gap-1.5 px-1 pt-4">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 border-b border-slate-500 pb-8 mt-4">
             <div className="border-t border-slate-500 w-full"></div>
             <div className="border-t border-slate-500 w-full"></div>
             <div className="border-t border-slate-500 w-full"></div>
          </div>

          {monthlyStats.map((stat, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group h-full">
              <div className="flex-1 w-full flex items-end justify-center relative mb-2">
                <div className={`w-full max-w-[12px] rounded-t-full transition-all bg-slate-500/10 h-full absolute bottom-0`}></div>
                <div 
                  className={`w-full max-w-[12px] rounded-t-full transition-all bg-${themeColor}-500 shadow-[0_0_10px_rgba(0,0,0,0.3)] z-10`}
                  style={{ height: `${Math.max(stat.percent, 0)}%` }}
                >
                  {stat.percent > 0 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[8px] py-0.5 px-1 rounded whitespace-nowrap z-20 font-bold border border-slate-700">
                      {stat.count}
                    </div>
                  )}
                </div>
              </div>
              <span className={`text-[8px] font-bold ${stat.percent > 0 ? `text-${themeColor}-500` : 'text-slate-500'} uppercase transition-colors`}>
                {stat.month}
              </span>
            </div>
          ))}
        </div>

        {!hasAnyData && (
          <div className="absolute inset-0 flex items-center justify-center pt-10 pointer-events-none">
            <p className="text-[10px] font-bold uppercase text-slate-500/50 tracking-[0.2em]">No attendance recorded</p>
          </div>
        )}
      </section>

      {/* Eligible Nomination Section */}
      <EligibilityList 
        title="Eligible Nomination" 
        periodLabel={`${nominationMonths[0].name} ${currentYear} — ${nominationMonths[nominationMonths.length-1].name} ${currentYear}`}
        list={eligibleNomination}
      />

      {/* Eligible Vote Section */}
      <EligibilityList 
        title="Eligible Vote" 
        periodLabel={`${votingMonths[0].name} ${currentYear} — ${votingMonths[votingMonths.length-1].name} ${currentYear}`}
        list={eligibleVote}
      />

      <div className="px-4">
        <p className="text-[8px] text-slate-500 font-medium italic leading-relaxed text-center opacity-60">
          * Active Status: Attendance at 3+ meetings in the specific 6-month period is required for voting and nominations.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
