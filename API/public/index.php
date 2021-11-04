<?php

require '../vendor/autoload.php';

if(session_status() == 1) {
  session_start();
}

// router

$router = new AltoRouter();

header('Access-Control-Allow-Origin: http://localhost');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
if ($method == 'OPTIONS') {
    header('Access-Control-Allow-Origin: http://localhost');
    header('Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method,Access-Control-Request-Headers, Authorization');
    header('HTTP/1.1 200 OK');
    die();
}

// routes

$router->map(
	'GET',
	'/reset',
	['controller' => 'CoreController', 'method' => 'reset', ],
	'reset'
);

$router->map(
	'POST',
	'/user/registration',
	['controller' => 'UserController',
    'method' => 'create',
    'data' => [
      'name' => json_decode(file_get_contents('php://input'), true)['name'],
			'email' => json_decode(file_get_contents('php://input'), true)['email']
    ]
	],
	'registration'
);

$router->map(
	'GET',
	'/user/[i:id]',
	['controller' => 'UserController',
    'method' => 'read',
	],
	'user'
);

$router->map(
	'GET',
	'/user/[i:id]/tasks',
	['controller' => 'UserController',
    'method' => 'findTasksByUserId',
	],
	'userTasks'
);

$router->map(
	'DELETE',
	'/user/[i:id]',
	['controller' => 'UserController',
    'method' => 'delete',
  ],
	'user deletion'
);

$router->map(
	'POST',
	'/task',
	['controller' => 'TaskController',
    'method' => 'create',
    'data' => [
      'userId' => json_decode(file_get_contents('php://input'), true)['userId'],
			'title' => json_decode(file_get_contents('php://input'), true)['title'],
			'description'=> json_decode(file_get_contents('php://input'), true)['description'],
    ]],
	'task creation'
);

$router->map(
	'GET',
	'/task/[i:id]',
	['controller' => 'TaskController',
    'method' => 'read',
	],
	'task'
);

$router->map(
	'DELETE',
	'/task/[i:id]',
	['controller' => 'TaskController',
    'method' => 'delete',
  ],
	'task deletion'
);

// current request url match

$match = $router->match();

// if no match throws 404 status
if(!is_array($match)) {
    header('HTTP/1.0 404 Not Found');
    exit('404 Not Found');
}

// else the script continues
// retrieves name of the controller to use
$controllerName = $match['target']['controller'];
// retrieves name of the method to use
$methodToUse = $match['target']['method'];

$controllerToUse = 'App\\controllers\\' . $controllerName;

$controller = new $controllerToUse();

$controller->$methodToUse($match);