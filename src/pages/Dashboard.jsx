import { useEffect, useState } from "react";
import {
  User,
  BookOpen,
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Users2,
  Pen,
  Book,
  Loader2,
  Sparkles,
  Heart,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Subject";
import Swal from "sweetalert2";
import Users from "./Users";
import DashboardStat from "../components/Dashboard-stat";
import DashboardStudentRow from "../components/dashboars-student-row";
import DashboardProfessorRow from "../components/dashboard-professor-row";
import DashboardSubjectRow from "../components/dashboard-subject-row";
import Header from "../components/header";
import Footer from "../components/footer";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [tableData, setTableData] = useState([]);

  // Sample data
  const [students, setStudents] = useState([
    {
      id: "6501234567",
      name: "สมชาย ใจดี",
      major: "วิทยาการคอมพิวเตอร์",
      email: "somchai@email.com",
    },
    {
      id: "6501234568",
      name: "สมหญิง รักเรียน",
      major: "วิศวกรรมซอฟต์แวร์",
      email: "somying@email.com",
    },
    {
      id: "6501234569",
      name: "ประยุทธ มานะ",
      major: "ระบบสารสนเทศ",
      email: "prayut@email.com",
    },
  ]);

  const [teachers, setTeachers] = useState([
    {
      id: "T001",
      name: "ดร.วิชัย สอนดี",
      email: "wichai@university.ac.th",
      department: "คอมพิวเตอร์",
    },
    {
      id: "T002",
      name: "อ.สมพร ใจเย็น",
      email: "somporn@university.ac.th",
      department: "วิศวกรรม",
    },
    {
      id: "T003",
      name: "ผศ.ดร.นภา วิชาการ",
      email: "napa@university.ac.th",
      department: "วิทยาศาสตร์",
    },
  ]);

  const [subjects, setSubjects] = useState([
    {
      id: "CS101",
      name: "การเขียนโปรแกรมเบื้องต้น",
      credits: "3",
      teacher: "ดร.วิชัย สอนดี",
    },
    {
      id: "CS201",
      name: "โครงสร้างข้อมูล",
      credits: "3",
      teacher: "อ.สมพร ใจเย็น",
    },
    {
      id: "CS301",
      name: "ฐานข้อมูล",
      credits: "3",
      teacher: "ผศ.ดร.นภา วิชาการ",
    },
  ]);

  const [loadAll, setLoadAll] = useState(true);
  
  const getAllList = async () => {
    try {
      const students = await axios.get(API_URL + "/students");
      setStudents(students.data.data);

      const professors = await axios.get(API_URL + "/get-all-professors");
      setTeachers(professors.data.data);

      const course = await axios.get(API_URL + "/get-all-subjects");
      setSubjects(course.data.data);

      if (activeTab === "students") {
        setTableData(students.data.data);
      } else if (activeTab === "teachers") {
        setTableData(professors.data.data);
      } else if (activeTab === "subjects") {
        setTableData(course.data.data);
      } else {
        setTableData(students.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadAll(false);
    }
  };

  useEffect(() => {
    getAllList();
  }, []);

  const [formData, setFormData] = useState({});

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    Swal.fire({
      title: "แน่ใจหรือเปล่าคะ?",
      text: "ลบแล้วกู้คืนไม่ได้น้า 🥺",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#c084fc", // สีม่วง
      cancelButtonColor: "#cbd5e1",
      confirmButtonText: "ลบเลย!",
      cancelButtonText: "ยกเลิก"
    }).then(async (result) => {
      if (result.isConfirmed) {
        let api = "";
        if (activeTab === "students") {
          api = `/students/${item?.student_id}`;
        } else if (activeTab === "teachers") {
          api = `/delete-professor/${item?.id}`;
        } else {
          api = `/delete-subject/${item?.course_id}`;
        }
        try {
          const res = await axios.delete(API_URL + api);
          if (res.status === 200) {
            getAllList();
            Swal.fire("ลบสำเร็จแล้วค่า! ✨", "", "success");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("มีบางอย่างผิดพลาด 😢", "ตรวจสอบเครือข่าย", "error");
        }
      }
    });
  };

  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    let api = "";
    if (editingItem) {
      // Update existing
      if (activeTab === "students") {
        api = `/students/${formData?.student_id}`;
      } else if (activeTab === "teachers") {
        api = `/update-professor/${formData?.id}`;
        const username = formData.username?.trim();
        const password = formData.password;
        const tel = formData.tel?.trim();

        if (!username) return Swal.fire("อ๊ะ! ลืมกรอกรหัสผู้ใช้งานนะ", "", "error");
        if (username.length < 6) return Swal.fire("รหัสผู้ใช้งานต้องมีอย่างน้อย 6 ตัวอักษรค่ะ", "", "error");
        if (!/^[a-zA-Z0-9]+$/.test(username)) return Swal.fire("รหัสผู้ใช้งานใช้ได้เฉพาะ a-z, A-Z และตัวเลขนะคะ", "", "error");
        
        if (!password) return Swal.fire("อย่าลืมกรอกรหัสผ่านนะคะ", "", "error");
        if (password.length < 8) return Swal.fire("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรค่า", "", "error");
        if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])/.test(password)) return Swal.fire("รหัสผ่านต้องมี ตัวอักษร + ตัวเลข + อักขระพิเศษ น้า", "", "error");
        if (username === password) return Swal.fire("รหัสผู้ใช้งานห้ามตรงกับรหัสผ่านค่ะ", "", "error");
        
        if (!tel) return Swal.fire("กรุณากรอกเบอร์โทรศัพท์ด้วยนะคะ", "", "error");
        if (!/^0\d{9}$/.test(tel)) return Swal.fire("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก และขึ้นต้นด้วย 0 ค่า", "", "error");
      } else {
        api = `/update-subject/${formData?.course_id}`;
      }
    } else {
      // Add new
      if (activeTab === "students") {
        api = "/create-std";
      } else if (activeTab === "teachers") {
        api = "/create-professor";
        const username = formData.username?.trim();
        const password = formData.password;
        const tel = formData.tel?.trim();

        if (!username) return Swal.fire("อ๊ะ! ลืมกรอกรหัสผู้ใช้งานนะ", "", "error");
        if (username.length < 6) return Swal.fire("รหัสผู้ใช้งานต้องมีอย่างน้อย 6 ตัวอักษรค่ะ", "", "error");
        if (!/^[a-zA-Z0-9]+$/.test(username)) return Swal.fire("รหัสผู้ใช้งานใช้ได้เฉพาะ a-z, A-Z และตัวเลขนะคะ", "", "error");
        
        if (!password) return Swal.fire("อย่าลืมกรอกรหัสผ่านนะคะ", "", "error");
        if (password.length < 8) return Swal.fire("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษรค่า", "", "error");
        if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*#?&])/.test(password)) return Swal.fire("รหัสผ่านต้องมี ตัวอักษร + ตัวเลข + อักขระพิเศษ น้า", "", "error");
        if (username === password) return Swal.fire("รหัสผู้ใช้งานห้ามตรงกับรหัสผ่านค่ะ", "", "error");
        
        if (!tel) return Swal.fire("กรุณากรอกเบอร์โทรศัพท์ด้วยนะคะ", "", "error");
        if (!/^0\d{9}$/.test(tel)) return Swal.fire("เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลัก และขึ้นต้นด้วย 0 ค่า", "", "error");
      } else {
        api = "/create-subject";
      }
    }

    try {
      setSaving(true);
      let res = null;
      if (editingItem) {
        res = await axios.put(API_URL + api, formData);
      } else {
        res = await axios.post(API_URL + api, formData);
      }
      if (res.data.err) {
        return Swal.fire(res.data.err, "ไม่สามารถบันทึกได้", "warning");
      }

      if (res.status === 200 || res.status === 201) {
        getAllList();
        Swal.fire("บันทึกข้อมูลเรียบร้อยแล้วค่า! 💜", "", "success");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("มีบางอย่างผิดพลาด 😢", "ตรวจสอบเครือข่าย", "error");
    } finally {
      setSaving(false);
    }
    setShowModal(false);
    setFormData({});
  };

  function searchData(keyword) {
    setTableData(
      tableData.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(keyword.toLowerCase()),
        ),
      ),
    );
  }

  return (
    // เปลี่ยนพื้นหลังให้เป็นโทนสีม่วง-ชมพูพาสเทลน่ารักๆ
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 font-sans pb-10">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        {/* Welcome Section */}
        <div className="mb-10 flex items-center gap-4">
          <div className="p-4 bg-gradient-to-br from-purple-200 to-fuchsia-200 rounded-[2rem] shadow-sm rotate-3">
             <Star className="w-10 h-10 text-white fill-current" />
          </div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              แอดมิน แดชบอร์ด <Sparkles className="w-6 h-6 text-purple-400" />
            </h2>
            <p className="text-gray-500 mt-1 font-medium">
              จัดการข้อมูลนักศึกษา อาจารย์ และรายวิชาได้ที่นี่เลย! ✨
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <DashboardStat />

        {/* Management Section Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl shadow-purple-100/50 border border-purple-100/50 overflow-hidden relative mt-8">
          
          {/* Decorative background blurs */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-3xl pointer-events-none"></div>

          {/* Cute Tabs */}
          <div className="flex p-3 gap-3 bg-purple-50/50 rounded-[2rem] mx-6 mt-6 border border-purple-100/50">
            {[
              { id: "students", label: "นักศึกษา", icon: GraduationCap, data: students },
              { id: "teachers", label: "อาจารย์", icon: User, data: teachers },
              { id: "subjects", label: "รายวิชา", icon: BookOpen, data: subjects }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setTableData(tab.data);
                }}
                className={`flex-1 py-3 px-6 font-bold rounded-[1.5rem] transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-white text-purple-500 shadow-md border border-purple-100 scale-[1.02]"
                    : "text-gray-500 hover:bg-purple-100/50 hover:text-purple-600"
                }`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'animate-bounce' : ''}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Toolbar (Search & Add) */}
          <div className="p-6 mt-2 flex flex-col sm:flex-row gap-4 items-center relative z-10">
            <div className="flex-1 relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
              <input
                type="text"
                placeholder="ค้นหาข้อมูลตรงนี้เลย..."
                value={searchTerm}
                onChange={(e) => {
                  searchData(e.target.value);
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-purple-100 rounded-full focus:border-purple-300 focus:ring-4 focus:ring-purple-100 outline-none transition-all shadow-sm font-medium text-gray-700 placeholder-purple-200"
              />
            </div>
            
            {activeTab !== "students" && (
              <button
                onClick={handleAdd}
                className="group flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-full transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300 font-bold hover:scale-105 w-full sm:w-auto"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                เพิ่มข้อมูลใหม่
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-50 to-fuchsia-50">
                  {activeTab === "students" && (
                    <>
                      <th className="px-6 py-5 text-left text-sm font-bold text-purple-800 rounded-tl-2xl">รหัสนักศึกษา</th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-purple-800">ชื่อ-นามสกุล</th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-purple-800">สาขาวิชา</th>
                    </>
                  )}
                  {activeTab === "teachers" && (
                    <>
                      <th className="px-6 py-5 text-left text-sm font-bold text-purple-800 rounded-tl-2xl">รหัสอาจารย์</th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-purple-800">ชื่อ-นามสกุล</th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-purple-800">เบอร์โทรศัพท์</th>
                    </>
                  )}
                  {activeTab === "subjects" && (
                    <>
                      <th className="px-6 py-5 text-left text-sm font-bold text-purple-800 rounded-tl-2xl">รหัสวิชา</th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-purple-800">ชื่อวิชา</th>
                      <th className="px-6 py-5 text-left text-sm font-bold text-purple-800">อาจารย์ผู้สอน</th>
                    </>
                  )}
                  <th className="px-6 py-5 text-center text-sm font-bold text-purple-800 rounded-tr-2xl">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50/50">
                {tableData.map((item, index) => (
                  <tr key={index} className="hover:bg-purple-50/30 transition-colors">
                    {activeTab === "students" && <DashboardStudentRow item={item} />}
                    {activeTab === "teachers" && <DashboardProfessorRow item={item} />}
                    {activeTab === "subjects" && <DashboardSubjectRow item={item} />}
                    <td className="px-6 py-4">
                      {/* ปุ่มจัดการสไตล์น่ารัก */}
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(item)}
                          className="group p-2.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-500 rounded-full transition-all shadow-sm hover:scale-110"
                          title="แก้ไข"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {/* เปลี่ยนปุ่มลบให้ดูซอฟต์ลง หรือจะใช้สีแดงอ่อนแบบเดิมก็ได้ */}
                        <button
                          onClick={() => handleDelete(item)}
                          className="group p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-full transition-all shadow-sm hover:scale-110"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {tableData.length === 0 && (
                  <tr>
                     <td colSpan="4" className="text-center py-10 text-purple-300 font-medium">
                         <Heart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                         ไม่มีข้อมูลนะคะ เพิ่มข้อมูลได้เลย!
                     </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cute Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 bg-indigo-900/20 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto ring-4 ring-white animate-scale-in">
            {/* Modal Header แบบพาสเทล */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-400 to-fuchsia-400 text-white p-6 flex justify-between items-center z-10 shadow-sm">
              <h3 className="text-xl font-bold flex items-center gap-2">
                {editingItem ? <Edit2 className="w-5 h-5"/> : <Heart className="w-5 h-5"/>}
                {editingItem ? "แก้ไขข้อมูล" : "เพิ่มข้อมูลใหม่น่ารักๆ"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-white hover:text-purple-400 bg-white/20 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-5 bg-purple-50/20">
              {activeTab === "students" && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">รหัสนักศึกษา</label>
                    <input
                      type="text"
                      value={formData.id || formData?.std_class_id || ""}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-2xl outline-none text-gray-500 font-medium"
                      placeholder="650XXXXXXX (สร้างอัตโนมัติ)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">ชื่อ-นามสกุล 🌷</label>
                    <input
                      type="text"
                      value={formData.fullname || ""}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                      placeholder="เช่น สมหญิง รักเรียน"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">สาขาวิชา 📚</label>
                    <input
                      type="text"
                      value={formData.major || ""}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                      placeholder="วิทยาการคอมพิวเตอร์"
                    />
                  </div>
                </>
              )}

              {activeTab === "teachers" && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">รหัสผู้ใช้งาน 👤</label>
                    <input
                      type="text"
                      value={formData.username || ""}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                      placeholder="เช่น teacher01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">รหัสผ่าน 🔑</label>
                    <input
                      type="text"
                      value={formData.password || ""}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                      placeholder="เช่น Teacher@123"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">ชื่อ-นามสกุล 🌷</label>
                    <input
                      type="text"
                      value={formData.fullname || ""}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                      placeholder="เช่น อ.สมใจ รักเด็ก"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">เบอร์โทรศัพท์ 📱</label>
                    <input
                      type="tel"
                      value={formData.tel || ""}
                      onChange={(e) => setFormData({ ...formData, tel: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                      placeholder="0912345678"
                    />
                  </div>
                </>
              )}

              {activeTab === "subjects" && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">รหัสวิชา</label>
                    <input
                      type="text"
                      value={formData.course_id || ""}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-2xl outline-none text-gray-500 font-medium"
                      placeholder="(ระบบจะสร้างให้อัตโนมัติ)"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">ชื่อวิชา 📖</label>
                    <input
                      type="text"
                      value={formData.course_name || ""}
                      onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                      placeholder="เช่น การเขียนโปรแกรม"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">ตั้งค่าเวลาเข้าเรียน ⏰</label>
                    <input
                      type="time"
                      value={formData.time_check || ""}
                      onChange={(e) => setFormData({ ...formData, time_check: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-purple-700 mb-2">อาจารย์ผู้สอน 👩‍🏫</label>
                    <select
                      value={formData.teacher_id || ""}
                      onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                      className="w-full px-4 py-3 bg-white border-2 border-purple-100 rounded-2xl focus:border-purple-300 focus:ring-4 focus:ring-purple-50 outline-none transition-all"
                    >
                      <option disabled value="">เลือกอาจารย์ผู้สอนนะคะ</option>
                      {teachers.map((t, index) => (
                        <option value={t?.id} key={index}>
                          {t.fullname}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Action Buttons ใน Modal */}
              <div className="flex gap-3 pt-6 mt-4 border-t border-purple-100">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-all font-bold"
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-purple-400 to-fuchsia-400 hover:from-purple-500 hover:to-fuchsia-500 text-white rounded-full transition-all shadow-md hover:shadow-lg shadow-purple-200 font-bold"
                >
                  {saving ? (
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
      <Footer />
    </div>
  );
}

export default Dashboard;