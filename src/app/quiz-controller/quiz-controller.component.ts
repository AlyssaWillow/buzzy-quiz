import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { QuizController, buzzIn } from '../models/quiz';

@Component({
  selector: 'app-quiz-controller',
  templateUrl: './quiz-controller.component.html',
  styleUrls: ['./quiz-controller.component.scss']
})
export class QuizControllerComponent implements OnInit {

  gameId: string = '';
  inputGameCode: string = '';
  inputName: string = '';
  quizControllers: QuizController[] = [];

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    this.afs.collection<QuizController>('quiz-controllers').valueChanges().subscribe(controllers => {
      this.quizControllers = controllers;
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
    // this.deleteGame();
    let controller: QuizController = {
      question: '',
      playerName: this.inputName,
      gameCode: this.inputGameCode
    }

    const pickRef = this.afs.collection<QuizController>('quiz-controllers');
    await pickRef.add(controller)
                 .then(() => {
                    this.gameId = this.inputGameCode
                    console.log('success')
                  })
                 .catch((t) => {console.log('fail', t)})
  };

  buzzIn = async () => {
    let buzz: buzzIn = {
      gameCode: this.gameId,
      player: this.inputName,
      questionNumber: 0,
      timestamp: new Date()
    }

    const pickRef = this.afs.collection<buzzIn>('quiz-buzz');
    await pickRef.add(buzz)
                 .then(() => {console.log('success')})
                 .catch((t) => {console.log('fail', t)})
  };

}
