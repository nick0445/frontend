import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  BookOpen,
  Loader2,
  CheckCircle,
  FileText,
  Home,
  Star,
  Sparkles,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Swal from "sweetalert2";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API;

export default function CourseCRUD() {
  const token = JSON.parse(localStorage.getItem("loginToken"))?.data;
  console.log("🚀 ~ CourseCRUD ~ token:", token);

  const [teachers, setTeachers] = useState([]);
  const [load, setLoad] = useState(true);
  
  const getTeacher = async () => {
    try {
      const professors = await axios.get(API_URL + "/get-all-professors");
      setTeachers(professors.data.data);
    } catch (error) {
      console.error(error);
      Swal.fire("มีบางอย่างผิดพลาด 😢", "โปรดตรวจสอบเครือข่าย", "error");
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getTeacher();
  }, []);

  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_id: "",
    course_name: "",
    teacher_name: "",
    teacher_id: "",
    time_check: "",
  });

  // Load data from API on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/get-all-subjects`);
      const data = await response.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      Swal.fire("แย่จัง!", "ไม่สามารถโหลดข้อมูลได้", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (editingCourse) {
        // Update existing course
        const res = await axios.put(
          `${API_URL}/update-subject/${editingCourse.course_id}`,
          formData,
        );

        if (res.data.err) {
          return Swal.fire("อุ๊ย!", res.data.err, "warning");
        }

        if (res.status === 200 || res.status === 201) {
          fetchCourses();
          Swal.fire("อัปเดตข้อมูลเรียบร้อยแล้ว💜", "", "success");
        }
      } else {
        // Add new course
        const res = await axios.post(`${API_URL}/create-subject`, formData);

        if (res.data.err) {
          return Swal.fire("อุ๊ย!", res.data.err, "warning");
        }

        if (res.status === 200 || res.status === 201) {
          fetchCourses();
          Swal.fire("เพิ่มข้อมูลเรียบร้อยแล้วค่า! ✨", "", "success");
        }
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving:", error);
      Swal.fire("มีบางอย่างผิดพลาด 😢", "เกิดข้อผิดพลาด กรุณาลองใหม่นะคะ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      course_id: course.course_id,
      course_name: course.course_name,
      teacher_name: course.teacher_name,
      teacher_id: course.teacher_id,
      time_check: course?.time_check || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (courseId) => {
    Swal.fire({
      title: "แน่ใจหรือเปล่าคะ?",
      text: "ลบรายวิชานี้แล้วกู้คืนไม่ได้น้า 🥺",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c084fc", // สีม่วง
      cancelButtonColor: "#cbd5e1",
      confirmButtonText: "ลบเลย!",
      cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          const response = await fetch(`${API_URL}/delete-subject/${courseId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            Swal.fire("ลบข้อมูลสำเร็จแล้วค่า! ✨", "", "success");
            await fetchCourses();
          } else {
            Swal.fire("แย่จัง!", "ไม่สามารถลบข้อมูลได้", "error");
          }
        } catch (error) {
          console.error("Error deleting:", error);
          Swal.fire("แย่จัง!", "ไม่สามารถลบข้อมูลได้", "error");
        } finally {
          setLoading(false);
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({ course_id: "", course_name: "", teacher_name: "", teacher_id: "", time_check: "" });
    setEditingCourse(null);
    setIsModalOpen(false);
  };

  return (
    // ปรับพื้นหลังเป็นโทนม่วงพาสเทล
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 font-sans pb-10">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-purple-200 to-fuchsia-200 rounded-[2rem] shadow-sm rotate-3">
              <BookOpen className="w-10 h-10 text-white fill-current opacity-90" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
                {token?.role == "1" ? "รายวิชาของฉัน" : "ระบบจัดการรายวิชา"} <Sparkles className="w-6 h-6 text-purple-400" />
              </h1>
              {token?.role !== "1" && (
                <p className="text-gray-500 mt-1 font-medium">
                  จัดการข้อมูลรายวิชาและอาจารย์ผู้สอนได้ที่นี่เลย ✨
                </p>
              )}
            </div>
          </div>
          
          {token?.role !== "1" && (
            <button
              onClick={() => {
                resetForm();
                setIsModalOpen(true);
              }}
              disabled={loading}
              className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-full transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 font-bold hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              เพิ่มรายวิชาใหม่
            </button>
          )}
        </div>

        {/* Table Container */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-purple-100/50 border border-purple-100/50 overflow-hidden relative">
          
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-3xl pointer-events-none"></div>

          {loading && courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin mb-4" />
              <span className="text-purple-500 font-medium">กำลังโหลดข้อมูลน่ารักๆ อยู่น้า...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-purple-200 mx-auto mb-4 animate-pulse" />
              <p className="text-purple-400 text-lg font-medium">
                ยังไม่มีรายวิชาเลยค่ะ ลองเพิ่มรายวิชาใหม่ดูสิคะ ✨
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto p-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-50 to-fuchsia-50">
                    <th className="px-6 py-5 text-left text-sm font-bold text-purple-800 rounded-tl-2xl w-24">ลำดับ</th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-purple-800">รหัสวิชา</th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-purple-800">ชื่อรายวิชา</th>
                    <th className="px-6 py-5 text-left text-sm font-bold text-purple-800">อาจารย์ผู้สอน</th>
                    <th className="px-6 py-5 text-center text-sm font-bold text-purple-800 rounded-tr-2xl">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50/50">
                  {courses.map((course, index) => (
                    <tr
                      key={course.course_id}
                      className="hover:bg-purple-50/30 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 text-gray-500 font-medium">{index + 1}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-bold border border-purple-100">
                          {course.course_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-bold">
                        {token?.role == "1" ? (
                          <Link
                            to={`/check-manual/${course.course_id}/${token?.student_id}`}
                            className="hover:text-purple-500 hover:underline flex items-center gap-2 transition-colors"
                          >
                            <BookOpen className="w-4 h-4 text-purple-400" />
                            {course.course_name}
                          </Link>
                        ) : (
                          <p className="flex items-center gap-2">
                             <BookOpen className="w-4 h-4 text-purple-300" />
                             {course.course_name}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {course.teacher_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {token?.role == "2" || token?.role == "3" ? (
                            <>
                              <button
                                onClick={() => handleEdit(course)}
                                disabled={loading}
                                className="group flex items-center gap-1.5 bg-yellow-50 text-yellow-500 hover:bg-yellow-100 px-4 py-2 rounded-full transition-all shadow-sm hover:scale-105 font-bold text-sm"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-4 h-4" />
                                แก้ไข
                              </button>
                              {/* เปลี่ยนสีปุ่มลบให้เป็นโทนม่วงเข้มแทนแดงเพื่อคุมโทน (หรือจะใช้สีแดงอ่อนแบบเดิมก็ได้) */}
                              <button
                                onClick={() => handleDelete(course.course_id)}
                                disabled={loading}
                                className="group flex items-center gap-1.5 bg-rose-50 text-rose-500 hover:bg-rose-100 px-4 py-2 rounded-full transition-all shadow-sm hover:scale-105 font-bold text-sm"
                                title="ลบ"
                              >
                                <Trash2 className="w-4 h-4" />
                                ลบ
                              </button>
                            </>
                          ) : (
                            <Link
                              className="group flex items-center gap-1.5 px-4 py-2 rounded-full text-blue-500 bg-blue-50 hover:bg-blue-100 transition-all shadow-sm hover:scale-105 font-bold text-sm"
                              to={`/class-detail/${course.course_id}/${token?.student_id}`}
                            >
                              <FileText className="w-4 h-4" />
                              รายละเอียด
                            </Link>
                          )}
                          {token?.role == "2" && (
                            <Link
                              className="group flex items-center gap-1.5 px-4 py-2 rounded-full text-emerald-500 bg-emerald-50 hover:bg-emerald-100 transition-all shadow-sm hover:scale-105 font-bold text-sm"
                              to={`/check-class/${course.course_id}`}
                            >
                              <CheckCircle className="w-4 h-4" />
                              เช็คชื่อ
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {courses.length > 0 && (
            <div className="bg-purple-50/30 px-6 py-4 border-t border-purple-100 text-center rounded-b-[2.5rem]">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-purple-300 fill-current" />
                แสดงรายวิชาทั้งหมด{" "}
                <span className="font-bold text-purple-600 bg-white px-3 py-1 rounded-full shadow-sm border border-purple-100">
                  {courses.length}
                </span>{" "}
                รายวิชา
              </p>
            </div>
          )}
        </div>

        {/* Cute Modal Popup */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto ring-4 ring-white animate-scale-in">
              
              {/* Modal Header แบบพาสเทล */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-400 to-fuchsia-400 text-white p-6 flex items-center justify-between z-10 shadow-sm">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  {editingCourse ? <Edit2 className="w-6 h-6"/> : <Star className="w-6 h-6"/>}
                  {editingCourse ? "แก้ไขรายวิชา" : "เพิ่มรายวิชาใหม่น่ารักๆ"}
                </h2>
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="p-1.5 hover:bg-white hover:text-purple-400 bg-white/20 rounded-full transition-all disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-5 bg-purple-50/20">
                <div>
                  <label className="block text-sm font-bold text-purple-700 mb-2">
                    รหัสวิชา
                  </label>
                  <input
                    type="text"
                    value={formData.course_id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        course_id: e.target.value,
                      })
                    }
                    readOnly
                    className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-2xl outline-none text-gray-500 font-medium"
                    placeholder="(ระบบจะสร้างให้อัตโนมัติ)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-purple-700 mb-2">
                    ชื่อวิชา 📖
                  </label>
                  <input
                    type="text"
                    value={formData.course_name || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        course_name: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                    placeholder="เช่น การพัฒนาเว็บแอปพลิเคชัน"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-700 mb-2">
                    ตั้งค่าเวลาเข้าเรียน ⏰
                  </label>
                  <input
                    type="time"
                    value={formData.time_check || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        time_check: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-purple-700 mb-2">
                    อาจารย์ผู้สอน 👩‍🏫
                  </label>
                  <select
                    value={formData.teacher_id || ""}
                    onChange={(option) =>
                      setFormData((prev) => ({
                        ...prev,
                        teacher_id: option.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                  >
                    <option disabled value="">-- เลือกอาจารย์ผู้สอนนะคะ --</option>
                    {teachers.map((t, index) => (
                      <option value={t?.id} key={index}>
                        {t.fullname}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons ใน Modal */}
                <div className="flex gap-3 pt-6 mt-4 border-t border-purple-100">
                  <button
                    onClick={resetForm}
                    className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-all font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-full transition-all shadow-md hover:shadow-lg shadow-purple-200 font-bold"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-5 h-5 text-white" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    บันทึกข้อมูล
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}