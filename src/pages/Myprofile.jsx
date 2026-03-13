import { useEffect, useState } from "react";
import {
  User,
  Save,
  Edit2,
  BookOpen,
  CreditCard,
  Camera,
  Sparkles,
  Heart,
  Star,
  Loader2
} from "lucide-react";
import axios from "axios";
import { API_URL } from "./Subject";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export default function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({});
  const [load, setLoad] = useState(true);
  const [previewProfile, setPreviewProfile] = useState("");
  const [profileFile, setProfileFile] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_lvjjRAVDQ-nBDq_4dy1xCyRjjDaHV-Tqcw&s",
  );

  const handleImgPciker = (e) => {
    if (e.target.files[0]) {
      setPreviewProfile(URL.createObjectURL(e.target.files[0]));
      setProfileFile(e.target.files[0]);
    }
  };

  const getData = async () => {
    try {
      const data = JSON.parse(localStorage.getItem("loginToken")).data;
      if (!data) return (location.href = "/");
      const res = await axios.get(API_URL + `/students/${data?.student_id}`);
      setFormData({
        stundent_id: res.data?.data?.student_id,
        fullname: res.data?.data?.fullname,
        major: res.data?.data?.major,
        std_class_id: res?.data?.data?.std_class_id,
      });
      const splitProfile = res.data.data?.profile?.split("\\");
      const profilePath =
        splitProfile[0] + "/" + splitProfile[1] + "/" + splitProfile[2];
      setPreviewProfile(
        res.data?.data?.profile
          ? API_URL + "/" + profilePath
          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_lvjjRAVDQ-nBDq_4dy1xCyRjjDaHV-Tqcw&s",
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const data = new FormData();
      data.append("student_id", formData.fullname);
      data.append("fullname", formData.fullname);
      data.append("major", formData.major);
      data.append("profile", profileFile);

      const res = await axios.put(
        `${API_URL}/students/${formData.stundent_id}`,
        data,
      );
      setMessage("บันทึกข้อมูลสำเร็จ! 💜");
      setIsEditing(false);
      getData();
    } catch (error) {
      setMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล 😢");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (load) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 flex items-center justify-center font-sans">
        <div className="text-center flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
          <p className="text-lg text-purple-600 font-medium">
            กำลังโหลดข้อมูลโปรไฟล์น่ารักๆ... ✨
          </p>
        </div>
      </div>
    );
  }

  return (
    // เปลี่ยนพื้นหลังให้เป็นโทนสีม่วงพาสเทลน่ารักๆ
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 font-sans pb-12">
      <Header />
      
      <div className="max-w-4xl mx-auto px-6 py-8 mt-20">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-200 to-fuchsia-200 rounded-[2rem] shadow-sm rotate-3">
               <User className="w-10 h-10 text-white fill-current opacity-90" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
                โปรไฟล์ของฉัน <Sparkles className="w-6 h-6 text-purple-400" />
              </h2>
              <p className="text-gray-500 mt-1 font-medium">
                ดูและจัดการข้อมูลส่วนตัวของคุณได้ที่นี่เลยค่า 🌷
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="group flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-full transition-all duration-300 shadow-md hover:shadow-lg shadow-purple-200 hover:scale-105 font-bold"
            >
              <Edit2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>แก้ไขข้อมูล</span>
            </button>
          )}
        </div>

        {/* Main Card (Glassmorphism + Curved) */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-purple-100/50 border border-purple-100/50 overflow-hidden relative">
          
          {/* Header Section with Gradient Banner */}
          <div className="relative bg-gradient-to-r from-purple-300 via-fuchsia-300 to-pink-300 h-48">
            {/* Overlay Patterns / Blur */}
            <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
            <div className="absolute top-4 right-4 text-white/30">
               <Star className="w-24 h-24 fill-current" />
            </div>

            {/* Profile Image Avatar */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 group">
              <div className="relative">
                <label
                  htmlFor="img-picker"
                  className={`w-36 h-36 overflow-hidden rounded-full border-8 border-white shadow-xl bg-gradient-to-br from-purple-100 to-fuchsia-100 flex items-center justify-center transition-all ${isEditing ? 'cursor-pointer hover:border-purple-100' : 'cursor-default'}`}
                >
                  <input
                    onChange={handleImgPciker}
                    type="file"
                    id="img-picker"
                    className="hidden"
                    disabled={!isEditing}
                  />
                  <img
                    src={previewProfile}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    alt="Profile"
                  />
                  {/* Overlay กล้องถ่ายรูปเมื่ออยู่ในโหมดแก้ไข */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-purple-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Camera className="w-10 h-10 text-white" />
                    </div>
                  )}
                </label>
                {/* Status Indicator */}
                <div className="absolute bottom-3 right-3 w-6 h-6 bg-green-400 rounded-full border-4 border-white shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="pt-24 px-8 pb-10">
            {/* Title Name Center */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                {formData.fullname || "ผู้ใช้งานระบบ"}
              </h1>
              <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-sm font-bold border border-purple-100 inline-block">
                 {formData.major || "นักศึกษา"}
              </span>
            </div>

            {/* Message Alert */}
            {message && (
              <div
                className={`mb-6 p-4 rounded-2xl flex items-center justify-center gap-2 ${
                  message.includes("สำเร็จ") 
                  ? "bg-green-50/80 border-2 border-green-200 text-green-600" 
                  : "bg-rose-50/80 border-2 border-rose-200 text-rose-600"
                }`}
              >
                {message.includes("สำเร็จ") ? <Heart className="w-5 h-5 fill-current" /> : <Star className="w-5 h-5" />}
                <p className="text-center font-bold">
                  {message}
                </p>
              </div>
            )}

            {/* Form Fields Container */}
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Student ID */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-bold text-purple-700 mb-2 ml-2">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                  รหัสนักศึกษา
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="std_class_id"
                    value={formData.std_class_id || ""}
                    onChange={handleChange}
                    disabled
                    className="w-full px-5 py-3.5 bg-gray-100 border-2 border-gray-200 rounded-2xl text-gray-500 font-medium cursor-not-allowed"
                    placeholder="รหัสนักศึกษา (ไม่สามารถแก้ไขได้)"
                  />
                ) : (
                  <div className="px-5 py-3.5 bg-purple-50/50 border-2 border-purple-100 rounded-2xl transition-all">
                    <p className="text-gray-700 font-bold">
                      {formData.std_class_id || "-"}
                    </p>
                  </div>
                )}
              </div>

              {/* Full Name */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-bold text-purple-700 mb-2 ml-2">
                  <User className="w-5 h-5 text-purple-400" />
                  ชื่อ-นามสกุล 🌷
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname || ""}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 transition-all outline-none text-gray-800 font-bold placeholder-purple-200"
                    placeholder="กรอกชื่อ-นามสกุลของคุณ"
                  />
                ) : (
                  <div className="px-5 py-3.5 bg-purple-50/50 border-2 border-purple-100 rounded-2xl transition-all">
                    <p className="text-gray-700 font-bold">
                      {formData.fullname || "-"}
                    </p>
                  </div>
                )}
              </div>

              {/* Major */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-bold text-purple-700 mb-2 ml-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  สาขาวิชา 📚
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="major"
                    value={formData.major || ""}
                    onChange={handleChange}
                    className="w-full px-5 py-3.5 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 transition-all outline-none text-gray-800 font-bold placeholder-purple-200"
                    placeholder="เช่น วิทยาการคอมพิวเตอร์"
                  />
                ) : (
                  <div className="px-5 py-3.5 bg-purple-50/50 border-2 border-purple-100 rounded-2xl transition-all">
                    <p className="text-gray-700 font-bold">
                      {formData.major || "-"}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons (Shows only when Editing) */}
              {isEditing && (
                <div className="flex gap-4 pt-6 mt-4 border-t border-purple-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      getData();
                    }}
                    className="flex-1 px-6 py-3.5 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-all duration-300 font-bold"
                    disabled={loading}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-400 to-fuchsia-400 text-white rounded-full hover:from-purple-500 hover:to-fuchsia-500 transition-all duration-300 font-bold shadow-md hover:shadow-lg shadow-purple-200 disabled:opacity-50 hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                       <Save className="w-5 h-5" />
                    )}
                    {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 flex items-center justify-center gap-2 text-purple-400 text-sm font-medium bg-white/50 py-2 px-6 rounded-full w-max mx-auto border border-purple-100">
           <Heart className="w-4 h-4 fill-current" />
           <p>กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึกนะคะ</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}