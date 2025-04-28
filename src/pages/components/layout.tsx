import { ReactNode, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";  // 確保路徑正確

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // 紀錄登入時的 timestamp
  const loginTimestampRef = useRef<number>(Date.now());
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00");

  // 登入與登出時初始化或重置 elapsedTime
  useEffect(() => {
    if (user) {
      loginTimestampRef.current = Date.now();
    } else {
      setElapsedTime("00:00:00");
    }
  }, [user]);

  // 每秒更新一次已登入時長
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      const diffMs = Date.now() - loginTimestampRef.current;
      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      const hh = hours.toString().padStart(2, "0");
      const mm = minutes.toString().padStart(2, "0");
      const ss = seconds.toString().padStart(2, "0");
      setElapsedTime(`${hh}:${mm}:${ss}`);
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);
  
  const handleLogo = () => {
    navigate("/dashboard")
  }
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <div className="bg-red-50 py-4">
        <div className="mx-auto w-[1200px] flex justify-between items-center">
          <div onClick={handleLogo}>CRM</div>
          {user && (
            <div className="flex items-center space-x-4">
              <span>已登入時長: {elapsedTime}</span>
              <button onClick={handleLogout} className="">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mx-auto w-[1200px] ">{children}</div>
    </div>
  );
};

export default Layout;