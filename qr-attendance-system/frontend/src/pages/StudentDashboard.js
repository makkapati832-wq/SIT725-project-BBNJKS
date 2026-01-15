import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import AuthContext from "../context/AuthContext";

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Attendance State
  const [sessionId, setSessionId] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Classes State (NEW)
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "student") {
      navigate("/login");
    } else {
      // Fetch classes when dashboard loads
      fetchClasses();
    }
  }, [user, navigate]);

  const fetchClasses = async () => {
    try {
      const { data } = await API.get("/classes");
      setClasses(data);
    } catch (err) {
      console.error("Failed to fetch classes");
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    try {
      await API.post("/attendance/mark", {
        studentId: user.id,
        sessionId: sessionId.trim(),
      });
      setSuccessMsg("✅ Attendance Marked Successfully!");
      setSessionId("");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 400) {
          setErrorMsg("⚠️ " + err.response.data.message);
        } else if (err.response.data.error?.includes("Cast to ObjectId")) {
          setErrorMsg("❌ Invalid Session ID format.");
        } else {
          setErrorMsg("❌ Failed to mark attendance.");
        }
      } else {
        setErrorMsg("❌ Server Error.");
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Student Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      {/* --- MARK ATTENDANCE CARD --- */}
      <div className="card">
        <h3>Mark Attendance</h3>
        <form onSubmit={handleMarkAttendance}>
          <label>Enter Session ID:</label>
          <input
            type="text"
            placeholder="Paste Session ID here..."
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            required
          />
          <button type="submit">Submit Attendance</button>
        </form>
        
        {successMsg && <p className="status-message" style={{color: "green"}}>{successMsg}</p>}
        {errorMsg && <p className="status-message" style={{color: errorMsg.includes("⚠️") ? "#d9534f" : "red"}}>{errorMsg}</p>}
      </div>

      {/* --- AVAILABLE CLASSES CARD (NEW) --- */}
      <div className="card" style={{marginTop: "20px", textAlign: "left"}}>
        <h3>📚 Available Classes</h3>
        <p><small>These are the active courses in the system.</small></p>
        
        {classes.length === 0 ? (
          <p>No classes available yet.</p>
        ) : (
          <ul style={{listStyle: "none", padding: 0}}>
            {classes.map((cls) => (
              <li key={cls._id} style={{
                background: "#f8f9fa", 
                margin: "10px 0", 
                padding: "10px", 
                borderRadius: "5px",
                borderLeft: "4px solid #007bff"
              }}>
                <strong>{cls.classCode}</strong>: {cls.className}
                <br />
                <small style={{color: "#666"}}>{cls.description}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;