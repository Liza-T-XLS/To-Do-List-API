<?php

namespace App\controllers;

class CoreController {
  public function reset() {
    session_start();
    // destroys the session's variables
    $_SESSION = array();
    // destroys session cookie
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params["path"], $params["domain"],
            $params["secure"], $params["httponly"], $params["samesite"]
        );
    }
    session_destroy();
    $response = [
      'responseCode' => 200,
      'message' => 'App reset.',
    ];
    http_response_code(200);
    echo json_encode($response);
    die();
  }
}