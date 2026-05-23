import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { QuizController } from '../models/quiz';
import { BuzzerService } from '../services/buzzer.service';

@Component({
  selector: 'bzz-admin',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  gameCodes: string[] = [];
  selectedGameCode = '';
  controllers: QuizController[] = [];
  deleting = false;
  message = '';
  error = '';

  constructor(private buzzerService: BuzzerService) {}

  ngOnInit(): void {
    this.buzzerService.getAllQuizControllers();

    this.buzzerService.allQuizControllers.subscribe(ctrls => {
      this.controllers = ctrls as QuizController[];
    }, err => {
      console.warn('Unable to load controllers', err);
    });
  }
}
