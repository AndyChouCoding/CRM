import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate("/dashboard");
    } catch {
      alert("登入失敗");
    }
  };

  return (
    <>
      <div className="">
        <form
          onSubmit={handleSubmit}
          className="max-w-sm mx-auto mt-20 p-6 bg-white rounded-md shadow-md"
        >
          <h2 className="text-2xl mb-4">登入 CRM 系統</h2>
          <div>
            <p>可使用Manager,Agent模式登入</p>
            <p>username:manager,agent;password:123456</p>
          </div>
          <input
            type="text"
            className="w-full mb-3 p-2 border"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full mb-3 p-2 border"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-600 text-white rounded"
          >
            登入
          </button>
        </form>
      </div>
    </>
  );
};
export default Login;
