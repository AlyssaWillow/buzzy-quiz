import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { QuizController, QuizMaster, buzzIn } from '../models/quiz';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  gameId: string = '';
  buzzers: buzzIn[] = [];
  buzzedIn: buzzIn = {
    gameCode: '',
    player: '',
    timestamp: new Date('9999'),
    questionNumber: 0
  };
  quizControllers: QuizController[] = [];

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    this.afs.collection<QuizController>('quiz-controllers').valueChanges().subscribe(controllers => {
      this.quizControllers = controllers;
    })

    this.afs.collection<buzzIn>('quiz-buzz').valueChanges().subscribe(buzz => {
      this.buzzers = buzz.filter(f=>f.gameCode === this.gameId);
      this.buzzedIn = buzz.filter(f=>f.gameCode === this.gameId).sort((a,b) => a.timestamp < b.timestamp ? 1 : 0)[0];
    })
  }

  ngOnDestroy(): void {
    this.deleteGame();
  }

  deleteGame = () => {
    if (this.gameId !== undefined && this.gameId !== '') {
      let id: string = '';
      this.afs.collection<QuizMaster>('quiz', ref => ref.where('gameCode', '==', this.gameId))
              .snapshotChanges().subscribe(eventz=>{
                eventz.forEach(event => {
                  id = event.payload.doc.id;
                })
        const pickRef = this.afs.collection<QuizMaster>('quiz')
        pickRef.doc(id).delete().then(() => {
          console.info("Document successfully deleted!",);
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
      })
    }
  }

  createGame = async () => {
    this.deleteGame();
    this.gameId = this.makeRandom();
    let quiz: QuizMaster = {
      gameCode: this.gameId,
      players: []
    }
    const pickRef = this.afs.collection('quiz');
    await pickRef.add(quiz)
                 .then(() => {console.log('success')})
                 .catch((t) => {console.log('fail', t)})
  };

  makeRandom = () => {
    const lengthOfCode = 5;
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
      return text;
  }

}
