import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const Register = ()=>{
    const navigate = useNavigate()
    const [form, setForm]=useState({name: '', email:'', password:''})
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent)=>{
        e.preventDefault()
        if(form.password.length < 6){
            setError("Password must be at least 6 charecteres!")
            return
        }
        setIsLoading(true)
        setError('')
        try{
            const response = await api.post('/auth/register', form)

            localStorage.setItem('token', response.data.token)
            localStorage.setItem('user', response.data.user)

            navigate('/')
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        catch(err:any){
            setError(err.response?.data?.message || 'Registration Failed!')
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
                        <span className="text-purple-600">.milestoned</span>
                    </h1>
                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                value={form.name}
                                onChange={e=>setForm({...form, name: e.target.value})}
                                placeholder="John Doe"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input 
                                type="email"
                                required
                                value={form.email}
                                onChange={e=>{setForm({...form, email: e.target.value})}}
                                placeholder="you@domain.ext"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input 
                                type="password"
                                required
                                value={form.password}
                                onChange={e=>setForm({...form, password:e.target.value})}
                                placeholder="******"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>
                        <button
                            disabled={isLoading}
                            className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                            type="submit"
                            >
                                {isLoading ? "Singing Up . . ." : "Sign Up"}
                            </button>
                    </form>
                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account? {' '}
                        <Link to='/login' className="text-purple-600 hover:underline font-medium">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register