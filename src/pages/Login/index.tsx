import { Navigate, useNavigate } from "react-router-dom";



const Login = () => {

    const navigate = useNavigate();
    const handleLogin = () => {
        console.log('user login')
        navigate("/dashboard");
      };

    return<>
        <div className="">
            <div>
                <h2>Login</h2>
                </div>
            <div>
                <div>
                    <label htmlFor="">accont</label><input></input>
                </div>
                <div>
                    <label htmlFor="">password</label><input></input>
                </div>
            </div>
            <div>
                <button onClick={handleLogin}>login</button>
            </div>
        </div>
    </>
} 
export default Login;