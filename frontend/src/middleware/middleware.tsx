import React,{type ReactNode} from "react";
import { useNavigate } from "react-router-dom";

 interface AuthMiddlewareProps {
    children: ReactNode;
}

const AuthMiddleware:React.FC<AuthMiddlewareProps> = ({children}) => {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    if(!token){
        navigate("/", {replace:true})
        return null;
    }

    return <>{children}</>

}

export default AuthMiddleware;