import React, { useState, useContext } from 'react';
import axiosClient from '../axiosClient';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [state, setState] = useState('Sign Up');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // State mới
    const [name, setName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { setUserId } = useUser();

    const onsubmitHandler = async (event) => {
        event.preventDefault();
        setErrorMessage(''); // Reset thông báo lỗi

        // Kiểm tra confirm password khi state là 'Sign Up'
        if (state === 'Sign Up' && password !== confirmPassword) {
            setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp');
            return;
        }

        try {
            let response;

            if (state === 'Sign Up') {
                response = await axiosClient.post('/register', {
                    name,
                    email,
                    password, // Gửi xuống backend mật khẩu chính
                });
                console.log('Sign Up Success:', response);
                alert('Create success');
                navigate('/');
            } else {
                response = await axiosClient.post('/login', {
                    email,
                    password,
                });
                console.log('Login Success:', response);
            }

            if (response?.user) {
                const userId = response.user.id;
                console.log("User ID:", userId);
                setUserId(userId);
                navigate('/');
            } else {
                console.error("User data not found.");
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.data?.errCode === 1) {
                setErrorMessage("Thiếu email hoặc mật khẩu");
            } else if (error.response?.data?.errCode >= 2) {
                setErrorMessage("Sai email hoặc mật khẩu");
            }
        }
    };

    return (
        <form className='min-h-[80vh] flex items-center' onSubmit={onsubmitHandler}>
            <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
                <p className='text-2xl font-semibold'>{state === 'Sign Up' ? "Create Account" : "Login"}</p>
                <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book an appointment</p>

                {/* Full Name */}
                {state === "Sign Up" && (
                    <div className='w-full'>
                        <p>Full Name</p>
                        <input
                            className='border border-zinc-300 rounded w-full p-2 mt-1'
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                            placeholder="Enter your full name"
                        />
                    </div>
                )}

                {/* Email */}
                <div className='w-full'>
                    <p>Email</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        placeholder="Enter your email"
                    />
                </div>

                {/* Password */}
                <div className='w-full'>
                    <p>Password</p>
                    <input
                        className='border border-zinc-300 rounded w-full p-2 mt-1'
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        placeholder="Enter your password"
                    />
                </div>

                {/* Confirm Password */}
                {state === "Sign Up" && (
                    <div className='w-full'>
                        <p>Confirm Password</p>
                        <input
                            className='border border-zinc-300 rounded w-full p-2 mt-1'
                            type="password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            value={confirmPassword}
                            placeholder="Confirm your password"
                        />
                    </div>
                )}

                {/* Hiển thị lỗi */}
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}

                {/* Submit Button */}
                <button className='bg-primary text-white w-full py-2 rounded-md text-base'>
                    {state === 'Sign Up' ? "Create Account" : "Login"}
                </button>

                {/* Toggle between Sign Up and Login */}
                {state === 'Sign Up'
                    ? <p>Already have an account? <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>Login here</span></p>
                    : <p>Create a new account? <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>Click here</span></p>
                }
            </div>
        </form>
    );
};

export default Login;
