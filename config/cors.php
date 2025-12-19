<?php

// return [
//     'paths' => ['api/*'],
//     'allowed_methods' => ['*'],
//     'allowed_origins' => ['*'], // replace '*' with your React frontend URL in production
//     'allowed_headers' => ['*'],
//     'supports_credentials' => false,
// ];

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'https://my-hrm-frontend.onrender.com',  // production
        'http://localhost:8000',
        'http://127.0.0.1:8000',
    ],

    'allowed_headers' => ['*'],

    'supports_credentials' => true,

];