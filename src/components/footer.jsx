import React from "react";
import { ShieldCheck } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    // ลดความทึบของพื้นหลัง เพิ่มความเบลอ (Glassmorphism) และปรับเส้นขอบให้บางลง
    <footer className="mt-auto w-full border-t border-slate-800/40 bg-slate-950/40 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        
        {/* Left Section - โลโก้ ชื่อระบบ และลิขสิทธิ์ (รวมกันให้ดูคลีน) */}
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-semibold text-slate-200 tracking-wide">
            StudyClass
          </span>
          <span className="hidden sm:inline text-slate-700">|</span>
          <span className="font-medium text-slate-500">
            &copy; {year} All rights reserved.
          </span>
        </div>

        {/* Right Section - สถานะเซิร์ฟเวอร์แบบมินิมอล และเลขเวอร์ชัน */}
        <div className="flex items-center gap-3">
          {/* Server Status Indicator */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/50 border border-slate-700/30">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-medium text-slate-400 tracking-wider uppercase">
              System Online
            </span>
          </div>

          <span className="hidden sm:inline text-slate-700">•</span>

          {/* Build Version */}
          <span className="text-[10px] font-medium text-slate-500 tracking-wider uppercase">
            v1.0.0
          </span>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;