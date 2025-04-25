import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigate();
  const handle =() =>{
    navigation('/message_center')
  }

  return (
    <>
      <div className="p-10">
        <div className="flex justify-between my-10">
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
          {/* 代辦事項 */}
          <div className="p-4 w-[400px] h-[200px] border-[1px] border-black rounded-xl">
            <div className="text-center p-2">
              <h3>代辦事項</h3>
            </div>
            <div className="p-2 mt-4">
              <ul>
                <li>代辦事項1</li>
                <li>代辦事項2</li>
                <li>代辦事項3</li>
              </ul>
            </div>
          </div>
          {/* 今日個人服務人數 */}
          <div className="p-4 w-[200px] h-[200px] text-center border-[1px] border-black rounded-xl">
            <div className="p-2">
              <h3>今日個人服務人數</h3>
            </div>
            <div className=" text-[70px]">
              <p>20</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between my-10">
          {/* 本週客服趨勢 */}
          <div className="p-4 w-[350px] h-[200px] text-center border-[1px] border-black rounded-xl">
            <div className="p-2">
              <h3>本週客服趨勢</h3>
            </div>
            <div>img</div>
          </div>
          {/* 等待服務人數 */}
          <div className="p-4 w-[200px] h-[200px] text-center border-[1px] border-black rounded-xl">
            <div className="p-2">
              <h3>等待服務人數</h3>
            </div>
            <div className=" text-[70px]">
              <p>1</p>
            </div>
          </div>
          {/* 處理中人數 */}
          <div className="p-4 w-[200px] h-[200px] text-center border-[1px] border-black rounded-xl">
            <div className="p-2">
              <h3>處理中人數</h3>
            </div>
            <div className=" text-[70px]">
              <p>5</p>
            </div>
          </div>
          {/* 今日團隊服務人數 */}
          <div className="p-4 w-[200px] h-[200px] text-center border-[1px] border-black rounded-xl">
            <div className="p-2">
              <h3>今日團隊服務人數</h3>
            </div>
            <div className=" text-[70px]">
              <p>55</p>
            </div>
          </div>
        </div>
        {/* Manager管理區塊 */}
        {user?.role === "manager" && (
          <div className="flex justify-between my-10">
            {/* 配對失敗人數 */}
            <div className="p-4 w-[200px] h-[200px] text-center border-[1px] border-black rounded-xl">
              <div className="p-2">
                <h3>配對失敗人數</h3>
              </div>
              <div className=" text-[70px]">
                <p>1</p>
              </div>
            </div>
            {/* 客戶標籤 */}
            <div className="p-4 w-[200px] h-[200px] text-center border-[1px] border-black rounded-xl place-content-center">
              <a>客戶標籤</a>
            </div>
            {/* 重新分配客服 */}
            <div className="p-4 w-[200px] h-[200px] text-center border-[1px] border-black rounded-xl place-content-center">
              <a>重新分配客服</a>
            </div>
            {/* 客服人員帳號管理 */}
            <div className="p-4 w-[300px] h-[200px] text-center border-[1px] border-black rounded-xl place-content-center">
              <a href="" className="">
                客服人員帳號管理
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
