<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class UserController extends Controller
{
    public function index()
    {
        $data = [
            'token' => session()->get('jwt_token'),
            'user'  => session()->get('user_data'),
        ];
        return view('users/index', $data);
    }
}
