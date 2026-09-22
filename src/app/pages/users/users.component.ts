import { Component, OnInit, OnDestroy, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { PublicityComponent } from '../../components/publicity/publicity.component';
import { Usuario } from '../../models/user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, PublicityComponent, ReactiveFormsModule]
})
export class UsersComponent implements OnInit, OnDestroy {

  // ===== Datos =====
  public localId: string = '';
  public usersData: Usuario[] = [];
  public userGroups: any[] = [];

  // ===== Paginación =====
  public currentPage: number = 1;
  public lastPage: number = 1;
  public perPage: number = 10;
  public totalUsers: number = 0;
  public from: number = 0;
  public to: number = 0;

  // ===== Estado =====
  public loading: boolean = false;
  public errorMessage: string = '';

  // ===== Búsqueda =====
  form_Groups: FormGroup;
  private search$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private UserService: UserService,
    private AuthService: AuthService,
    private fb: FormBuilder,
  ) {
    this.form_Groups = this.fb.group({
      grupoficha: ['']
    });
  }

  ngOnInit(): void {
    this.localId = this.AuthService.getLocalId();

    // Debounce para el campo de búsqueda
    this.search$.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.currentPage = 1;
      this.getInfo(this.currentPage, value);
    });

    // Escuchar cambios del input de búsqueda
    this.form_Groups.get('grupoficha')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.search$.next(value));

    if (this.localId) {
      this.getInfo(this.currentPage);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =============================================
  // Carga de datos
  // =============================================
  getInfo(page: number = 1, search: string = ''): void {
    this.loading = true;
    this.errorMessage = '';

    this.UserService.getUsersList(this.localId, page, this.perPage, search)
      .subscribe({
        next: (resp) => {
          this.loading = false;

          if (resp.success && resp.data?.usuarios) {
            this.usersData   = resp.data.usuarios;
            this.currentPage = resp.data.current_page;
            this.lastPage    = resp.data.last_page;
            this.perPage     = resp.data.per_page;
            this.totalUsers  = resp.data.total;
            this.from        = resp.data.from ?? 0;
            this.to          = resp.data.to ?? 0;
          } else {
            this.resetData();
            this.errorMessage = resp.message || 'No se encontraron usuarios';
          }
        },
        error: (err) => {
          this.loading = false;
          this.resetData();
          this.errorMessage = 'Error al conectar con el servidor';
          console.error('Error getInfo:', err);
        }
      });
  }

  private resetData(): void {
    this.usersData   = [];
    this.currentPage = 1;
    this.lastPage    = 1;
    this.totalUsers  = 0;
    this.from        = 0;
    this.to          = 0;
  }

  // =============================================
  // Navegación de páginas
  // =============================================
  goToPage(page: number): void {
    if (page < 1 || page > this.lastPage || page === this.currentPage || this.loading) return;
    const search = this.form_Groups.get('grupoficha')?.value || '';
    this.getInfo(page, search);
  }

  nextPage(): void      { this.goToPage(this.currentPage + 1); }
  prevPage(): void      { this.goToPage(this.currentPage - 1); }
  firstPage(): void     { this.goToPage(1); }
  goToLastPage(): void  { this.goToPage(this.lastPage); }

  changePerPage(size: number | string): void {
    this.perPage = Number(size);
    this.currentPage = 1;
    const search = this.form_Groups.get('grupoficha')?.value || '';
    this.getInfo(1, search);
  }

  refreshData(): void {
    const search = this.form_Groups.get('grupoficha')?.value || '';
    this.getInfo(this.currentPage, search);
  }

  // =============================================
  // Helper para el paginador
  // =============================================
  get pages(): (number | string)[] {
    const total   = this.lastPage;
    const current = this.currentPage;
    const delta   = 2;
    const range: (number | string)[] = [];

    if (total <= 1) return [1];

    const left  = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);
    if (left > 2) range.push('...');
    for (let i = left; i <= right; i++) range.push(i);
    if (right < total - 1) range.push('...');
    range.push(total);

    return range;
  }

  isNumber(p: number | string): p is number {
    return typeof p === 'number';
  }

  // =============================================
  // Grupos
  // =============================================
  getGroups(id: any): void {
    this.UserService.getGroups(id).subscribe((data: any) => {
      this.userGroups = data.Group;
    });
  }

  addGroup(): void {
    console.log('agregando grupo');
    this.getGroups(1);
  }

  onSubmit(): void {
    console.log('onSubmit');
  }
   trackById(index: number, item: Usuario): number {
  return item.id;
}
}



// import { Component, OnInit } from '@angular/core';
// import { UserService } from '../../services/user.service';
// import { AuthService } from '../../services/auth.service';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
// import { PublicityComponent } from "../../components/publicity/publicity.component";
// import { GetUsersListResponse } from '../../interfaces/get-users-list-response';

// @Component({
//     selector: 'app-users',
//     templateUrl: './users.component.html',
//     styleUrls: ['./users.component.css'],
//     standalone: true,
//     imports: [CommonModule, 
//               PublicityComponent,
//               ReactiveFormsModule ]
// })
// export class UsersComponent implements OnInit {
//   public localId: string = '';
//   public usersData: any[] = [];
//   public userGroups: any[] = [];
//   // form_removeGroups: FormGroup;
//   form_Groups: FormGroup;
//   totalUsers!: number;
//   activeUsers!: number;

//   constructor( private UserService: UserService,
//      private AuthService: AuthService,
//     //  private modalRef: BsModalRef,
//       private fb: FormBuilder,
//     ) {

//       this.form_Groups = this.fb.group({
       
//         grupoficha             : [''],
//        }, 
//        ); 

//      }

//   ngOnInit(): void {
//     this.localId = this.AuthService.getLocalId();
//     if (this.localId){
//     this.getInfo();
//     } 
//   }

//   getInfo(): void {
//   this.UserService.getUsersList(this.localId).subscribe({
//     next: (resp: GetUsersListResponse) => {
//       if (resp.success && resp.data?.usuarios) {
//         this.usersData = resp.data.usuarios;
//         this.totalUsers = this.usersData.length;
//         this.activeUsers = this.usersData.filter(u => u.email_verified_at).length;
//       } else {
//         this.usersData = [];
//       }
//     },
//     error: (err) => {
//       console.error('Error:', err);
//       this.usersData = [];
//     }
//   });
// }

//   getGroups(id:any){
//     this.UserService.getGroups(id).subscribe((data)=>{
//        console.log('data', data.Group);
//        this.userGroups = data.Group;
//     });

//   }
//   getGroupAvailable(id: string){
//     this.getGroups(id);
//     // const groups = this.userGroups;
//   }
//    addGroup(){
//      console.log('agregando grupo');
//      this.getGroups(1);
//    }
//    removeGroups() {
//       console.log('removiendo grupo');
//    }
//    onSubmit() {
//       console.log('onSubmit');
//     // this.addGroupModal.hide();
//    }
//    onClickGroup(id: string){
//       console.log('hiciste click en el grupo ', id);
//    }
// }
