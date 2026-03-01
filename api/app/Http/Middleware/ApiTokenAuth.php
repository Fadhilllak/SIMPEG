<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiTokenAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $authHeader = $request->header('Authorization', '');

        if (!str_starts_with($authHeader, 'Bearer ')) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $token = trim(substr($authHeader, 7));

        if ($token === '') {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $user = User::query()->where('remember_token', $token)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $request->setUserResolver(fn () => $user);

        return $next($request);
    }
}
