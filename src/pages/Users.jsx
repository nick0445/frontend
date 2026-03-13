import { useEffect, useState } from "react";
import {
  Trash2,
  Home,
  User,
  AlertCircle,
  GraduationCap,
  CheckCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "./Subject";
import Header from "../components/header";
import Footer from "../components/footer";

export default function Users() {
  const [students, setStudents] = useState([]);
  // State สำหรับ Modal ยืนยันการลบ
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  // State สำหรับ Popup แจ้งเตือนความสำเร็จ
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [load, setLoad] = useState(true);

  const getAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/students`);
      setStudents(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  // ฟังก์ชันแสดง Toast แจ้งเตือนความสำเร็จ
  const triggerSuccessToast = () => {
    setShowSuccessToast(true);
    // ซ่อนอัตโนมัติหลังจาก 3 วินาที
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  if (load)
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-xl font-medium text-blue-600 animate-pulse flex items-center gap-2">
          <Sparkles className="w-5 h-5" /> กำลังโหลดข้อมูลนักศึกษา...
        </p>
      </div>
    );

  // 1. ฟังก์ชันเปิด Modal เมื่อกดปุ่มลบ
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  // 2. ฟังก์ชันยืนยันการลบ (แก้ไขแล้ว)
  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      const id = studentToDelete.student_id || studentToDelete.std_class_id || studentToDelete.id;
      
      await axios.delete(`${API_URL}/students/${id}`);

      // โหลดข้อมูลใหม่
      getAll();

      // ปิด Modal และเคลียร์ค่า
      setShowDeleteModal(false);
      setStudentToDelete(null);

      // แสดง Popup แจ้งเตือนความสำเร็จ
      triggerSuccessToast();

    } catch (error) {
      console.error("Error deleting student:", error);
      // อาจจะเพิ่ม Toast สำหรับ Error ด้วยก็ได้
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
      setShowDeleteModal(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  return (
    // ใช้พื้นหลังโทนสีพาสเทลไล่ระดับนุ่มๆ
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 py-8 px-4 font-sans">
      <Header />
      
      {/* Success Toast Notification (Popup แจ้งเตือนมุมขวาบน) */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-bounce-in">
          <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3 border-l-4 border-green-400 ring-1 ring-black/5">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">ดำเนินการสำเร็จ!</h4>
              <p className="text-sm text-gray-600">ลบข้อมูลนักศึกษาเรียบร้อยแล้ว ✨</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 self-start">
             <div className="p-3 bg-blue-100 rounded-2xl shadow-sm">
                 <BookOpen className="w-8 h-8 text-blue-500" />
             </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                จัดการข้อมูลนักศึกษา <Sparkles className="w-5 h-5 text-yellow-400" />
              </h1>
              <p className="text-gray-500 mt-1">ระบบบริหารจัดการฐานข้อมูลนักศึกษา</p>
            </div>
          </div>

          <button
            onClick={() => (location.href = "/dashboard")}
            className="group flex items-center gap-2 px-5 py-3 bg-white text-blue-600 rounded-full transition-all shadow-sm hover:shadow-md border-2 border-blue-100 hover:border-blue-200 font-medium"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>กลับหน้าหลัก</span>
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-100/50 border border-blue-50 overflow-hidden relative">
          
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-pink-100 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-3xl pointer-events-none"></div>

          {/* Stats Banner */}
          <div className="bg-gradient-to-r from-blue-400 to-blue-300 p-6 relative overflow-hidden">
             <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-5">
                 <GraduationCap size={120} />
             </div>
            <div className="flex items-center gap-4 relative z-10 text-white">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-inner border border-white/30">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <p className="text-blue-50 font-medium mb-1">ยอดรวมนักศึกษาทั้งหมด</p>
                <h2 className="text-4xl font-extrabold tracking-tight flex items-baseline gap-2">
                  {students.length} <span className="text-lg font-semibold opacity-80">คน</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-2">
            <div className="overflow-x-auto rounded-xl border border-gray-100 mt-4 mx-4">
              <table className="w-full">
                {/* หัวตารางแบบน่ารัก */}
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-pink-50">
                    <th className="px-6 py-5 text-left text-sm font-bold text-blue-800 tracking-wider uppercase rounded-tl-xl">
                        รหัสนักศึกษา
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-blue-800 tracking-wider uppercase">
                        ชื่อ-นามสกุล
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-blue-800 tracking-wider uppercase">
                        สาขาวิชา
                    </th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-blue-800 tracking-wider uppercase">
                        ชั้นปี
                    </th>
                    <th className="px-6 py-5 text-center text-sm font-bold text-blue-800 tracking-wider uppercase rounded-tr-xl">
                        จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {students.length > 0 ? (
                    students.map((student, index) => (
                      <tr
                        key={index}
                        className="hover:bg-blue-50/50 transition-all duration-200"
                      >
                        <td className="px-6 py-5 text-sm font-semibold text-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                                    <User size={16} />
                                </div>
                                {student.std_class_id || student?.student_id}
                            </div>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-800 font-medium">
                          {student.fullname}
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium">
                            {student.major}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">
                          {student.year ? (
                             <span className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-xs font-medium">
                                ปี {student.year}
                             </span>
                          ) : "-"}
                        </td>
                        <td className="px-6 py-5 text-center">
                          {/* ปุ่มลบที่ดูนุ่มนวลขึ้น */}
                          <button
                            onClick={() => handleDeleteClick(student)}
                            className="group inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-rose-50 text-rose-500 hover:text-rose-600 rounded-full transition-all border-2 border-rose-100 hover:border-rose-200 shadow-sm"
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="font-medium text-sm">ลบข้อมูล</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
                          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center relative">
                             <AlertCircle className="w-10 h-10 text-gray-300" />
                             <Sparkles className="w-6 h-6 text-yellow-300 absolute top-0 right-0 animate-pulse" />
                          </div>
                          <p className="text-xl font-semibold text-gray-600">
                            ยังไม่มีข้อมูลนักศึกษา
                          </p>
                          <p className="text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
                            เริ่มตั้นด้วยการเพิ่มข้อมูลนักศึกษาใหม่
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Summary */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center rounded-b-[2rem]">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-300" />
              แสดงข้อมูลทั้งหมด{" "}
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {students.length}
              </span>{" "}
              รายการ
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal (ออกแบบใหม่ให้น่ารักขึ้น) */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden animate-scale-in relative ring-4 ring-white">
            
             {/* Decorative header shape */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-rose-100 to-white rounded-t-[2rem] z-0 pointer-events-none"></div>

            {/* Modal Header */}
            <div className="relative z-10 pt-8 px-6 text-center">
              <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner border-4 border-white">
                <Trash2 className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">ยืนยันการลบ?</h2>
              <p className="text-gray-500">
                คุณแน่ใจหรือไม่ที่จะลบข้อมูลนักศึกษาคนนี้
                <br />การกระทำนี้ไม่สามารถย้อนกลับได้นะ!
              </p>
            </div>

            {/* Modal Body - Student Details */}
            <div className="relative z-10 p-6">
              <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-rose-400">
                     <User size={24} />
                 </div>
                <div>
                    <h3 className="font-bold text-lg text-gray-800">
                    {studentToDelete?.fullname}
                    </h3>
                    <p className="text-sm text-rose-600 font-medium bg-rose-100/50 px-2 py-0.5 rounded-md inline-block mt-1">
                    รหัส: {studentToDelete?.student_id || studentToDelete?.std_class_id}
                    </p>
                </div>
              </div>
            </div>

            {/* Modal Footer - Buttons */}
            <div className="relative z-10 px-6 pb-8 flex gap-4">
              <button
                onClick={cancelDelete}
                className="flex-1 px-6 py-3.5 bg-white text-gray-700 hover:bg-gray-50 rounded-full transition-all font-medium border-2 border-gray-200 shadow-sm"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3.5 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-full transition-all shadow-md hover:shadow-lg font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                ยืนยันลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}