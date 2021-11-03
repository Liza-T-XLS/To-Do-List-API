<?php

namespace App\models;
use JsonSerializable;

class Task extends CoreModel implements JsonSerializable {
  protected $user_id;
  protected $title;
  protected $description;
  protected $creation_date;
  protected $status;

  public function __construct()
  {
    $this->creation_date = new \DateTime;
    $this->status = true;
  }
  
  public function jsonSerialize()
  {
      return get_object_vars($this);
  }

  /**
   * Get the value of user_id
   */ 
  public function getUser_id()
  {
    return $this->user_id;
  }

  /**
   * Set the value of user_id
   *
   * @return  self
   */ 
  public function setUser_id($user_id)
  {
    $this->user_id = $user_id;

    return $this;
  }

  /**
   * Get the value of title
   */ 
  public function getTitle()
  {
    return $this->title;
  }

  /**
   * Set the value of title
   *
   * @return  self
   */ 
  public function setTitle($title)
  {
    $this->title = $title;

    return $this;
  }

  /**
   * Get the value of description
   */ 
  public function getDescription()
  {
    return $this->description;
  }

  /**
   * Set the value of description
   *
   * @return  self
   */ 
  public function setDescription($description)
  {
    $this->description = $description;

    return $this;
  }

  /**
   * Get the value of creation_date
   */ 
  public function getCreation_date()
  {
    return $this->creation_date;
  }

  /**
   * Set the value of creation_date
   *
   * @return  self
   */ 
  public function setCreation_date($creation_date)
  {
    $this->creation_date = $creation_date;

    return $this;
  }

  /**
   * Get the value of status
   */ 
  public function getStatus()
  {
    return $this->status;
  }

  /**
   * Set the value of status
   *
   * @return  self
   */ 
  public function setStatus($status)
  {
    $this->status = $status;

    return $this;
  }
}