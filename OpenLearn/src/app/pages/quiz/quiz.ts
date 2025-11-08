import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Content, QuizContent } from '../../models/Course';
import { CourseService } from '../../services/course-service';

@Component({
  selector: 'app-quiz',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css'
})
export class Quiz implements OnInit {

  quizForm!: FormGroup;
  quizContent: QuizContent | undefined;
  courseId: string | null = null;

  result: { score: number, total: number, percentage: number } | null = null;

  constructor(private route: ActivatedRoute, private courseService: CourseService, private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.courseId = this.route.snapshot.paramMap.get('courseId');
    const contentId = this.route.snapshot.paramMap.get('contentId');

    console.log('Buscando Quiz con contentId:', contentId);//////////////
    console.log('... dentro del curso con courseId:', this.courseId);////////////////

    if (!this.courseId || !contentId) {
      console.error("Course ID or content ID missing");
      return;
    }

    this.courseService.getById(this.courseId).subscribe(course => {

      console.log('Curso completo cargado:', course);////////
      for (const section of course.sections) {
        const foundContent = section.content.find(c => c.id === contentId);
        if (foundContent && foundContent.contentType === 'Quiz') {
          this.quizContent = foundContent;
          break;
        }
      }

      if (this.quizContent) {
        console.log('¡Quiz encontrado!', this.quizContent); ////////
        this.quizForm = this.initQuizForm(this.quizContent);
      } else {
        console.error("Quiz content not found in course");
      }


    });

  }

  initQuizForm(quiz: QuizContent): FormGroup {
    const answersArray = quiz.questions.map(() =>
      this.fb.control(null, Validators.required)
    );

    return this.fb.group({
      answers: this.fb.array(answersArray)
    });
  }

  getQuizAnswers(): FormArray {
    return this.quizForm.get('answers') as FormArray;
  }

  submitQuiz(): void {
    if (this.quizForm.invalid) {
      alert("Please answer all questions before submitting.");
      this.quizForm.markAllAsTouched();
      return;
    }

    if (!this.quizContent) return;

    const userAnswers: (number | null)[] = this.quizForm.value.answers;
    
    const questions = this.quizContent.questions;

    
    let studentScore = 0;        
    let totalPossiblePoints = 0; 

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

      const points = question.score || 0;
      totalPossiblePoints += points;

      
      if (userAnswers[i] === question.correctAnswerIndex) {
        studentScore += points;
      }
    }

    
    let percentage = 0;
    if (totalPossiblePoints > 0) { 
      percentage = (studentScore / totalPossiblePoints) * 100;
    }

    this.result = { score: studentScore, total: totalPossiblePoints, percentage: percentage };
  }

}
