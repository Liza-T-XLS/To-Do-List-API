<?php

namespace App\controllers;

use App\models\Task;

session_start();

class TaskController extends CoreController {
  public function create($data) {
    // expected data format:
    // {
    //   userId: 1,
    //   title: "Buy groceries",
    //   description: "5 apples, 1 chicken",
    // }

    if(empty($data['userId']) || empty($data['title'])) {
      $response = [
        'message' => 'Data format is incorrect. Cannot proceed.',
      ];
      header('Content-Type: application/json');
      http_response_code(422);
      echo json_encode($response);
      die();
    };

    // checks if user exists
    $isUser = in_array($data['userId'], array_column($_SESSION['userData'], 'id'), true);

    if(!$isUser) {
      $response = [
        'message' => 'This user does not exist. Cannot proceed.',
      ];
      header('Content-Type: application/json');
      http_response_code(422);
      echo json_encode($response);
      die();
    };

    $newTask = new Task();

    if(!isset($_SESSION['taskData'])) {
      $_SESSION['taskData'] = [];
    };

    $maxId = 0;
    if(!empty($_SESSION['taskData'])) {
      $maxId = max(array_column($_SESSION['taskData'], 'id'));
    };
    $newId = $maxId + 1;

    $newTask->setId($newId);
    $newTask->setUser_id($data['userId']);
    $newTask->setTitle($data['title']);
    if(!empty($data['description'])) {
      $newTask->setDescription($data['description']);
    };

    array_push($_SESSION['taskData'], $newTask);

    $response = [
      'message' => 'Task created',
      'data' => $newTask,
    ];

    header('Content-Type: application/json');
    http_response_code(201);
    echo json_encode($response);
  }
}