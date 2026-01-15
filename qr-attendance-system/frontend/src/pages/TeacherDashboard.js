import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import AuthContext from "../context/AuthContext";
import "../App.css";

const TeacherDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Toggles to switch views: 'session', 'create-class', 'update-class'
  const [activeTab, setActiveTab] = useState("session");

  // --- Session State ---
  const [sessionName, setSessionName] = useState("");
  const [createdSession, setCreatedSession] = useState(null);

  // --- Create Class State ---
  const [classData, setClassData] = useState({ className: "", classCode: "", description: "" });
  const [createdClass, setCreatedClass] = useState(null);

  // --- Update Class State (NEW) ---
  const [updateData, setUpdateData] = useState({ id: "", className: "", description: "" });
  const [updateMsg, setUpdateMsg] = useState("");

  // General Error State
  const [error, setError] = useState("");

  // Protect the route
  useEffect(() => {
    if (!user || user.role !== "teacher") {
      navigate("/login");
    }
  }, [user, navigate]);

  // --- HANDLER: Create Session ---
  const handleCreateSession = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await API.post("/sessions/create", {
        sessionName,
        createdBy: user.name,
      });
      setCreatedSession(data.session);
      setSessionName(""); 
    } catch (err) {
      setError("Failed to create session.");
    }
  };

  // --- HANDLER: Create Class ---
  const handleCreateClass = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await API.post("/classes", {
        ...classData,
        teacherId: user.id 
      });
      setCreatedClass(data.class);
      // Auto-fill the Update form with this new ID so user can test update immediately
      setUpdateData({ ...updateData, id: data.class._id, className: data.class.className });
      
      setClassData({ className: "", classCode: "", description: "" }); 
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create class.");
    }
  };

  // --- HANDLER: Update Class (NEW) ---
  const handleUpdateClass = async (e) => {
    e.preventDefault();
    setError("");
    setUpdateMsg("");

    try {
      // API Call: PUT /classes/:id
      const { data } = await API.put(`/classes/${updateData.id}`, {
        className: updateData.className,
        description: updateData.description
      });
      
      setUpdateMsg(`✅ Class updated to: "${data.class.className}"`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update class. Check ID.");
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Teacher Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      {/* View Toggles */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "center" }}>
        <button 
          onClick={() => setActiveTab("session")}
          style={{ background: activeTab === "session" ? "#007bff" : "#6c757d" }}
        >
          Create Session
        </button>
        <button 
          onClick={() => setActiveTab("create-class")}
          style={{ background: activeTab === "create-class" ? "#007bff" : "#6c757d" }}
        >
          Create Class
        </button>
        <button 
          onClick={() => setActiveTab("update-class")}
          style={{ background: activeTab === "update-class" ? "#007bff" : "#6c757d" }}
        >
          Update Class
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* --- FORM 1: CREATE SESSION --- */}
      {activeTab === "session" && (
        <div className="card">
          <h3>Create Attendance Session</h3>
          <form onSubmit={handleCreateSession}>
            <input
              type="text"
              placeholder="Enter Session Name (e.g. Week 9)"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
              required
            />
            <button type="submit">Generate QR Code</button>
          </form>

          {createdSession && (
            <div className="result-card">
              <h3>Session Created!</h3>
              <p><strong>Session ID:</strong> {createdSession._id}</p>
              <div className="qr-container">
                <img src={createdSession.qrCode} alt="Session QR Code" />
              </div>
            </div>
          )}
        </div>
      )}

      {/* --- FORM 2: CREATE CLASS --- */}
      {activeTab === "create-class" && (
        <div className="card">
          <h3>Create New Class</h3>
          <form onSubmit={handleCreateClass}>
            <input
              type="text"
              placeholder="Class Name (e.g. Software Req)"
              value={classData.className}
              onChange={(e) => setClassData({...classData, className: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Class Code (e.g. SIT725)"
              value={classData.classCode}
              onChange={(e) => setClassData({...classData, classCode: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Description"
              value={classData.description}
              onChange={(e) => setClassData({...classData, description: e.target.value})}
            />
            <button type="submit">Create Class</button>
          </form>

          {createdClass && (
            <div className="result-card" style={{borderColor: "green"}}>
              <h3 style={{color: "green"}}>Class Created!</h3>
              <p><strong>ID:</strong> {createdClass._id}</p>
              <p><small>Copy this ID to update the class later.</small></p>
            </div>
          )}
        </div>
      )}

      {/* --- FORM 3: UPDATE CLASS (NEW) --- */}
      {activeTab === "update-class" && (
        <div className="card">
          <h3>Update Existing Class</h3>
          <p><small>Paste the Class ID you want to edit.</small></p>
          <form onSubmit={handleUpdateClass}>
            <input
              type="text"
              placeholder="Paste Class ID here..."
              value={updateData.id}
              onChange={(e) => setUpdateData({...updateData, id: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="New Class Name"
              value={updateData.className}
              onChange={(e) => setUpdateData({...updateData, className: e.target.value})}
            />
            <input
              type="text"
              placeholder="New Description"
              value={updateData.description}
              onChange={(e) => setUpdateData({...updateData, description: e.target.value})}
            />
            <button type="submit" style={{background: "#ffc107", color: "black"}}>Update Class</button>
          </form>

          {updateMsg && <p className="status-message" style={{color: "green"}}>{updateMsg}</p>}
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;