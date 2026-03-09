import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ auth, users, filters }) {
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedIds, setSelectedIds] = useState([]); // State for bulk selection
    const isAdmin = auth.user.role === 'admin';

    // Handle Search Debounce
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            router.get(route('users.index'), { search }, {
                preserveState: true,
                replace: true,
                preserveScroll: true
            });
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    const createForm = useForm({
        name: '', email: '', password: '', role: 'user',
    });

    const editForm = useForm({
        name: '', email: '', role: '', new_password: '',
    });

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('users.store'), { 
            onSuccess: () => createForm.reset(),
            preserveScroll: true 
        });
    };

    const startEditing = (user) => {
        setEditingId(user.id);
        editForm.setData({ 
            name: user.name, 
            email: user.email, 
            role: user.role,
            new_password: '' 
        });
    };

    const submitUpdate = (e, id) => {
        e.preventDefault();
        editForm.patch(route('users.update', id), {
            onSuccess: () => setEditingId(null),
            preserveScroll: true
        });
    };

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to remove this account?")) {
            router.delete(route('users.destroy', id));
        }
    };

    // --- NEW: BULK DELETE HANDLERS ---
    const toggleSelect = (id) => {
        setSelectedIds(prev => 
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(users.map(u => u.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleBulkDelete = () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) {
            router.delete(route('users.bulk-destroy'), {
                data: { ids: selectedIds },
                onSuccess: () => setSelectedIds([]),
                preserveScroll: true
            });
        }
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-bold text-xl text-gray-800 leading-tight">User Access Management</h2>}
        >
            <Head title="User Management" />
            
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
                
                {/* Registration Form */}
                {isAdmin && (
                    <div className="bg-white p-6 rounded shadow mb-6 border-l-4 border-indigo-600">
                        <h3 className="font-semibold text-sm uppercase tracking-widest text-gray-500 mb-4">
                            Register New System Account
                        </h3>
                        <form onSubmit={submitCreate} className="flex flex-wrap gap-2">
                            <input className="border p-2 rounded flex-1 min-w-[200px] text-sm" placeholder="Full Name" value={createForm.data.name} onChange={e => createForm.setData('name', e.target.value)} required />
                            <input className="border p-2 rounded flex-1 min-w-[200px] text-sm" placeholder="Email Address" value={createForm.data.email} onChange={e => createForm.setData('email', e.target.value)} required />
                            <input className="border p-2 rounded flex-1 min-w-[200px] text-sm" type="password" placeholder="Password" value={createForm.data.password} onChange={e => createForm.setData('password', e.target.value)} required />
                            <select className="border p-2 rounded w-32 text-sm" value={createForm.data.role} onChange={e => createForm.setData('role', e.target.value)}>
                                <option value="user">USER</option>
                                <option value="admin">ADMIN</option>
                            </select>
                            <button className="bg-indigo-600 text-white px-6 rounded font-bold hover:bg-indigo-700 transition text-sm">Create Account</button>
                        </form>
                    </div>
                )}

                {/* Toolbar: Search and Bulk Actions */}
                <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="relative w-full max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                        />
                    </div>

                    <div className="flex gap-2">
                        {/* Conditional Bulk Delete Button */}
                        {isAdmin && selectedIds.length > 0 && (
                            <button 
                                onClick={handleBulkDelete}
                                className="inline-flex items-center px-4 py-2 bg-red-600 rounded-md font-bold text-xs text-white uppercase tracking-widest hover:bg-red-700 transition shadow-sm animate-pulse"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Selected ({selectedIds.length})
                            </button>
                        )}
                        
                        {isAdmin && (
                            <a href={route('users.export')} className="inline-flex items-center justify-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-bold text-xs text-white uppercase tracking-widest hover:bg-green-700 transition shadow-sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Export CSV
                            </a>
                        )}
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden p-6 border border-gray-100">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b bg-gray-50">
                                {isAdmin && (
                                    <th className="p-4 w-10">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            onChange={handleSelectAll}
                                            checked={selectedIds.length === users.length && users.length > 0}
                                        />
                                    </th>
                                )}
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Account Details</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">System Permission</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Last Login</th>
                                <th className="p-4 font-bold text-xs uppercase tracking-wider text-gray-500">Member Since</th>
                                <th className="p-4 text-right font-bold text-xs uppercase tracking-wider text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? (
                                users.map((u) => (
                                    <tr key={u.id} className={`border-b hover:bg-gray-50 transition ${selectedIds.includes(u.id) ? 'bg-indigo-50/50' : ''}`}>
                                        {isAdmin && (
                                            <td className="p-4">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                    checked={selectedIds.includes(u.id)}
                                                    onChange={() => toggleSelect(u.id)}
                                                />
                                            </td>
                                        )}
                                        <td className="p-4">
                                            {editingId === u.id ? (
                                                <div className="flex flex-col gap-2">
                                                    <input className="border p-2 text-sm rounded w-full" value={editForm.data.name} onChange={e => editForm.setData('name', e.target.value)} />
                                                    <input className="border p-2 text-sm rounded w-full" value={editForm.data.email} onChange={e => editForm.setData('email', e.target.value)} />
                                                    {isAdmin && (
                                                        <input 
                                                            className="border p-2 text-sm rounded w-full bg-yellow-50" 
                                                            placeholder="New Password (Leave blank to keep current)" 
                                                            type="password"
                                                            onChange={e => editForm.setData('new_password', e.target.value)} 
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="font-bold text-gray-900">{u.name}</div>
                                                    {(isAdmin || auth.user.id === u.id) && (
                                                        <div className="text-sm text-indigo-600">{u.email}</div>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingId === u.id && isAdmin ? (
                                                <select className="text-xs border rounded p-1 font-bold text-indigo-700" value={editForm.data.role} onChange={e => editForm.setData('role', e.target.value)}>
                                                    <option value="user">USER</option>
                                                    <option value="admin">ADMIN</option>
                                                </select>
                                            ) : (
                                                <span className={`uppercase text-[10px] font-black px-2 py-1 rounded tracking-widest ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {u.role}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-sm font-medium ${u.last_login === 'Never' ? 'text-gray-400 italic' : 'text-gray-600'}`}>
                                                {u.last_login}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-gray-500 font-medium">
                                                {u.formatted_date}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-3">
                                            {editingId === u.id ? (
                                                <>
                                                    <button onClick={(e) => submitUpdate(e, u.id)} className="text-green-600 text-sm font-bold hover:underline">Save</button>
                                                    <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm font-bold hover:underline">Cancel</button>
                                                </>
                                            ) : (
                                                (isAdmin || auth.user.id === u.id) && (
                                                    <>
                                                        <button onClick={() => startEditing(u)} className="text-indigo-600 text-sm font-bold hover:underline">Edit</button>
                                                        <button onClick={() => handleDelete(u.id)} className="text-red-600 text-sm font-bold hover:underline">Delete</button>
                                                    </>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isAdmin ? 6 : 5} className="p-8 text-center text-gray-500 italic">No matches found for your search.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}