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
      <div className="bg-[#faf7f5] pt-20">
        <form
          onSubmit={handleSubmit}
          className="max-w-sm mx-auto p-6 bg-white rounded-md shadow-md"
        >
          <h2 className="text-2xl mb-4 p-4">登入 CRM 系統</h2>
          <input
            type="text"
            className="w-full mb-3 p-2 border rounded-xl"
            placeholder="使用者代號"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            className="w-full mb-3 p-2 border rounded-xl"
            placeholder="使用者密碼"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full my-2 p-2 bg-orange-400 text-white rounded-md "
          >
            登入
          </button>
          <div className="mt-4">
            <p>因為使用者不同而有不同的介面</p>
            <p>可分別使用Manager或Agent模式登入</p>
            <p>username:manager,agent;password:123456</p>
          </div>
        </form>
      </div>
    </>
  );
};
export default Login;
