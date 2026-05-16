<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

// redirect root ke login
$routes->get('/', function () {
    return redirect()->to('/auth/login');
});

// auth routes
$routes->get('/auth/register', 'AuthController::register');
$routes->get('/auth/login', 'AuthController::login');
$routes->get('/auth/logout', 'AuthController::logout');
$routes->post('/auth/save-token', 'AuthController::saveToken');

// user management (protected via filter)
$routes->get('/users', 'UserController::index', ['filter' => 'auth']);
