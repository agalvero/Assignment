import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, totalUsers, adminCount }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Home</h2>}
        >
            <Head title="Welcome" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border-b-4 border-indigo-500">
                        <div className="p-10 text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="p-4 bg-indigo-100 rounded-full">
                                    <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>

                            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                                Welcome to the User Management Program
                            </h1>
                            
                            <div className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                                <p className="mb-2">
                                    Hello, <span className="font-bold text-indigo-600">{auth.user.name}</span>! 
                                    {" "}
                                    You are currently logged in as {" "}
                                    <span className="font-bold text-gray-900 underline decoration-indigo-300">
                                        {auth.user.role === 'admin' ? 'an Admin' : 'a User'}
                                    </span>.
                                </p>

                                <p className="text-sm font-medium text-gray-500">
                                    Use the portal below to manage system access and account details.
                                </p>
                            </div>

                            <div className="flex justify-center gap-4">
                                <Link
                                    href={route('users.index')}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition transform hover:-translate-y-1"
                                >
                                    Go to User Management
                                </Link>
                                
                                <Link
                                    href={route('profile.edit')}
                                    className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-lg shadow transition"
                                >
                                    My Profile
                                </Link>
                            </div>
                        </div>
                    </div>

                    {}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {}
                        <div className="bg-white p-6 rounded-lg shadow text-center border-t-2 border-indigo-200">
                            <div className="text-gray-500 text-sm uppercase font-bold tracking-wider">Total Accounts</div>
                            <div className="text-2xl font-bold text-indigo-600">{totalUsers} Users</div>
                        </div>

                        {}
                        <div className="bg-white p-6 rounded-lg shadow text-center border-t-2 border-green-200">
                            <div className="text-gray-500 text-sm uppercase font-bold tracking-wider">Security Profile</div>
                            <div className="text-2xl font-bold text-green-600">{adminCount} Admins</div>
                        </div>

                        {}
                        <div className="bg-white p-6 rounded-lg shadow text-center border-t-2 border-orange-200">
                            <div className="text-gray-500 text-sm uppercase font-bold tracking-wider">Your Access</div>
                            <div className="text-2xl font-bold text-orange-500 uppercase">{auth.user.role}</div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}