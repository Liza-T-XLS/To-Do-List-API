<?php

namespace App\models;

class CoreModel {
  protected $id;

  /**
   * Get the value of id
   */ 
  public function getId()
  {
    return $this->id;
  }

  /**
   * Set the value of id
   *
   * @return  self
   */ 
  public function setId($id)
  {
    $this->id = $id;

    return $this;
  }

  public function __get($prop)
  {
      return $this->$prop;
  }

  public function __isset($prop) : bool
  {
      return isset($this->$prop);
  }
}