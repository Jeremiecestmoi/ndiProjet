<?php

namespace App\Controller;

use App\Entity\Contribution;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class ContributionController extends AbstractController
{
    #[Route('/contribuer', name: 'contribute')]
    public function contribute(Request $request, EntityManagerInterface $em)
    {
        if ($request->isMethod('POST')) {

            if (!$this->getUser()) {
                $this->addFlash('error', 'Vous devez être connecté.');
                return $this->redirectToRoute('home');
            }

            $c = new Contribution();
            $c->setContent($request->request->get('content'));
            $c->setAuthor($this->getUser());
            $c->setCreatedAt(new \DateTimeImmutable());

            $em->persist($c);
            $em->flush();

            return $this->redirectToRoute('home');
        }

        return $this->render('contribution/form.html.twig');
    }
}

