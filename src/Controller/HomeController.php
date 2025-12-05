<?php

namespace App\Controller;

use App\Service\DataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name:'home')]
    public function index(DataService $data)
    {
        $challenges = $data->getChallenges();

        // On prend les 2 premiers à titre d'exemple
        $top = array_slice($challenges, 0, 2);

        return $this->render('home/index.html.twig', [
            'topChallenges' => $top
        ]);
    }
}
