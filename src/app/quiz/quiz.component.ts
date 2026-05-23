import { Component, Input, OnInit } from '@angular/core';
import { QuizController, QuizMaster, buzzIn } from '../models/quiz';
import { ActiveQuestion, category } from '../models/question';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BuzzerService } from '../services/buzzer.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule, 
    FormsModule
  ],
})
export class QuizComponent implements OnInit {

  gameId: string = '';
  baseUrl: string = window.location.origin;
  buzzers: buzzIn[] = [];
  questionNumber: number = 0;
  ibuzzedIn: boolean = false;
  quizStarted: boolean = false;
  gameStartTime: Date | undefined = undefined;
  activeQuestion: ActiveQuestion | undefined;
  buzzedIn: buzzIn = {
    gameCode: '',
    player: '',
    timestamp: {
      seconds: 0,
      nanoseconds: 0
    },
    questionNumber: 0
  };
  quizControllers: QuizController[] = [];
  questions: category = {
    "categoryCode": "Chemistry",
    "categoryName": "Chemistry",
    "description": "Questions will provide element number, buzz in with the element name.",
    "questions": [
        {
          "number": 1,
          "points": 100,
          "answer": "hydrogen",
          "question": "1"
        },
        {
          "number": 2,
          "points": 200,
          "answer": "helium",
          "question": "2"
        },
        {
          "number": 3,
          "points": 300,
          "answer": "lithium",
          "question": "3"
        },
        {
          "number": 4,
          "points": 400,
          "answer": "beryllium",
          "question": "4"
        },
        {
          "number": 5,
          "points": 500,
            "answer": "boron",
            "question": "5"
        },

        {
          "number": 6,
          "points": 600,
            "answer": "carbon",
            "question": "6"
        },
        {
          "number": 7,
        "points": 700,
            "answer": "nitrogen",
            "question": "7"
        },
        {
          "number": 8,
          "points": 800,
            "answer": "oxygen",
            "question": "8"
        },
        {
          "number": 9,
          "points": 900,
            "answer": "fluorine",
            "question": "9"
        },
        {
          "number": 10,
          "points": 1000,
            "answer": "neon",
            "question": "10"
        }
    ]
}

  constructor(private buzzerService: BuzzerService) {  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.deleteGame();
  }

  deleteGame = async () => {
    if (this.gameId !== undefined && this.gameId !== '') {
      await this.buzzerService.deleteQuizByGameCode(this.gameId);
    }
  }

  createGame = async () => {
    this.deleteGame();
    this.gameId = this.makeRandom();
    let quiz: QuizMaster = {
      gameCode: this.gameId,
      players: []
    }
    this.buzzerService.createQuiz(quiz)

    this.buzzerService.getQuizControllers(this.gameId).pipe(
      map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...(c.payload.val() as QuizController) }))}
      )
    ).subscribe(sub => {
      this.quizControllers = sub;
    });

    this.buzzerService.getBuzzes(this.gameId).pipe(
      map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...(c.payload.val() as buzzIn) }))}
      )
    ).subscribe(buzz => {
      if (buzz !== undefined && buzz.length > 0) {
        this.buzzedIn = buzz.sort(({timestamp:a}, {timestamp:b}) => b.nanoseconds - a.nanoseconds)[0];
      }
    });
  };

  getQuestions = () => {
    this.questions.questions = this.questions.questions.sort(() => Math.random() - 0.5);
  }

  startGame = async () => {
    this.getQuestions()
    this.gameStartTime = new Date();
    this.questionNumber = 1;
    this.quizStarted = true;
    this.activeQuestion = {
      number: this.questionNumber,
      question: this.questions.questions[this.questionNumber],
      gameId: this.gameId
    }
    await this.buzzerService.addActiveQuestion(this.gameId, this.activeQuestion);
  };

  incrementQuestions = async () => {
    await this.buzzerService.deleteActiveQuestionsByGameId(this.gameId);

    this.questionNumber = this.questionNumber + 1;
    let activeQuestion: ActiveQuestion = {
      number: this.questionNumber,
      question: this.questions.questions[this.questionNumber],
      gameId: this.gameId
    }
    await this.buzzerService.addActiveQuestion(this.gameId, activeQuestion);
  };

  isBuzzed(controller: QuizController): boolean {
    console.log('controller', controller, 'buzzedIn', this.buzzedIn)
    if (!this.buzzedIn?.player || !controller?.playerName) {
      return false;
    }

    console.log('asdfasdfa', controller, this.buzzedIn)
    return controller.playerName.trim().toLowerCase() === this.buzzedIn.player.trim().toLowerCase();
  }

  makeRandom = () => {
    const lengthOfCode = 5;
    let possible = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}
