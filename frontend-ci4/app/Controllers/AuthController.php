<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class AuthController extends Controller
{
    public function register()
    {
        // kalau sudah login, redirect ke users
        if (session()->get('jwt_token')) {
            return redirect()->to('/users');
        }

        return view('auth/register');
    }

    public function login()
    {
        if (session()->get('jwt_token')) {
            return redirect()->to('/users');
        }

        return view('auth/login');
    }

    public function logout()
    {
        session()->destroy();
        return redirect()->to('/auth/login')->with('message', 'Berhasil logout');
    }

    /**
     * Simpan token JWT ke session setelah login berhasil (dipanggil via AJAX)
     */
    public function saveToken()
    {
        $json = $this->request->getJSON();

        if (!isset($json->token)) {
            return $this->response->setJSON([
                'status' => false,
                'message' => 'Token tidak ditemukan'
            ]);
        }

        session()->set('jwt_token', $json->token);

        if (isset($json->user)) {
            session()->set('user_data', (array) $json->user);
        }

        return $this->response->setJSON([
            'status' => true,
            'message' => 'Token berhasil disimpan'
        ]);
    }
}
