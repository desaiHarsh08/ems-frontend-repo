import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleLoadingStatus } from '../app/features/loadingSlice';
import Swal from 'sweetalert2';
import { setUserCredentials } from '../app/features/authSlice';
import md5 from 'md5';

const Root = () => {

    const navigate = useNavigate();

    const host = useSelector((state) => state.host.host);

    const dispatch = useDispatch();

    const [otpResendTime, setOtpResendTime] = useState(120);
    const [intervalId, setIntervalId] = useState(null);
    const [credentials, setCredentials] = useState({ email: '', otp: '' });
    const [buttonInfo, setButtonInfo] = useState({ buttonDisabled: true, buttonText: "Generate OTP" });

    useEffect(() => {
        if (otpResendTime === 0) {
            clearInterval(intervalId);
            setIntervalId(null);
            setOtpResendTime(120);
            setButtonInfo({ buttonDisabled: !isValidEmail(credentials.email), buttonText: "Generate OTP" });
        }
    }, [otpResendTime]);

    const startTime = () => {
        if (!intervalId && otpResendTime > 0) {
            const id = setInterval(() => {
                setOtpResendTime((prevTime) => prevTime - 1);
            }, 1000);
            setIntervalId(id); // Save the interval ID
        }
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
        if (name === 'email') {
            setButtonInfo({ buttonDisabled: !isValidEmail(value), buttonText: "Generate OTP" });
        }
    };

    const handleGenerateOTP = async () => {
        // console.log("Generate OTP...");
        dispatch(toggleLoadingStatus());
        try {
            const data = await axios.post(`${host}/api/otp/generate`, { email: credentials.email });
            // console.log(data);
            Swal.fire({
                title: 'Alert',
                text: 'An OTP is been sent to your provided email address...!',
                icon: 'info', // Options: 'success', 'error', 'warning', 'info'
            });
            setButtonInfo((prev) => ({ ...prev, buttonText: 'Sent..!' }));
            dispatch(toggleLoadingStatus());
            startTime();
        } catch (error) {
            if (error?.response.status === 401) {
                Swal.fire({
                    title: 'Alert',
                    text: 'No user with this email address exist...!',
                    icon: 'error', // Options: 'success', 'error', 'warning', 'info'
                });
                return;
            }
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (credentials.email === '' || credentials.otp === '') {
            Swal.fire({
                title: 'Alert',
                text: 'Please enter the valid credentials...!',
                icon: 'error', // Options: 'success', 'error', 'warning', 'info'
            });
            return;
        }
        const data = await axios.post(`${host}/api/auth/login`, credentials);
        // console.log(data);
        dispatch(toggleLoadingStatus());
        dispatch(setUserCredentials({ userCredentials: data?.data?.payload }));
        const emailHash = md5(credentials.email);
        const avatarUrl = `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;
        localStorage.setItem('picture', avatarUrl);
        navigate('/dashboard', { replace: true });
        // console.log(data);
    }

    return (
        <div className='w-full h-full text-slate-500'>
            {/* APP NAME */}
            <div id="app-name" className="app-name flex h-[10%] items-center justify-center">
                <h1 className='text-2xl font-semibold uppercase text-center'>Exam &nbsp;Management &nbsp;App</h1>
            </div>

            {/* APP LOGO */}
            <div id="app-logo" className='app-logo flex justify-center items-center h-[25%] '>
                <img src="/logo.webp" alt="app-logo" className='w-40 h-40 rounded-full border border-slate-200' />
            </div>

            {/* LOGIN CONTAINER */}
            <div className="login-container flex flex-col items-center h-[60%]" id="login">
                <h2 className='text-xl my-7 text-center w-full'>Login to continue!</h2>
                <form onSubmit={handleLogin} className='flex flex-col justify-center gap-4 w-[85%] sm:w-1/2'>
                    <div className="email w-full">
                        <label htmlFor="email"></label>
                        <input type="email" value={credentials.email} onChange={handleChange} name="email" id="email" className='w-full border outline-none px-4 py-2 rounded-md border-slate-300' placeholder='Enter your email...' />
                    </div>
                    <div className='w-full space-y-2'>
                        <div className="otp w-full ">
                            <label htmlFor="otp"></label>
                            <input type="text" value={credentials.otp} onChange={handleChange} name="otp" id="otp" className='w-full border outline-none px-4 py-2 rounded-md border-slate-300' placeholder='Enter your otp...' />
                        </div>
                        <div className='space-x-2 text-xs'>

                            <button disabled={buttonInfo.buttonDisabled} onClick={handleGenerateOTP} type='button' className={`px-4 py-2  border ${buttonInfo.buttonDisabled ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium rounded-md min-w-[140px]`}>{buttonInfo.buttonText}</button>
                            {intervalId && <span>Resend OTP in <span>{otpResendTime}</span>s</span>}
                        </div>
                    </div>
                    <div className="btns my-7 w-full flex justify-center">
                        <button className='px-4 py-1 border bg-red-500 hover:bg-red-600 text-white font-medium rounded-md min-w-[140px]'>Verify</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Root