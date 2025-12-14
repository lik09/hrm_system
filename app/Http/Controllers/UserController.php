<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        // Optional: paginate for large datasets
        return User::with('personnel')->get();
        // return User::with('personnel')->paginate(20);
    }

    public function store(Request $request)
    {
        $messages = [
            'username.required' => 'Username is required.',
            'username.unique' => 'This username is already taken.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be valid.',
            'email.unique' => 'This email is already registered.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 6 characters.',
            'role.required' => 'Role is required.',
            'role.in' => 'Role must be one of Admin, Commander, HR, Officer, User.',
            'personnel_id.exists' => 'Selected personnel does not exist.',
            'is_active.boolean' => 'is_active must be true or false.'
        ];

        $data = $request->validate([
            'username'=>'required|unique:users',
            'name'=>'nullable|string|max:255',
            'email'=>'required|email|unique:users',
            'password'=>'required|string|min:6',
            'role'=>'required|string|in:Admin,Commander,HR,Officer,User',
            'personnel_id'=>'nullable|exists:personnels,id',
            'is_active'=>'nullable|boolean'
        ], $messages);

        $data['password'] = Hash::make($data['password']);
        $data['is_active'] = $data['is_active'] ?? true;

        return User::create($data);
    }

    public function show(User $user)
    {
        return $user->load('personnel');
    }

    public function update(Request $request, User $user)
    {
        $messages = [
            'email.email' => 'Email must be valid.',
            'email.unique' => 'This email is already registered.',
            'password.min' => 'Password must be at least 6 characters.',
            'role.in' => 'Role must be one of Admin, Commander, HR, Officer, User.',
            'personnel_id.exists' => 'Selected personnel does not exist.',
            'is_active.boolean' => 'is_active must be true or false.'
        ];

        $validated = $request->validate([
            'name'=>'nullable|string|max:255',
            'email'=>'nullable|email|unique:users,email,'.$user->id,
            'password'=>'nullable|string|min:6',
            'role'=>'nullable|string|in:Admin,Commander,HR,Officer,User',
            'personnel_id'=>'nullable|exists:personnels,id',
            'is_active'=>'nullable|boolean'
        ], $messages);

        if(isset($validated['password'])){
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return $user;
    }

    public function destroy(User $user)
    {
        $deletedUser = $user->toArray();
        $user->delete();

        return response()->json([
            'deleted' => $deletedUser,
            'message' => "User deleted successfully!"
        ], 200);
    }
}
