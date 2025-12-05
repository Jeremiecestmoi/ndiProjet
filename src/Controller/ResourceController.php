<?php

namespace App\Controller;

use App\Service\DataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class ResourceController extends AbstractController
{
    #[Route('/ressources', name: 'resource_list')]
    public function list(DataService $data)
    {
        $resources = $data->getResources();

        // Construire la liste des catégories uniques (fallback "Autre")
        $seen = [];
        foreach ($resources as $r) {
            $cat = $r['category'] ?? 'Autre';
            $seen[$cat] = true; // clé = cat => unicité
        }
        $cats = array_keys($seen);
        sort($cats, SORT_NATURAL | SORT_FLAG_CASE);

        return $this->render('resource/list.html.twig', [
            'resources' => $resources,
            'cats'      => $cats,
        ]);
    }
}
