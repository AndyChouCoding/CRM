import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
    children:ReactNode
}

const Layout:React.FC<LayoutProps> = ({children}) =>{

    const navigate = useNavigate()
    const handleLogout = () => {
        console.log('logout');
        navigate('/')
    }

    return<>
        <div className=" ">
            <div className=" bg-red-50 py-4">
                <div className="my-0 mx-auto w-[1200px] flex justify-between">
                    <div>CRM</div>
                    <div onClick={handleLogout}>logout</div>
                </div>
            </div>
            <div className="my-0 mx-auto w-[1200px] bg-red-100">{children}</div>
        </div>
    </>
}
export default Layout;