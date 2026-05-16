import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { QuizController, buzzIn } from '../models/quiz';
import { activeQuestion, question } from '../models/question';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
export class QuizControllerComponent implements OnInit {

  gameId: string = '';
  inputGameCode: string = '';
  inputName: string = '';
  inputAnswer: string = '';
  activeQuestion: activeQuestion = {
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

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit(): void {
   
    console.log('gameId', this.inputGameCode)
    this.afs.collection<QuizController>('quiz-controllers',ref => ref.where('gameCode', '==', this.inputGameCode))
    .valueChanges().subscribe(controllers => {
      this.quizControllers = controllers;
    })

    this.afs.collection<buzzIn>('quiz-buzz')
    .valueChanges()
    .subscribe(buzz => {
      console.log('buzz', buzz, this.gameId)
      let orderedBuzz = buzz.filter(ref=>ref.gameCode === this.gameId)
                            .sort(({timestamp:a}, {timestamp:b}) => b.nanoseconds - a.nanoseconds);
      this.buzzedIn = orderedBuzz[0]
    })
    this.getActiveQuestion();
  }

  getActiveQuestion = () => {
    this.afs.collection<activeQuestion>('active-questions', ref => ref.where('gameId', '==', this.inputGameCode))
            .valueChanges()
            .subscribe(data => {
              this.activeQuestion = data[0];
            })
  }

  ngOnDestroy(): void {
    // this.deleteGame();
  }

  // deleteGame = () => {
  //   if (this.gameId !== undefined && this.gameId !== '') {
  //     let id: string = '';
  //     this.afs.collection<QuizMaster>('quiz', ref => ref.where('gameCode', '==', this.gameId))
  //             .snapshotChanges().subscribe(eventz=>{
  //               eventz.forEach(event => {
  //                 id = event.payload.doc.id;
  //               })
  //       const pickRef = this.afs.collection<QuizMaster>('quiz')
  //       pickRef.doc(id).delete().then(() => {
  //         console.info("Document successfully deleted!",);
  //       }).catch((error) => {
  //           console.error("Error removing document: ", error);
  //       });
  //     })
  //   }
  // }

  enterGame = async () => {
    this.error = 'submitted'
    let controller: QuizController = {
      question: '',
      playerName: this.inputName,
      gameCode: this.inputGameCode,
      points: 0
    }

    if (this.quizControllers.length < 6) {
      const pickRef = this.afs.collection<QuizController>('quiz-controllers');
      await pickRef.add(controller)
      .then(() => {
         this.gameId = this.inputGameCode
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

    const pickRef = this.afs.collection<buzzIn>('quiz-buzz');
    await pickRef.add(buzz)
                 .then(() => {console.log('success')})
                 .catch((t) => {console.log('fail', t)})
  };

  isAnswerCorrect = (inputGameCode: string, inputAnswer: string): boolean => {
    this.afs.collection<question>('active-questions', ref => {
      let ref2 = ref.where('gameId', '==', inputGameCode)
      return ref2.where('question.answer', '==', inputAnswer.toLowerCase())
    })
    .valueChanges()
    .subscribe(potentialAnswer => {
      if (potentialAnswer?.length > 0) {
        return true;
      } else {
        return false;
      }
    });
    return false;
  }

  getControllerId = (inputGameCode: string, inputName: string): string => {
    let id: string = '';
    this.afs.collection<QuizController>('quiz-controllers',ref => {
      let ref2 = ref.where('gameCode', '==', inputGameCode)
      return ref2.where('playerName', '==', inputName)
    })
    .snapshotChanges()
    .subscribe(eventz=>{
      eventz.forEach(event => {
        id = event.payload.doc.id;
      })
    })
    return id;
  }

  getController = (id: string): QuizController => {
    let controller: QuizController = {
      question: '',
      playerName: '',
      gameCode: '',
      points: 0
    }
    this.afs.collection<QuizController>('quiz-controllers').doc(id).valueChanges().subscribe(sub => {
      if (sub) {
        controller = sub;
      }
    })
    return controller;
  }

  updateScore = (controller: QuizController, correct: boolean, questionNumber: number): QuizController => {
    if (correct) {
      controller.points = (controller?.points ? controller.points : 0) + ((questionNumber + 1) * 100)
    } else {
      controller.points = (controller?.points ? controller.points : 0) - ((questionNumber + 1) * 100)
    }
    return controller;
  }

  submitAnswer = async () => {
    let correct: boolean = this.isAnswerCorrect(this.inputGameCode, this.inputAnswer);
    let id: string = this.getControllerId(this.inputGameCode, this.inputAnswer);
    let controller: QuizController = this.getController(id);
    controller = this.updateScore(controller, correct, this.activeQuestion.number);
    
    const pickRef = this.afs.collection<QuizController>('quiz-controllers')
    pickRef.doc(id).set(controller).then(() => {
      console.info("Document successfully deleted!",);
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
      
  };

}