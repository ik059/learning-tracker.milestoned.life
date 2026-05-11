import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';
import api from '../utils/api';

const Login = ()=>{
    const navigate = useNavigate()
    const [form, setForm] = useState({email: "", password:""})
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) =>{
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try{
            const respone = await api.post('/auth/login', form)

            localStorage.setItem('token', respone.data.token)
            localStorage.setItem('user', JSON.stringify(respone.data.user))

            navigate('/')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch(err : any){
            setError(err.response?.data?.message || 'Login Failed!')
        }
        finally{
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        learning
                        <span className="text-purple-500">.milestoned</span>
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">Sign in to you account</p>
                </div>
                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e=>setForm({...form, email:e.target.value})}
                        placeholder="you@domain.ext"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl foucs:outline-none focus:rinf-2 focus:ring-pueple-500"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                        type="password"
                        required
                        value={form.password}
                        onChange={e=>setForm({...form, password: e.target.value})}
                        placeholder="*********"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                    </div>
                    <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors">
                        {isLoading ? "Signing in . . . ":"Sign In"}
                    </button>
                </form>
                <p className="text-center text-sm text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-purple-600 hover:underline font-medium">
                    Register here
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login