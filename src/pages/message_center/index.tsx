
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Chat from "./components/"; // 保留原先引用

interface Agent {
  id: string;
  name: string;
}
interface Customer {
  id: string;
  name: string;
}
interface Ticket {
  id: string;
  customerId: string;
  agentId: string;
}

const MessageCenter: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");

  // 載入 agent 清單（manager）或設定自己（agent）
  useEffect(() => {
    if (user?.role === "manager") {
      fetch(`/api/users?role=agent`)
        .then(res => res.ok ? res.json() : Promise.reject("Agents load failed"))
        .then(data => {
          setAgents(data.users);
          if (data.users.length) setSelectedAgent(data.users[0]);
        })
        .catch(e => console.error("Load agents error", e));
    } else if (user?.role === "agent") {
      setSelectedAgent({ id: user.id, name: user.name });
    }
  }, [user]);

  // 載入該 agent 的客戶列表
  useEffect(() => {
    if (!selectedAgent) return;
    fetch(`/api/customers?agentId=${selectedAgent.id}`)
      .then(res => res.ok ? res.json() : Promise.reject("Customers load failed"))
      .then(data => {
        setCustomers(data.customers);
        if (data.customers.length) setSelectedCustomer(data.customers[0]);
        else setSelectedCustomer(null);
      })
      .catch(e => console.error("Load customers error", e));
  }, [selectedAgent]);

  // 根據選中客戶取出 ticket
  useEffect(() => {
    if (!selectedAgent || !selectedCustomer) return;
    fetch(`/api/tickets?agentId=${selectedAgent.id}`)
      .then(res => res.ok ? res.json() : Promise.reject("Tickets load failed"))
      .then(data => {
        const ticket = (data.tickets as Ticket[])
          .find(t => t.customerId === selectedCustomer.id);
        setSelectedTicketId(ticket ? ticket.id : "");
      })
      .catch(e => console.error("Load tickets error", e));
  }, [selectedAgent, selectedCustomer]);

  const handleNavigate = () => {
    navigate("/message_center");
  };

  return (
    <div className="flex p-10 justify-between">
      {/* 左側面板 */}
      <div className="w-[300px]">
        {user?.role === "manager" && (
          <div className="mb-4">
            <h4 className="mb-2 font-bold">Select Agent</h4>
            <ul>
              {agents.map(a => (
                <li
                  key={a.id}
                  className={`p-2 cursor-pointer ${selectedAgent?.id === a.id ? 'bg-gray-200' : ''}`}
                  onClick={() => setSelectedAgent(a)} // MODIFIED: manager 可切換 agent
                >
                  {a.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mb-4">
          <h4 className="mb-2 font-bold">客戶列表</h4>
          <ul>
            {customers.map(c => (
              <li
                key={c.id}
                className={`p-2 cursor-pointer ${selectedCustomer?.id === c.id ? 'bg-gray-200' : ''}`}
                onClick={() => setSelectedCustomer(c)} // MODIFIED: 點選客戶改變聊天室
              >
                <div className="flex items-center">
                  <div className="bg-slate-500 w-[50px] h-[50px] rounded-full mr-4" />
                  <div>
                    <div>{c.name}</div>
                    <div className="text-gray-500 text-[12px]">您有新訊息</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-2 w-full h-[200px] border border-black rounded-xl">
          {/* 原先使用者卡片保持不動 */}
          <div className="flex justify-between items-center p-1">
            <div className="bg-slate-500 w-[60px] h-[60px] rounded-full" />
            <div className="text-center">
              <div>{user?.name}</div>
              <div className="bg-purple-500 text-white p-2 rounded-xl">{user?.role}</div>
            </div>
          </div>
          <div className="border-t border-black my-2" />
          <div className="p-2 space-y-1 text-sm">
            <div onClick={handleNavigate} className="cursor-pointer">負責帳號</div>
            <div>全部帳號</div>
            <div>負責標籤</div>
            <div>無參與分配</div>
          </div>
        </div>
      </div>

      {/* 右側聊天區 */}
      <div className="flex-1 ml-10">
        {selectedTicketId ? (
          <Chat ticketId={selectedTicketId} /> // MODIFIED: 直接傳入動態 ticketId
        ) : (
          <div className="text-gray-500">請選擇一位客戶</div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;

