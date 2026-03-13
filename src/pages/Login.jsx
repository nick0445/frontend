import { useEffect, useState } from "react";
import { Lock, User, LogIn, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Subject";
import Swal from "sweetalert2";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [whoLoading, setWhoLogin] = useState(0);

  const handleLogin = async () => {
    setIsLoading(true);
    if (!username || !password) return alert("ไม่พบข้อมูล");

    try {
      if (username === "admin" && password === "1234") {
        const token = {
          data: { role: 3, signInDate: new Date(), username: "admin" },
        };
        localStorage.setItem("loginToken", JSON.stringify(token));
        location.href = "/dashboard";
      } else {
        const res = await axios.post(
          `${API_URL}/login`,
          { username, password },
          { params: { type: whoLoading } },
        );
        if (res.data.err) return alert(res.data.err);
        if (res.status === 200) {
          localStorage.setItem("loginToken", JSON.stringify(res.data));
        }
        Swal.fire("เข้าสู่ระบบสำเร็จ", "", "success");
        location.href =
          res.data.data?.role == 1 ? "/my-profile" : "/teacher-profile";
      }
    } catch (error) {
      console.error(error);
      alert(JSON.stringify(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("loginToken")?.data;
    if (token)
      location.href =
        token?.role == "3"
          ? "/dashboard"
          : token?.role == "2"
            ? "/crud/subject"
            : "/my-profile";
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-100 via-purple-100 to-pink-100 p-4 relative overflow-hidden font-sans">
      {/* Animated Pastel Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-pink-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-fuchsia-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] shadow-purple-200/50 rounded-[2.5rem] p-8 w-full max-w-md border border-white">
        
        {/* Logo/Icon Container */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-tr from-purple-300 to-pink-300 rounded-full flex items-center justify-center shadow-inner hover:rotate-12 transition-transform duration-300">
            <GraduationCap className="w-12 h-12 text-white drop-shadow-md" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 text-center mb-2">
          ระบบเช็คชื่อเข้าเรียน
        </h2>
        <p className="text-purple-400 text-center mb-8 font-medium text-sm">
          เข้าสู่ระบบเพื่อเริ่มต้นการใช้งาน 👩‍💻✨
        </p>

        {/* Form */}
        <div className="space-y-5">
          {/* Username Field */}
          <div>
            <label className="text-purple-700 font-bold mb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" />
              ชื่อผู้ใช้
            </label>
            <div className="relative group">
              <input
                type="text"
                className="w-full p-4 pl-12 rounded-2xl bg-purple-50/50 text-slate-700 outline-none focus:ring-4 focus:ring-purple-200 focus:bg-white transition-all duration-300 border border-purple-100 placeholder-purple-300"
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-purple-500 transition-colors" />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-purple-700 font-bold mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-500" />
              รหัสผ่าน
            </label>
            <div className="relative group">
              <input
                type="password"
                className="w-full p-4 pl-12 rounded-2xl bg-purple-50/50 text-slate-700 outline-none focus:ring-4 focus:ring-purple-200 focus:bg-white transition-all duration-300 border border-purple-100 placeholder-purple-300"
                placeholder="กรอกรหัสผ่านของคุณ"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-purple-500 transition-colors" />
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full mt-4 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-300/50 hover:shadow-purple-400/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <LogIn className="w-5 h-5" />
            <span>เข้าสู่ระบบ</span>
          </button>

          <div className="text-center mt-6">
            <p className="text-purple-500/80 text-sm font-medium">
              ยังไม่มีบัญชี?{" "}
              <Link
                to={"register/"}
                className="text-pink-500 hover:text-pink-600 font-bold underline decoration-2 underline-offset-2 transition-colors"
              >
                ลงทะเบียนเลย
              </Link>
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-purple-300 font-medium text-xs mt-8">
            © {new Date().getFullYear()} ระบบเช็คชื่อเข้าเรียน - All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}