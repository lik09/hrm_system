<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        return User::with('personnel')->get();
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
        'name'=>'nullable',
        'email'=>'required|email|unique:users',
        'password'=>'required|min:6',
        'role'=>'required|in:Admin,Commander,HR,Officer,User',
        'personnel_id'=>'nullable|exists:personnels,id',
        'is_active'=>'nullable|boolean'
    ], $messages);

    $data['password'] = Hash::make($data['password']);

    return User::create($data);
    }

    public function show(User $user)
    {
        return $user->load('personnel');
    }

    public function update(Request $request, User $user)
    {
        if ($request->filled('password')) {
            $request['password'] = Hash::make($request->password);
        }

        $user->update($request->all());
        return $user;
    }

    public function destroy(User $user)
    {
       
        $deletedUser = $user->toArray();

        // delete the record
        $user->delete();

        // return response with deleted data and message
        return response()->json([
            'deleted' => $deletedUser,
            'message' => "User deleted successfully!"
        ], 200);
    }
}
