import { Component, OnInit } from '@angular/core';
import { Content, Course, QuizContent } from '../../models/Course';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course-service';
import { Auth } from '../../services/auth';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Announcement } from '../../models/Announcement';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-course-page',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './course-page.html',
  styleUrl: './course-page.css'
})
export class CoursePage implements OnInit{
  backendBaseUrl = 'http://localhost:8080';
  course!: Course;
  isCourseInstructor: boolean = false;

  announcementForm!: FormGroup;
  announcementEdition: Announcement | null = null;
  isCreationMode: boolean = false;

  

  constructor(
    private route: ActivatedRoute,
    private cService: CourseService,
    private auth: Auth,
    private fb: FormBuilder
  ) {  
      this.announcementForm = this.fb.group({
        title: ['', Validators.required],
        content: ['', Validators.required]
      });
  }

  ngOnInit(): void {
    const courseId = this.route.snapshot.params['id']
    const currentUserId = this.auth.CurrentUserValue?.id;

    this.cService.getById(courseId).subscribe(c => {
      this.course = c;

      if(c.instructorId === currentUserId) {
        this.isCourseInstructor = true;
      }

      if (!this.course.announcements) {
        this.course.announcements = [];
      }

      this.course.announcements.forEach(a => a.isExpanded = false);

    });
  }

  toggleAccordeon(announcement: Announcement): void {
    announcement.isExpanded = !announcement.isExpanded;
  }

   /**
   * Pone el componente en modo de Creación y limpia el formulario.
   * Se llama desde el botón "+ Publicar Nuevo Anuncio".
   */
  startCreation(): void {
    this.announcementEdition = null;
    this.isCreationMode = true;
    this.announcementForm.reset();
  }

  onEdit(announcement: Announcement): void {
    this.isCreationMode = false;
    this.announcementEdition = { ...announcement};

    this.announcementForm.patchValue({
      title : announcement.title,
      content : announcement.content
    });

    // Colapsa todos los otros avisos al entrar en modo edición
    this.course.announcements?.forEach(a => a.isExpanded = false);
  }

  /**
   * Confirma la eliminación y actualiza la lista localmente.
   * NOTA: Aquí iría la llamada al servicio para eliminarlo en el servidor.
   * @param announcementId El ID del anuncio a eliminar.
   */
  onDelete(announcementId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
      
      // Actualización local: filtrar el anuncio eliminado
      const updatedAnnouncements = this.course.announcements?.filter(a => a.id !== announcementId);
      this.course.announcements = updatedAnnouncements;
      this.announcementEdition = null;
      
      // TODO: Llamar al cService para persistir el cambio en el backend/JSON
      this.cService.update(this.course.id,this.course).subscribe({
        next: (data) => {console.log('Actualizado correctamente.')},
        error: (err) => {console.log('There is an error')}
      });
    }
  }

  onFormSubmit(): void {
    if(this.announcementForm.invalid) return;

    const formValue = this.announcementForm.value;

    if(this.announcementEdition) {

      const updatedAnnouncement : Announcement = {
        ...this.announcementEdition,
        title: formValue.title,
        content: formValue.content
      };

      // Encontrar y reemplazar en el array local
      const index = this.course.announcements?.findIndex(a => a.id === updatedAnnouncement.id);
      if (index !== undefined && index !== -1) {
        this.course.announcements![index] = updatedAnnouncement; 
      }
      this.announcementEdition = null;

    } else {
      // MODO CREACIÓN
      const newAnnouncement: Announcement = {
        ...formValue,
        publishedDate: new Date(),
        isExpanded: false
      };
      
      this.course.announcements?.unshift(newAnnouncement); // Añadir al principio de la lista
      this.isCreationMode = false;
    }

    // TODO: Llamar al cService para persistir el objeto Course completo en el backend
    this.cService.update(this.course.id, this.course).subscribe({
      next: (data) => {console.log('Actualizado correctamente')},
      error: (err) => {console.log('Error')}
    });
    
    this.announcementForm.reset();

  }
  /**
   * Cancela la creación o edición del anuncio.
   */
  onCancel(): void {
    this.announcementEdition = null;
    this.isCreationMode = false;
    this.announcementForm.reset();
  }

}
