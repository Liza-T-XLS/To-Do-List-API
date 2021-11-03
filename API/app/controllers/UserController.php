<?php

namespace App\controllers;

use App\models\User;

session_start();

class UserController extends CoreController {
  public function create($data) {
    // expected data format:
    // {
    //   name: "John",
    //   email: "john@gmail.com",
    // }
    
    if(empty($data['name']) || empty($data['email'])) {
      $response = [
        'message' => 'Data format is incorrect, cannot proceed',
      ];
      header('Content-Type: application/json');
      http_response_code(422);
      echo json_encode($response);
      die();
    }

    $newUser = new User();

    if(!isset($_SESSION['userData'])) {
      $_SESSION['userData'] = [];
    }

    $maxId = 0;
    if(!empty($_SESSION['userData'])) {
      $maxId = max(array_column($_SESSION['userData'], 'id'));
    }
    $newId = $maxId + 1;

    $newUser->setId($newId);
    $newUser->setName($data['name']);
    $newUser->setEmail($data['email']);

    array_push($_SESSION['userData'], $newUser);

    $response = [
      'message' => 'User created',
      'data' => $newUser,
    ];

    header('Content-Type: application/json');
    http_response_code(201);
    echo json_encode($response);
  }
}