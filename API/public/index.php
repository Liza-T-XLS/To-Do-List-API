<?php

require '../vendor/autoload.php';

// router

$router = new AltoRouter();

// routes

$router->map(
	'GET',
	'/',
	['controller' => 'MainController', 'method' => 'home', ],
	'home'
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

$controller->$methodToUse();