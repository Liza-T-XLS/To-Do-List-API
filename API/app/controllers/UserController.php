<?php

namespace App\controllers;

use App\models\User;

session_start();

class UserController extends CoreController {
  public function create($match) {
    // expected data format:
    // {
    //   name: "John",
    //   email: "john@gmail.com",
    // }
    $data = $match['target']['data'];
    
    if(empty($data['name']) || empty($data['email'])) {
      $response = [
        'message' => 'Data format is incorrect. Cannot proceed.',
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

  public function read($match) {
    // expected data format:
    // params from URL
    $data = $match['params'];

    if(empty($data)) {
      $response = [
        'message' => 'A user id must be provided. Cannot proceed.',
      ];
      header('Content-Type: application/json');
      http_response_code(422);
      echo json_encode($response);
      die();
    };

    // checks if user exists
    $isUser = in_array(intval($data['id']), array_column($_SESSION['userData'], 'id'), true);
    
    if(!$isUser) {
      $response = [
        'message' => 'This user does not exist.',
      ];
      header('Content-Type: application/json');
      http_response_code(400);
      echo json_encode($response);
      die();
    };

    $user = null;
    foreach($_SESSION['userData'] as $element) {
      if ($element->id == $data['id']) {
          $user = $element;
          break;
      }
    }

    $response = [
      'message' => 'User found',
      'user' => $user,
    ];
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode($response);
    die();
  }
}