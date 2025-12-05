<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DemarcheController extends AbstractController
{
    #[Route('/demarche-nird', name: 'app_demarche')]
    public function index(): Response
    {
        return $this->render('demarche/index.html.twig');
    }
}
