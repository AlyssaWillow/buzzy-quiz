import { Component, OnInit, OnDestroy } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { QuizController, QuizMaster, buzzIn } from '../models/quiz';
import { ActiveQuestion, question } from '../models/question';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BuzzerService } from '../services/buzzer.service';

@Component({
  selector: 'app-quiz-controller',
  templateUrl: './quiz-controller.component.html',
  styleUrls: ['./quiz-controller.component.scss'],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule, 
    FormsModule,
  ]
})
export class QuizControllerComponent implements OnInit, OnDestroy {

  gameId: string = '';
  private quizControllerSub: Subscription | undefined;
  inputGameCode: string = '';
  inputName: string = '';
  inputAnswer: string = '';
  activeQuestion: ActiveQuestion = {
    number: 0,
    question: {
      number: 0,
      points: 0,
      question: '',
      answer: ''
    },
    gameId: ''
  };
  quizControllers: QuizController[] = [];
  error: string = '';
  buzzedIn: buzzIn = {
    gameCode: '',
    player: '',
    timestamp: {
      nanoseconds: 0,
      seconds: 0
    },
    questionNumber: 0
  }

  constructor(private buzzerService: BuzzerService) { }

  ngOnInit(): void {
    // if (this.inputGameCode) {
    //   this.subscribeToQuizControllers(this.inputGameCode);
    // }

    this.buzzerService.getBuzzes(this.gameId).pipe(
      map(changes => {
        return changes.map(c => ({ key: c.payload.key, ...(c.payload.val() as buzzIn) }))}
      )).subscribe(buzz => {
        let orderedBuzz = buzz.sort(({timestamp:a}, {timestamp:b}) => b.nanoseconds - a.nanoseconds);
        this.buzzedIn = orderedBuzz[0]
      })
    this.getActiveQuestion();
  }

  getActiveQuestion = () => {
    this.buzzerService.getActiveQuestionByGameId(this.inputGameCode)
            .subscribe(data => {
              console.log('data', data)
              this.activeQuestion = data[0] as ActiveQuestion;
            })
  }

  ngOnDestroy(): void {
    this.quizControllerSub?.unsubscribe();
  }

  private subscribeToQuizControllers(gameCode: string) {
    this.quizControllerSub?.unsubscribe();
    this.buzzerService.getQuizControllers(gameCode).pipe(
      map(changes => {

        return changes.map(c => ({
          key: c.payload.key, // This is the Firebase-generated key
          ...(c.payload.val() as QuizController) // The actual data
        }))}
      )
    ).subscribe();
  }

  enterGame = async () => {
    this.error = 'submitted'
    let controller: QuizController = {
      question: '',
      playerName: this.inputName,
      gameCode: this.inputGameCode,
      points: 0
    }

    if (this.quizControllers.length < 6) {
      await this.buzzerService.addQuizController(controller)
      .then(() => {
         this.gameId = this.inputGameCode
         this.subscribeToQuizControllers(this.gameId);
         this.quizControllers = [...this.quizControllers, controller];
         console.log('success')
       })
      .catch((t) => {
       this.error = t
       console.log('fail', t)
     })
    } else {
      this.error = 'Lobby is full.'
    }

    
    this.getActiveQuestion();

  };

  buzzIn = async () => {
    let date: number = Date.now();
    let buzz: buzzIn = {
      gameCode: this.gameId,
      player: this.inputName,
      questionNumber: 0,
      timestamp: {
        seconds: date / 1000,
        nanoseconds: date
      }
    }

    this.buzzedIn = buzz;
    this.buzzerService.buzzIn(buzz);
  };

  updateScore = (controller: QuizController, correct: boolean, questionNumber: number): QuizController => {
    if (correct) {
      controller.points = (controller?.points ? controller.points : 0) + ((questionNumber + 1) * 100)
    } else {
      controller.points = (controller?.points ? controller.points : 0) - ((questionNumber + 1) * 100)
    }
    return controller;
  }

  submitAnswer = async () => {
    const normalizedAnswer = this.inputAnswer?.trim().toLowerCase();
    const correct = this.activeQuestion?.question?.answer?.toLowerCase() === normalizedAnswer;

    const localController = this.quizControllers.find(c => c.playerName === this.inputName && c.gameCode === this.inputGameCode);
    if (localController) {
      this.updateScore(localController, correct, this.activeQuestion.number);
    }

    await this.buzzerService.submitAnswerByPlayer(
      this.inputGameCode,
      this.inputName,
      this.inputAnswer,
      this.activeQuestion.number
    );
  };

}