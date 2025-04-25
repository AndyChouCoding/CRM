import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Chat from "./components";

const MessageCenter = () => {
  const { user } = useAuth();
  const navigation = useNavigate();
  const handle = () => {
    navigation("/message_center");
  };

  return (
    <>
      <div className="flex p-10 justify-between">
        <div className="">
          {/* User資料 */}
          {user?.role === "manager" ? (
            <div>
              {/* manager */}
              <div className="p-2 w-[300px] h-[200px] border-[1px] border-black rounded-xl">
                <div className="flex justify-between items-center p-1">
                  <div className=" bg-slate-500 w-[60px] h-[60px] rounded-full"></div>
                  <div className="text-center">
                    <div>{user?.name}</div>
                    <div className=" bg-purple-500 text-white p-2 rounded-xl">
                      {user?.role}
                    </div>
                  </div>
                </div>
                <div className=" border-[1px] border-black"></div>
                <div className=" p-2">
                  <div onClick={handle}>
                    <a href="">負責帳號</a>
                  </div>
                  <div>
                    <a href="">全部帳號</a>
                  </div>
                  <div>
                    <a href="">負責標籤</a>
                  </div>
                  <div>
                    <a href="">無參與分配</a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {" "}
              {/* agent */}
              <div className="p-2 w-[300px] h-[200px] border-[1px] border-black rounded-xl">
                <div className="flex justify-between items-center p-1">
                  <div className=" bg-slate-500 w-[60px] h-[60px] rounded-full"></div>
                  <div className="text-center">
                    <div>{user?.name}</div>
                    <div className=" bg-purple-500 text-white p-2 rounded-xl">
                      {user?.role}
                    </div>
                  </div>
                </div>
                <div className=" border-[1px] border-black"></div>
                <div className=" p-2">
                  <div>
                    <h4>負責帳號</h4>
                    <div className="grid grid-cols-4 gap-1 text-[12px]">
                      <div>123</div>
                      <div>123</div>
                      <div>123</div>
                      <div>123</div>
                    </div>
                  </div>
                  <div>
                    <h4>負責標籤</h4>
                    <div className="grid grid-cols-3 gap-1 text-[12px] text-white text-center ">
                      <div className="p-1 bg-slate-400">hashTag1</div>
                      <div className="p-1 bg-slate-400">hashTag2</div>
                      <div className="p-1 bg-slate-400">hashTag3</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div>user</div>
        </div>
        <div className="ml-10">
          <Chat ticketId={""} />
        </div>
      </div>
    </>
  );
};

export default MessageCenter;
