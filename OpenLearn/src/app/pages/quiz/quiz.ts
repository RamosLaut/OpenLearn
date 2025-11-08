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
export class Quiz implements OnInit{

  quizForm!: FormGroup;
  quizContent: QuizContent | undefined;
  courseId: string | null = null;

  result: {score: number, total: number} | null = null;

  constructor(private route: ActivatedRoute, private courseService: CourseService, private fb: FormBuilder){

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
      for (const section of course.sections){
        const foundContent = section.content.find( c => c.id === contentId);
        if (foundContent && foundContent.contentType === 'Quiz'){
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

/*quizForms = new Map<string, FormGroup>();
  quizResults = new Map<string, { score: number, total: number }>();  


  this.setupQuizForms();


  setupQuizForms(): void {
    if (!this.course || !this.course.sections) return;

    for (const section of this.course.sections) {
      for (const content of section.content) {
        if (content.contentType === 'Quiz') {
          const quizContent = content as QuizContent; 
          const quizForm = this.initQuizForm(quizContent);
          this.quizForms.set(quizContent.id, quizForm);
        }
      }
    }
  } 
  */
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
    if (this.quizForm.invalid){
      alert("Please answer all questions before submitting.");
      this.quizForm.markAllAsTouched();
      return;
    }

    if (!this.quizContent) return;

    const userAnswers: (number | null)[] = this.quizForm.value.answers;
    const correctAnswers = this.quizContent.questions.map( q => q.correctAnswerIndex);

    let score = 0;
    for (let i = 0; i < correctAnswers.length; i++) {
      if (userAnswers[i] === correctAnswers[i]) {
        score ++;
      }
    }
    const total = correctAnswers.length;

    this.result = {score, total};
  }

}
