<?php

return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // replace '*' with your React frontend URL in production
    'allowed_headers' => ['*'],
    'supports_credentials' => false,
];
