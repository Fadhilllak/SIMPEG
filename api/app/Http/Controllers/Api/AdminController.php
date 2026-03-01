<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function profile()
    {
        $user = User::query()->first();

        if (!$user) {
            $user = User::query()->create([
                'name' => 'Admin',
                'email' => 'admin@instansi.go.id',
                'password' => Hash::make('password'),
            ]);
        }

        return response()->json([
            'id' => $user->id,
            'nama' => $user->name,
            'email' => $user->email,
            'telepon' => $user->telepon,
            'foto' => $user->foto ? $this->normalizeFilePath($user->foto) : null,
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = User::query()->first();

        if (!$user) {
            $user = User::query()->create([
                'name' => 'Admin',
                'email' => 'admin@instansi.go.id',
                'password' => Hash::make('password'),
            ]);
        }

        $validated = $request->validate([
            'nama' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'telepon' => ['nullable', 'string', 'max:30'],
            'foto' => ['nullable', 'file', 'image', 'max:5120'],
        ]);

        if ($request->hasFile('foto')) {
            $stored = $request->file('foto')->storeAs(
                'admin/photos',
                'admin-'.$user->id.'-'.now()->format('YmdHis').'-'.Str::random(6).'.'.$request->file('foto')->getClientOriginalExtension(),
                'public'
            );

            $validated['foto'] = '/storage/'.$stored;
        }

        $user->name = $validated['nama'];
        $user->email = $validated['email'];
        $user->telepon = $validated['telepon'] ?? null;

        if (!empty($validated['foto'])) {
            $user->foto = $validated['foto'];
        }

        $user->save();

        return response()->json([
            'id' => $user->id,
            'nama' => $user->name,
            'email' => $user->email,
            'telepon' => $user->telepon,
            'foto' => $user->foto ? $this->normalizeFilePath($user->foto) : null,
        ]);
    }

    public function updatePassword(Request $request)
    {
        $user = User::query()->first();

        if (!$user) {
            return response()->json([
                'message' => 'User admin belum tersedia.',
            ], 404);
        }

        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:6', 'confirmed'],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Password saat ini salah.',
            ], 422);
        }

        $user->password = Hash::make($validated['new_password']);
        $user->save();

        return response()->json([
            'message' => 'Password berhasil diperbarui.',
        ]);
    }

    private function normalizeFilePath(string $path): string
    {
        if (Str::startsWith($path, ['http://', 'https://'])) {
            return $path;
        }

        return url($path);
    }
}
