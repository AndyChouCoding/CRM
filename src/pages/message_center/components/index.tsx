
import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';

type Status = '處理中' | '已完成' | '未處理';
type From = 'agent' | 'user';
type Platform = 'line' | 'fb';

interface Message {
  content: string;
  timestamp: string;
  from: From;
  platform: Platform;
}

interface ChatProps {
  ticketId: string;
}

const Chat: React.FC<ChatProps> = ({ ticketId }) => {
  const [status, setStatus] = useState<Status>('處理中');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const statuses: Status[] = ['處理中', '已完成', '未處理'];
  // 使用 ref 儲存各 ticket 的訊息快取，避免重複請求與閃爍
  const cacheRef = useRef<Record<string, Message[]>>({});

  // 載入或恢復訊息 & 狀態
  useEffect(() => {
    if (!ticketId) return;
    // 先恢復快取中的訊息
    const cached = cacheRef.current[ticketId];
    if (cached) {
      setMessages(cached);
    } else {
      // 載入狀態
      fetch(`/api/tickets/${ticketId}`)
        .then(res => res.ok ? res.json() : Promise.reject('Status load failed'))
        .then(data => setStatus(data.status as Status))
        .catch(e => console.error('Load status error', e));
      // 載入訊息歷史
      fetch(`/api/tickets/${ticketId}/messages`)
        .then(res => res.ok ? res.json() : Promise.reject('Messages load failed'))
        .then(data => {
          let loaded: Message[] = Array.isArray(data.messages)
            ? data.messages.map((m: any) => ({
                content: m.content,
                timestamp: m.timestamp,
                from: m.platform === 'line' ? 'user' : 'agent',
                platform: m.platform as Platform,
              }))
            : [];
          if (loaded.length === 0) {
            loaded = [{
              content: '您好，請問可以協助我嗎？',
              timestamp: new Date().toISOString(),
              from: 'user',
              platform: 'line',
            }];
          }
          setMessages(loaded);
          cacheRef.current[ticketId] = loaded;
        })
        .catch(e => console.error('Load messages error', e));
    }
  }, [ticketId]);

  // 狀態變更時自動儲存
  useEffect(() => {
    if (!ticketId) return;
    fetch(`/api/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(e => console.error('Save status error', e));
  }, [status, ticketId]);

  // 發送客服(agent)回覆
  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed || !ticketId) return;
    const newMsg: Message = {
      content: trimmed,
      timestamp: new Date().toISOString(),
      from: 'agent',
      platform: 'fb',
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    cacheRef.current[ticketId] = updated;
    setInput('');
    fetch(`/api/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMsg.content, platform: newMsg.platform, timestamp: newMsg.timestamp }),
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
    <div className="border border-black w-[820px] rounded-xl flex flex-col bg-white">
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
      <div className="h-[500px] bg-white p-2 overflow-y-auto flex flex-col">
        {/* {要做為可點選agent然後觀看agent回覆情況} */}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-1 p-2 rounded max-w-[70%] break-words flex flex-col ${
              msg.from === 'user' ? 'self-start text-left' : 'self-end text-right'
            } ${
              msg.platform === 'line' ? 'bg-green-100' : 'bg-blue-100'
            } rounded-2xl`}
          >
            <span>{msg.content}</span>
            <span className="text-xs text-gray-500 mt-1">{formatTime(msg.timestamp)}</span>
          </div>
        ))}
      </div>

      {/* 輸入區 */}
      <div className="p-2 border-t border-black bg-white">
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
