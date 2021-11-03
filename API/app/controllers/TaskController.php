<?php

namespace App\controllers;

use App\models\Task;

session_start();

class TaskController extends CoreController {
  public function create($match) {
    // expected data format:
    // {
    //   userId: 1,
    //   title: "Buy groceries",
    //   description: "5 apples, 1 chicken",
    // }

    $data = $match['target']['data'];

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
  
  public function read($match) {
    // expected data format:
    // params from URL
    $data = $match['params'];

    if(empty($data)) {
      $response = [
        'message' => 'A task id must be provided. Cannot proceed.',
      ];
      header('Content-Type: application/json');
      http_response_code(422);
      echo json_encode($response);
      die();
    };

    // checks if task exists
    $isTask = in_array(intval($data['id']), array_column($_SESSION['taskData'], 'id'), true);
    
    if(!$isTask) {
      $response = [
        'message' => 'This task does not exist.',
      ];
      header('Content-Type: application/json');
      http_response_code(400);
      echo json_encode($response);
      die();
    };

    $task = null;
    foreach($_SESSION['taskData'] as $element) {
      if ($element->id == $data['id']) {
          $task = $element;
          break;
      }
    }

    $response = [
      'message' => 'Task found',
      'task' => $task,
    ];
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode($response);
    die();
  }

  public function delete($match) {
    // expected data format:
    // params from URL
    $data = $match['params'];

    if(empty($data)) {
      $response = [
        'message' => 'A task id must be provided. Cannot proceed.',
      ];
      header('Content-Type: application/json');
      http_response_code(422);
      echo json_encode($response);
      die();
    };

    // checks if task exists
    $isTask = in_array(intval($data['id']), array_column($_SESSION['taskData'], 'id'), true);
    
    if(!$isTask) {
      $response = [
        'message' => 'This task does not exist.',
      ];
      header('Content-Type: application/json');
      http_response_code(400);
      echo json_encode($response);
      die();
    };

    $taskIndex = null;
    foreach($_SESSION['taskData'] as $key => $element) {
      if ($element->id == $data['id']) {
          $taskIndex = $key;
          break;
      }
    }

    unset($_SESSION['taskData'][$taskIndex]);

    $response = [
      'message' => 'Task deleted',
      'taskId' => $data['id'],
    ];
    header('Content-Type: application/json');
    http_response_code(200);
    echo json_encode($response);
    die();
  }
}