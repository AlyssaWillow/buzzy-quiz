import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { QuizController, QuizMaster, buzzIn } from '../models/quiz';
import { activeQuestion, category } from '../models/question';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  gameId: string = '';
  buzzers: buzzIn[] = [];
  questionNumber: number = 0;
  ibuzzedIn: boolean = false;
  quizStarted: boolean = false;
  gameStartTime: Date | undefined = undefined;
  activeQuestion: activeQuestion | undefined;
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

  constructor(private afs: AngularFirestore) {
  }

  ngOnInit(): void {
    this.afs.collection<QuizController>('quiz-controllers')
            .valueChanges()
            .subscribe(controllers => {
      this.quizControllers = controllers.filter(ref => ref.gameCode === this.gameId);
    })

    //,ref => ref.where('gameCode', '==', this.gameId)
    this.afs.collection<buzzIn>('quiz-buzz')
            .valueChanges()
            .subscribe(buzz => {
              console.log('buzz', buzz, this.gameId)
              let orderedBuzz = buzz.filter(ref=>ref.gameCode === this.gameId)
                                    .sort(({timestamp:a}, {timestamp:b}) => b.nanoseconds - a.nanoseconds);
              console.log('orderedBuzz',orderedBuzz)
      this.buzzedIn = orderedBuzz[0]
      console.log('buzzedIn', this.buzzedIn)
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

        const pickRef2 = this.afs.collection<QuizController>('quiz-controller');
        this.afs.collection<QuizController>('quiz-controller', ref => ref.where('gameCode', '==', id))
                                 .snapshotChanges()
                                 .subscribe(controllers => {
                                  controllers.forEach(event => {
                                    pickRef2.doc(event.payload.doc.id).delete().then(() => {
                                      console.info("Controller successfully deleted!",);
                                    }).catch((error) => {
                                        console.error("Error removing document: ", error);
                                    });
                                  })
                                 })
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
    const pickRef = this.afs.collection('active-questions');
    await pickRef.add(this.activeQuestion)
                 .then(() => {console.log('success')})
                 .catch((t) => {console.log('fail', t)})
  };

  incrementQuestions = async () => {
    let id = '';
    this.afs.collection<activeQuestion>('active-questions', ref => ref.where('gameCode', '==', this.gameId))
              .snapshotChanges().subscribe(eventz=>{
                eventz.forEach(event => {
                  id = event.payload.doc.id;
                })
        const pickRef = this.afs.collection<activeQuestion>('active-questions')
        pickRef.doc(id).delete().then(() => {
          console.info("Document successfully deleted!",);
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
      })

    this.questionNumber = this.questionNumber + 1;
    let activeQuestion: activeQuestion = {
      number: this.questionNumber,
      question: this.questions.questions[this.questionNumber],
      gameId: this.gameId
    }
    const pickRef = this.afs.collection('active-questions');
    await pickRef.add(activeQuestion)
                 .then(() => {console.log('success')})
                 .catch((t) => {console.log('fail', t)})
  };

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
