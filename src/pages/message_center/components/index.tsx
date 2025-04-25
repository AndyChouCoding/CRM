
import React, { useState, useEffect, KeyboardEvent } from 'react';

type Status = '處理中' | '已完成' | '未處理';
type From = 'agent' | 'user';

interface Message {
  content: string;
  timestamp: string;
  from: From;
}

interface ChatProps {
  ticketId: string;
}

const Chat: React.FC<ChatProps> = ({ ticketId }) => {
  const [status, setStatus] = useState<Status>('處理中');
  // 預設由客戶(user)提問開始
  const [messages, setMessages] = useState<Message[]>([{
    content: '您好，請問能幫我解決問題嗎？',
    timestamp: new Date().toISOString(),
    from: 'user',
  }]);
  const [input, setInput] = useState('');
  const statuses: Status[] = ['處理中', '已完成', '未處理'];

  // 載入初始狀態
  useEffect(() => {
    fetch(`/api/tickets/${ticketId}`)
      .then(res => res.ok ? res.json() : Promise.reject('Status load failed'))
      .then(data => setStatus(data.status as Status))
      .catch(e => console.error('Load status error', e));
  }, [ticketId]);

  // 狀態變更時自動儲存
  useEffect(() => {
    fetch(`/api/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(e => console.error('Save status error', e));
  }, [status, ticketId]);

  // 送出客服(agent)回覆
  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newMsg: Message = {
      content: trimmed,
      timestamp: new Date().toISOString(),
      from: 'agent',
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    // 同步到後端
    fetch(`/api/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: newMsg.content,
        platform: 'line',
        timestamp: newMsg.timestamp,
      }),
    }).catch(e => console.error('Send message error', e));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="border border-black w-[820px] rounded-xl flex flex-col">
      {/* 狀態下拉選單 */}
      <div className="h-[60px] border-b border-black flex items-center px-4 place-content-center">
        <select
          id="status-select"
          value={status}
          onChange={e => setStatus(e.target.value as Status)}
          className="p-2 border-gray-300 rounded border-0"
        >
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* 訊息區 */}
      <div className="flex-1 p-2 overflow-y-auto h-[1000px]" style={{ maxHeight: '500px', display: 'flex', flexDirection: 'column' }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-1 p-2 rounded max-w-[70%] break-words ${
              msg.from === 'user'
                ? 'bg-gray-100 self-start text-right rounded-2xl'
                : 'bg-blue-100 self-end text-right rounded-2xl'
            } flex flex-col`}
          >
            <span>{msg.content}</span>
            
            <div></div>
            <div><span className="text-xs text-gray-500 mt-1">{formatTime(msg.timestamp)}</span></div>
          </div>
        ))}
      </div>

      {/* 輸入區 */}
      <div className="p-2 border-t border-black">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-[100px] border border-gray-300 rounded p-2 resize-none overflow-y-auto"
          placeholder="輸入回覆（Shift+Enter 換行，Enter 送出）"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            送出
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

