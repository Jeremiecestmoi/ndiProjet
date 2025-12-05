<?php

namespace App\Controller;

use App\Service\DataService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class QuizController extends AbstractController
{
    #[Route('/quiz', name:'quiz_play')]
    public function play(DataService $data)
    {
        return $this->render('quiz/play.html.twig', [
            'quiz' => $data->getQuiz()
        ]);
    }

    #[Route('/quiz/check', name:'quiz_check', methods:['POST'])]
    public function check(Request $request, DataService $data)
    {
        $quiz = $data->getQuiz();

        $score = 0;
        foreach ($quiz['questions'] as $index => $q) {
            $answer = $request->request->get("q$index");
            if ((int)$answer === (int)$q['correct']) {
                $score++;
            }
        }

        return $this->render('quiz/result.html.twig', [
            'score' => $score,
            'quiz' => $quiz
        ]);
    }
}
