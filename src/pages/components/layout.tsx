import { ReactNode } from "react";

interface LayoutProps {
    children:ReactNode
}

const Layout:React.FC<LayoutProps> = ({children}) =>{
    return<>
        <div className=" ">
            <div className=" bg-red-50">
                <div className="my-0 mx-auto w-[1200px]">CRM</div>
            </div>
            <div className="my-0 mx-auto w-[1200px] bg-red-100">{children}</div>
        </div>
    </>
}
export default Layout;