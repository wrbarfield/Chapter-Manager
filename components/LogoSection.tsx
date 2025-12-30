
import React, { useRef } from 'react';

interface LogoSectionProps {
  logo: string | null;
  onLogoChange: (logo: string) => void;
  themeColor: string;
}

const LogoSection: React.FC<LogoSectionProps> = ({ logo, onLogoChange, themeColor }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onLogoChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group shrink-0">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`w-24 h-24 rounded-2xl bg-slate-900 flex items-center justify-center overflow-hidden cursor-pointer hover:bg-slate-800 transition-all shadow-xl`}
      >
        {logo ? (
          <img src={logo} alt="Chapter Logo" className="w-full h-full object-contain" />
        ) : (
          <div className="flex flex-col items-center justify-center gap-1">
            <svg className="w-10 h-10 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-[8px] font-bold text-slate-600 uppercase">Upload</span>
          </div>
        )}
      </div>
      <div className={`absolute bottom-0 right-0 bg-${themeColor}-600 rounded-full p-2 border-4 border-slate-950 transition-colors shadow-lg cursor-pointer hover:bg-${themeColor}-500`} onClick={() => fileInputRef.current?.click()}>
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleLogoUpload} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

export default LogoSection;
