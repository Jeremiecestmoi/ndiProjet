<?php

namespace App\Controller;

use App\Service\DataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class ChallengeController extends AbstractController
{
    #[Route('/challenges', name: 'challenges')]
    public function index(DataService $data)
    {
        $challenges = $data->getChallenges();

        // Valeurs par défaut si certaines clés sont absentes
        foreach ($challenges as &$c) {
            $c['category'] = $c['category'] ?? 'Général';
            $c['points']   = (int)($c['points'] ?? 0);
            $c['title']    = $c['title'] ?? 'Défi sans titre';
            $c['description'] = $c['description'] ?? '';
            $c['level'] = $c['level'] ?? null;
        }
        unset($c);

        $seen = [];
        foreach ($challenges as $c) { $seen[$c['category']] = true; }
        $cats = array_keys($seen);
        sort($cats, SORT_NATURAL | SORT_FLAG_CASE);

        // Min/Max points pour le slider
        $points = array_column($challenges, 'points');
        $minPoints = $points ? min($points) : 0;
        $maxPoints = $points ? max($points) : 100;

        return $this->render('challenge/index.html.twig', [
            'challenges' => $challenges,
            'cats'       => $cats,
            'minPoints'  => $minPoints,
            'maxPoints'  => $maxPoints,
        ]);
    }
}
