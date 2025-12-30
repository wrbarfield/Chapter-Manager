
import React, { useState, useEffect, useRef } from 'react';
import { Member } from '../types';

interface MemberFormProps {
  onAdd: (member: Member) => void;
  onUpdate?: (member: Member) => void;
  onCancel?: () => void;
  initialData?: Member | null;
  themeColor: string;
  themeMode: 'light' | 'dark';
}

const MemberForm: React.FC<MemberFormProps> = ({ onAdd, onUpdate, onCancel, initialData, themeColor, themeMode }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    roadName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    membershipNo: '',
    photo: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isLight = themeMode === 'light';

  useEffect(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        roadName: initialData.roadName || '',
        email: initialData.email || '',
        address: initialData.address || '',
        city: initialData.city || '',
        state: initialData.state || '',
        zip: initialData.zip || '',
        phone: initialData.phone || '',
        membershipNo: initialData.membershipNo || '',
        photo: initialData.photo || '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        roadName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        membershipNo: '',
        photo: '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName) return;

    if (initialData && onUpdate) {
      onUpdate({
        ...initialData,
        ...formData,
      });
    } else {
      const newMember: Member = {
        ...formData,
        id: crypto.randomUUID(),
        joinDate: new Date().toISOString(),
        attendance: {},
      };
      onAdd(newMember);
    }

    if (!initialData) {
      setFormData({
        firstName: '',
        lastName: '',
        roadName: '',
        email: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
        membershipNo: '',
        photo: '',
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClasses = `w-full border rounded-lg px-3 py-2 outline-none text-sm transition-all focus:ring-1 focus:ring-${themeColor}-500 ${
    isLight ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400' : 'bg-slate-900 border-slate-700 text-white'
  }`;

  const labelClasses = `block text-[10px] font-bold uppercase mb-1 ${isLight ? 'text-slate-500' : 'text-slate-500'}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Photo Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div 
            className={`w-32 h-32 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'
            } hover:border-${themeColor}-500 relative group shadow-inner`}
          >
            {formData.photo ? (
              <img src={formData.photo} alt="Member preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-slate-500">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-[8px] font-bold uppercase mt-1">No Photo</span>
              </div>
            )}
          </div>
        </div>

        {/* Upload Control */}
        <div className="flex gap-2 mt-4">
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
              isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
            } hover:border-${themeColor}-500 shadow-sm active:scale-95`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Photo
          </button>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handlePhotoUpload} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>First Name</label>
          <input name="firstName" value={formData.firstName} onChange={handleChange} required className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Last Name</label>
          <input name="lastName" value={formData.lastName} onChange={handleChange} required className={inputClasses} />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Road Name</label>
        <input name="roadName" placeholder='e.g. "Ghost Rider"' value={formData.roadName} onChange={handleChange} className={`${inputClasses} font-bold text-${themeColor}-500`} />
      </div>

      <div>
        <label className={labelClasses}>Email Address</label>
        <input name="email" type="email" placeholder="rider@example.com" value={formData.email} onChange={handleChange} className={inputClasses} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClasses}>Member ID</label>
          <input name="membershipNo" value={formData.membershipNo} onChange={handleChange} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Phone</label>
          <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputClasses} />
        </div>
      </div>

      <div>
        <label className={labelClasses}>Address</label>
        <input name="address" value={formData.address} onChange={handleChange} className={`${inputClasses} mb-2`} />
        <div className="grid grid-cols-3 gap-2">
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} className={inputClasses} />
          <input name="state" placeholder="ST" value={formData.state} onChange={handleChange} className={inputClasses} />
          <input name="zip" placeholder="Zip" value={formData.zip} onChange={handleChange} className={inputClasses} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {initialData && onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className={`flex-1 font-bold py-3 rounded-xl transition-all active:scale-95 ${
              isLight ? 'bg-slate-200 hover:bg-slate-300 text-slate-700' : 'bg-slate-700 hover:bg-slate-600 text-white'
            }`}
          >
            CANCEL
          </button>
        )}
        <button type="submit" className={`flex-[2] bg-${themeColor}-600 hover:bg-${themeColor}-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95 shadow-lg shadow-${themeColor}-900/20 uppercase tracking-widest text-xs`}>
          {initialData ? 'Update Profile' : 'Add Member'}
        </button>
      </div>
    </form>
  );
};

export default MemberForm;
