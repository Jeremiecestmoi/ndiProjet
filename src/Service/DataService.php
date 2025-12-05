<?php

namespace App\Service;

class DataService
{
    private array $data;

    public function __construct()
    {
        $jsonPath = __DIR__ . '/../../var/data.json';
        $this->data = json_decode(file_get_contents($jsonPath), true);
    }

    public function getChallenges(): array
    {
        return $this->data['challenges'] ?? [];
    }

    public function getResources(): array
    {
        return $this->data['resources'] ?? [];
    }

    public function getQuiz(): array
    {
        return $this->data['quiz'] ?? [];
    }
}
