import { GraduationCap, LogOut, User, Settings, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [token, setToken] = useState();
  const locationRoute = useLocation();

  const getToken = () => {
    try {
      const tokenString = localStorage.getItem("loginToken");
      if (!tokenString) {
        // ถ้าไม่มี token และไม่ได้อยู่ที่หน้า login (/) ให้ redirect
        if (location.pathname !== "/") {
           location.href = "/";
        }
        return;
      }
      const tokenData = JSON.parse(tokenString);
      setToken(tokenData?.data);
    } catch (error) {
      console.error("Error parsing token:", error);
      localStorage.removeItem("loginToken");
      location.href = "/";
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  const handleLogout = () => {
    // ใช้ confirm แทน alert เพื่อความทันสมัย
    if (window.confirm("ต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("loginToken");
      location.href = "/";
    }
  };

  // สร้าง Component ย่อยสำหรับ Link เพื่อลด code ที่ซ้ำซ้อนและคุม design ได้ง่าย
  const NavLink = ({ to, children, icon: Icon }) => {
    const isActive = locationRoute.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group
          ${isActive 
            ? "bg-blue-800/50 text-white shadow-sm border border-blue-700/50" 
            : "text-blue-200 hover:text-white hover:bg-blue-800/30"
          }`}
      >
        {Icon && <Icon className={`w-4 h-4 ${isActive ? "text-blue-300" : "text-blue-400 group-hover:text-blue-300"}`} />}
        {children}
      </Link>
    );
  };

  return (
    // 1. พื้นหลังสีน้ำเงินเข้ม และเพิ่ม backdrop-blur
    <nav className="bg-slate-900/95 fixed top-0 z-50 w-full shadow-lg shadow-slate-900/20 border-b border-slate-800 backdrop-blur-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3.5">
          {/* ไอคอนปรับ gradient ให้ดูพรีเมียมขึ้น */}
          <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 ring-1 ring-white/10">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            {/* ข้อความสีขาวและสีเทาอ่อน */}
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
              ระบบจัดเช็คชื่อเข้าเรียน
            </h1>
            <p className="text-[11px] sm:text-xs text-blue-300 font-medium tracking-wider uppercase">
              StudyClass System Management
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* ใช้ NavLink Component ที่สร้างขึ้นใหม่ */}
          {token?.role == 3 && <NavLink to={"/dashboard"} icon={BookOpen}>หน้าหลัก</NavLink>}
          
          {token?.role == 2 && (
            <NavLink to={"/teacher-profile"} icon={User}>ข้อมูลส่วนตัว</NavLink>
          )}

          {token?.role == 1 && <NavLink to={"/my-profile"} icon={User}>ข้อมูลส่วนตัว</NavLink>}

          <NavLink to={"/crud/subject"} icon={Settings}>
            {token?.role == 1 ? "เช็คชื่อ" : "จัดการรายวิชา"}
          </NavLink>
          
          {(token?.role == "3" || token?.role == "2") && (
            <NavLink to={"/users"} icon={User}>จัดการนักศึกษา</NavLink>
          )}

          {/* ปุ่ม Logout ปรับสีให้เข้าธีม แต่ยังโดดเด่น */}
          <button
            onClick={handleLogout}
            className="ml-2 flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-sm pl-3 pr-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg hover:shadow-cyan-500/30 font-semibold border border-cyan-400/20 active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;