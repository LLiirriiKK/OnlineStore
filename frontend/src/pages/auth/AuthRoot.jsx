import React from 'react';
import './style.css'
import {useLocation} from "react-router-dom";
import LoginPage from "./loginPage/Login";
import RegisterPage from "./registerPage/Register";
import {Box} from "@mui/material";
import {instance} from "../../utils/axios";
import {useForm} from "react-hook-form";
import Test from "./testPage/Test";
import { useNavigate } from "react-router-dom";

const ACCESS_TOKEN_KEY = "access_token"
let errMessage = ""
const AuthRoot = () => {

    const location = useLocation();
    const navigate = useNavigate()
    const {
        register,
        reset,
        watch,
        formState:{errors},
        handleSubmit
        } = useForm()

    const handleSubmitForm = async (data) => {
        if (location.pathname === '/login'){
            const userData = {
                login: data.login,
                password: data.password
            }
            try {
                const response = await instance.post('login', userData)
                localStorage.setItem(ACCESS_TOKEN_KEY, response.data.token)
                console.log(response.data)
                // navigate("/home")
            }catch (error){
                errMessage = error.response.data.message
            }


        }else if (location.pathname === '/register'){
            if (data.regPassword !== data.regRepeatPassword){
                errMessage = 'Passwords dont match'
            }else{
                const userData = {
                    email: data.regEmail,
                    login: data.regLogin,
                    password: data.regPassword
                }
                try {
                    const response = await instance.post('register', userData)
                    errMessage = ''
                    console.log(response)
                }catch (error){
                    errMessage = error.response.data.message
                    console.error(error.response.data)
                }
            }
        }
        else{
            try {
                const response = await instance.post('test', {},{headers: {
                        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
                    }})
                errMessage = '';
                console.log("isAuth:", response.data)
            }catch (error){

                console.error("isAuth:", error.response.data)
            }

        }

    }

    return (
        <div className='root'>
            <form className='form' onSubmit={handleSubmit(handleSubmitForm)}>
                <Box sx = {{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    margin: 'auto',
                    padding: 5,
                    borderRadius: 2,
                    boxShadow: '5px 5px 10px #ccc',
                    width: '30%',
                }}>
                    {location.pathname === '/login' ? <LoginPage register = {register} errors = {errors} watch = {watch} errMessage = {errMessage} reset = {reset}/> : location.pathname === '/register' ?
                        <RegisterPage register = {register} errors = {errors} watch = {watch} errMessage={errMessage}/> : location.pathname === '/test' ? <Test /> : null}
                </Box>
            </form>

        </div>
    );
};

export default AuthRoot;