<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Validation\Rules\Password;
class AuthController extends Controller
{
    /**
     * Login (API Token / Bearer)
     */

    // REGISTER
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string|unique:users,username',
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => [
                'required',
                'confirmed', // need password_confirmation
                Password::min(6),
            ],
        ]);

        $user = User::create([
            'username' => $request->username,
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,          
            'is_active'=> $request->is_active,     
        ]);

        // create token auto after register (optional)
        $token = $user->createToken('react-token')->plainTextToken;

        return response()->json([
            'message' => 'Registered successfully',
            'token'   => $token,
            'user'    => $user,
        ], 201);
    }


    public function login(Request $request)
    {
        // 1️⃣ Validate request
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // 2️⃣ Find user by username
        $user = User::where('username', $request->username)->first();
            // dd([
            //     'username_in_db' => $user?->username,
            //     'password_correct' => $user ? Hash::check($request->password, $user->password) : null,
            //     'request_password' => $request->password,
            // ]);
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid username or password'
            ], 401);
        }

        // 3️⃣ Revoke old tokens (optional but recommended)
        $user->tokens()->delete();

        // 4️⃣ Create new token
        $token = $user->createToken('react-token')->plainTextToken;

        // 5️⃣ Return response
        return response()->json([
            'token' => $token,
            'user'  => $user,
        ]);
    }

    /**
     * Logout (revoke current token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * Get authenticated user
     */
    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
