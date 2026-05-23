import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/compat/database'; 




import { inject, Injectable, Injector, runInInjectionContext } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { combineLatest, forkJoin, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { buzzIn, QuizController, QuizMaster } from '../models/quiz';
import { ActiveQuestion } from '../models/question';
import { Database, ref, objectVal } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class BuzzerService {

  allQuizControllers: Observable<any[]>;

  constructor(private db: AngularFireDatabase,
    private injector: Injector) {
    this.allQuizControllers = of([]);
  }

//QUIZ CONTROLLERS

addQuizController(controller: QuizController) {
    return runInInjectionContext(this.injector, async () => {
      const buzzersRef = this.db.list(`/${controller.gameCode}/quiz-controllers`);

      return buzzersRef.push(controller)
        .then((result) => {
          console.log('Buzzer added successfully with key:', result.key);
          // You can also get the full path to the new item: result.path
        })
        .catch((error) => {
          console.error('Error adding buzzer:', error);
        });
    });
  // Get a reference to the 'buzzers' path in your Realtime Database
}

  getQuizControllers(gameCode: string): Observable<SnapshotAction<QuizController>[]> {
    return runInInjectionContext(this.injector, () => {
      return this.db.list<QuizController>(`/${gameCode}/quiz-controllers`).snapshotChanges();
    });
  }

  getAllQuizControllers() {
    // 1. Get a list of all game code keys from the root of the database.
    const gameCodesRef: AngularFireList<any> = this.db.list('/');

    this.allQuizControllers = gameCodesRef.snapshotChanges().pipe(
      // Extract just the keys (the game codes) from the root-level snapshots
      map(changes => changes.map(c => c.payload.key)),
      // Use switchMap to switch from the Observable of game codes to Observables of quiz controllers
      switchMap(gameCodes => {
        if (!gameCodes || gameCodes.length === 0) {
          // If there are no game codes, return an Observable that emits an empty array
          return of([]);
        }

        // For each game code, create an Observable to fetch its quiz controller
        const quizControllerObservables = gameCodes.map(gameCode =>
          this.db.list(`/${gameCode}/quiz-controllers`).snapshotChanges().pipe(
            // Map each controller snapshot to include its gameCode, key, and data
            map(controllerChanges =>
              controllerChanges.map(cc => ({
                gameCode: gameCode, // Attach the gameCode to each controller for context
                key: cc.payload.key,
                ...(cc.payload.val() || {}) // Spread the actual controller data, defaulting to empty object if null
              }))
            )
          )
        );

        // forkJoin waits for all controller observables to complete,
        // then combines their results (an array of arrays)
        return forkJoin(quizControllerObservables).pipe(
          // Flatten the array of arrays into a single array of all controllers
          map(arrayOfArrays => arrayOfArrays.flat())
        );
      })
    );
  }
  
  //BUZZ IN
  buzzIn(buzz: buzzIn): void {
    runInInjectionContext(this.injector, async () => {

      const buzzersRef = this.db.list(`/${buzz.gameCode}/buzz-in`);
      await buzzersRef.push(buzz)
                   .then(() => {console.log('success')})
                   .catch((t) => {console.log('fail', t)})
    })
  }

  getBuzzes(gameCode: string): Observable<SnapshotAction<buzzIn>[]> {
    return runInInjectionContext(this.injector, () => {
      return this.db.list<buzzIn>(`/${gameCode}/buzz-in`).snapshotChanges();
    });
  }


  //QUIZ
  createQuiz(quiz: QuizMaster): void {
    runInInjectionContext(this.injector, async () => {
      const pickRef = this.db.list(`/${quiz.gameCode}/quiz`);
      await pickRef.push(quiz)
                 .then(() => {console.log('success')})
                 .catch((t) => {console.log('fail', t)})         
    });
  }

  deleteQuizByGameCode(gameCodeToDelete: string) {
    console.log('deleteQuizByGameCode', gameCodeToDelete);
    return runInInjectionContext(this.injector, async () => {
      if (!gameCodeToDelete) {
        console.error('No gameCode provided for deletion.');
        return;
      }

      const gameRef = this.db.object(`/${gameCodeToDelete}`);

      gameRef.remove().then(() => {
        console.log(`Game code '${gameCodeToDelete}' and all its data deleted successfully.`);
        // Optionally, navigate away or update your UI
      })
      .catch((error) => {
        console.error(`Error deleting game code '${gameCodeToDelete}':`, error);
      });
    });
  }


  // QUESTIONS
  getActiveQuestionByGameId(gameId: string) {
    return runInInjectionContext(this.injector, () => {
      return this.db.list(`/${gameId}/active-questions`).valueChanges();
    });
  }

 submitAnswerByPlayer(gameCode: string, playerName: string, inputAnswer: string, questionNumber: number) {
  console.log('submitAnswerByPlayer', { gameCode, playerName, inputAnswer, questionNumber });
  return runInInjectionContext(this.injector, async () => {
    let controllerSub = this.db.list(`${gameCode}/quiz-controllers`, ref => {
      return ref.orderByChild('playerName').equalTo(playerName);
    }).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({
          key: c.payload.key,
          ...(c.payload.val() as QuizController)
        }))
      ),
      take(1) // <--- Add this line here
    );

    controllerSub.subscribe(controller => {
      // Check if a controller for the player was found
      if (controller.length > 0) {
        const correct = true; // You might want to determine this dynamically
        controller[0].points = (controller[0].points ?? 0) + (correct ? 1 : -1) * ((questionNumber + 1) * 100);
        this.db.object(`/${gameCode}/quiz-controllers/${controller[0].key}`).set(controller[0]);
      } else {
        console.warn(`No quiz-controller found for player: ${playerName} in game: ${gameCode}`);
      }
    });
  });
}

  addActiveQuestion(gameId: string, activeQuestion: ActiveQuestion) {
    return runInInjectionContext(this.injector, async () => {
      const pickRef = this.db.list<ActiveQuestion>(`/${gameId}/active-questions`);
      return pickRef.push(activeQuestion)
                 .then(() => {console.log('success')})
                 .catch((t) => {console.log('fail', t)})
    });
  }
  
  getActiveQuestionByAnswer(gameCode: string, answer: string) {
    return runInInjectionContext(this.injector, () => {
      return this.db.list<ActiveQuestion>(`/${gameCode}/active-questions`, ref => {
        return ref.orderByChild('question/answer').equalTo(answer.toLowerCase());
      }).valueChanges();
    });
  }

  deleteActiveQuestionsByGameId(gameCode: string) {
    console.log('deleteActiveQuestionsByGameId', gameCode);
    return runInInjectionContext(this.injector, async () => {
      if (!gameCode) {
        console.error('No gameCode provided for deletion.');
        return;
      }

      const gameRef = this.db.object(`/${gameCode}/active-questions`);

      gameRef.remove().then(() => {
        console.log(`Game code '${gameCode}' and all its data deleted successfully.`);
        // Optionally, navigate away or update your UI
      })
      .catch((error) => {
        console.error(`Error deleting game code '${gameCode}':`, error);
      });
    });
  }

  submitAnswer(controller: QuizController, id: string): void {
    runInInjectionContext(this.injector, async () => {

      const pickRef = this.db.object<QuizController>(`/${controller.gameCode}/quiz-controllers/${id}`)
      pickRef.update(controller).then(() => {
        console.info("Document successfully deleted!",);
      }).catch((error) => {
          console.error("Error removing documentxx: ", error);
      });
      })
  }
}
