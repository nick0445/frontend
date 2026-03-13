import React from "react";
import { useForm } from "react-hook-form";
import { Lock, User, GraduationCap, CreditCard, AtSign } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Subject";
import Swal from "sweetalert2";

const THAI_NAME_REGEX = /^[ก-๙\s]+$/;
const STUDENT_ID_REGEX = /^\d{12}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9]{6,}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/create-std`, data);
      if (res.data.err)
        return Swal.fire(res.data.err, "ไม่สามารถลงทะเบียนได้", "error");

      // Popup สำเร็จ และเมื่อกด OK จะพาไปหน้า Login
      Swal.fire({
        title: "ลงทะเบียนสำเร็จ 🎉",
        text: "โปรดเข้าสู่ระบบเพื่อเริ่มต้นใช้งาน",
        icon: "success",
        confirmButtonColor: "#d946ef", // สีชมพู fuchsia ให้เข้ากับธีม
        confirmButtonText: "ตกลงไปหน้าล็อคอิน"
      }).then(() => {
        reset();
        window.location.href = "/"; // กลับไปที่หน้า Login
      });
    } catch (err) {
      console.error(err);
      Swal.fire("ตรวจสอบเครือข่ายแล้วลองอีกครั้ง", "", "error");
    }
  };

  // ปรับ Input สไตล์เป็นธีมพาสเทลม่วง มีกรอบและเงาสีม่วงอ่อนเมื่อ Focus
  const inputClass = (error) =>
    `w-full pl-11 pr-4 py-3.5 rounded-2xl bg-purple-50/50 border outline-none text-sm text-slate-700 transition-all duration-300 placeholder-purple-300
     ${error 
       ? "border-rose-300 bg-rose-50 focus:border-rose-400 focus:ring-4 focus:ring-rose-200" 
       : "border-purple-100 focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-200"}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-100 via-purple-100 to-pink-100 p-4 relative overflow-hidden font-sans py-10">
      
      {/* Animated Pastel Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-pink-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-700"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-fuchsia-300/40 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] shadow-purple-200/50 rounded-[2.5rem] p-8 sm:p-10 w-full max-w-xl border border-white">
        
        {/* Header Section */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-tr from-purple-300 to-pink-300 rounded-full flex items-center justify-center shadow-inner hover:rotate-12 transition-transform duration-300 mb-4">
            <GraduationCap className="w-10 h-10 text-white drop-shadow-md" />
          </div>
          <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 text-center">
            ลงทะเบียนนักศึกษาใหม่
          </h2>
          <p className="text-sm text-purple-400 font-medium mt-1">
            มาเป็นส่วนหนึ่งของคลาสเรียนกันเถอะ 📝✨
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5">
          
          {/* ชื่อ-นามสกุล */}
          <div className="space-y-1.5">
            <label className="text-purple-700 text-sm font-bold ml-1">ชื่อ-นามสกุล</label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-purple-500 transition-colors" />
              <input
                className={inputClass(errors.fullName)}
                placeholder="นายสมชาย ใจดี"
                {...register("fullName", {
                  required: "กรุณากรอกชื่อ-นามสกุล",
                  pattern: {
                    value: THAI_NAME_REGEX,
                    message: "ต้องเป็นภาษาไทยเท่านั้น",
                  },
                })}
              />
            </div>
            {errors.fullName && <p className="text-rose-500 text-xs ml-1 font-medium">{errors.fullName.message}</p>}
          </div>

          {/* รหัสนักศึกษา */}
          <div className="space-y-1.5 mt-4">
            <label className="text-purple-700 text-sm font-bold ml-1">รหัสนักศึกษา</label>
            <div className="relative group">
              <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-purple-500 transition-colors" />
              <input
                className={inputClass(errors.studentId)}
                placeholder="663170010324"
                maxLength={12}
                {...register("studentId", {
                  required: "กรุณากรอกรหัสนักศึกษา",
                  pattern: {
                    value: STUDENT_ID_REGEX,
                    message: "ต้องเป็นตัวเลข 12 หลักเท่านั้น",
                  },
                })}
              />
            </div>
            {errors.studentId && <p className="text-rose-500 text-xs ml-1 font-medium">{errors.studentId.message}</p>}
          </div>

          {/* Username */}
          <div className="space-y-1.5 mt-4">
            <label className="text-purple-700 text-sm font-bold ml-1">ชื่อผู้ใช้ (Username)</label>
            <div className="relative group">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-purple-500 transition-colors" />
              <input
                className={inputClass(errors.username)}
                placeholder="username123"
                {...register("username", {
                  required: "กรุณากรอกชื่อผู้ใช้",
                  pattern: {
                    value: USERNAME_REGEX,
                    message: "ใช้ได้เฉพาะ a-z, A-Z, 0-9 และ ≥ 6 ตัว",
                  },
                })}
              />
            </div>
            {errors.username && <p className="text-rose-500 text-xs ml-1 font-medium">{errors.username.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-purple-700 text-sm font-bold ml-1">รหัสผ่าน</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="password"
                  className={inputClass(errors.password)}
                  placeholder="อย่างน้อย 6 ตัวอักษร"
                  {...register("password", {
                    required: "กรุณากรอกรหัสผ่าน",
                    pattern: {
                      value: PASSWORD_REGEX,
                      message: "ต้องมีอักษร ตัวเลข อักขระพิเศษ",
                    },
                  })}
                />
              </div>
              {errors.password && <p className="text-rose-500 text-xs ml-1 font-medium">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-purple-700 text-sm font-bold ml-1">ยืนยันรหัสผ่าน</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-purple-500 transition-colors" />
                <input
                  type="password"
                  className={inputClass(errors.confirmPassword)}
                  placeholder="ยืนยันรหัสผ่านอีกครั้ง"
                  {...register("confirmPassword", {
                    required: "กรุณายืนยันรหัสผ่าน",
                    validate: (v) => v === watch("password") || "รหัสผ่านไม่ตรงกัน",
                  })}
                />
              </div>
              {errors.confirmPassword && <p className="text-rose-500 text-xs ml-1 font-medium">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 mt-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 active:scale-[0.98] text-white rounded-2xl font-bold text-lg shadow-lg shadow-purple-300/50 hover:shadow-purple-400/50 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                กำลังลงทะเบียน...
              </span>
            ) : (
              "ยืนยันการลงทะเบียน"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-purple-500/80 text-sm font-medium mt-8">
          มีบัญชีผู้ใช้งานอยู่แล้ว?{" "}
          <Link to="/" className="text-pink-500 hover:text-pink-600 font-bold underline decoration-2 underline-offset-2 transition-colors">
            เข้าสู่ระบบเลย
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;