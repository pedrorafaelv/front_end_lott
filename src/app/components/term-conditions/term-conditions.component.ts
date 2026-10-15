import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  computed,
  signal,inject
} from '@angular/core';
import { TermsService } from '../../services/term-cond.service';
import { Router } from '@angular/router';


export interface TermsAcceptance {
  /** Versión de los términos aceptados */
  version: string;
  /** Marca temporal ISO de la aceptación (trazabilidad probatoria) */
  timestamp: string;
  /** true si el usuario llegó al final del documento antes de aceptar */
  scrolledToEnd: boolean;
  
}

@Component({
  selector: 'app-term-conditions',
  standalone: true,
  imports: [],
  templateUrl: './term-conditions.component.html',
  styleUrls: ['./term-conditions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TermConditionsComponent implements AfterViewInit {
  /** Contenedor scrollable del texto legal */

  private readonly termsService = inject(TermsService);
private readonly router = inject(Router);
  @ViewChild('scrollContainer', { static: false })
  private scrollContainer?: ElementRef<HTMLElement>;

  // ─────────────────────────── Inputs ───────────────────────────

  /** Versión del documento legal. Cámbiala al modificar el texto. */
  @Input() version = '1.0';

  /** Fecha de última actualización mostrada al usuario */
  @Input() lastUpdated = '13 de octubre de 2026';

  /** Nombre del operador (para trazabilidad y encabezado) */
  @Input() operatorName = '';

  /** Si es true, el usuario debe desplazarse hasta el final para poder aceptar */
  @Input() requiresScrollToAccept = true;

  /** Si es true, se muestra el botón de rechazo */
  @Input() showRejectButton = true;
  errorMessage: any;

  /** Deshabilita los controles mientras se persiste la aceptación en backend */
  @Input() set submitting(value: boolean) {
    this.isSubmitting.set(value);
  }

  // ─────────────────────────── Outputs ──────────────────────────

  /** Se emite cuando el usuario acepta los términos */
  @Output() accepted = new EventEmitter<TermsAcceptance>();

  /** Se emite cuando el usuario rechaza los términos */
  @Output() rejected = new EventEmitter<void>();

  /** Se emite al alcanzar el final del documento (útil para analítica) */
  @Output() readCompleted = new EventEmitter<void>();

  // ─────────────────────────── Estado ───────────────────────────

  readonly hasScrolledToEnd = signal(false);
  readonly isChecked = signal(false);
  readonly isSubmitting = signal(false);
  readonly scrollProgress = signal(0);

  private readCompletedEmitted = false;

  /** El botón de aceptar solo se habilita si se cumple la política configurada */
  readonly canAccept = computed(
    () =>
      this.isChecked() &&
      !this.isSubmitting() &&
      (!this.requiresScrollToAccept || this.hasScrolledToEnd()),
  );

  // ─────────────────────────── Ciclo de vida ────────────────────

  ngAfterViewInit(): void {
    // Si el contenido cabe sin scroll, no exigimos desplazamiento
    queueMicrotask(() => this.evaluateInitialScrollState());
  }

  // ─────────────────────────── Handlers ─────────────────────────

  onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const maxScroll = el.scrollHeight - el.clientHeight;

    if (maxScroll <= 0) {
      this.markAsRead();
      return;
    }

    const progress = Math.min(100, (el.scrollTop / maxScroll) * 100);
    this.scrollProgress.set(Math.round(progress));

    // Margen de 24px para tolerar redondeos de subpíxeles
    if (maxScroll - el.scrollTop <= 24) {
      this.markAsRead();
    }
  }

  onCheckboxChange(event: Event): void {
    this.isChecked.set((event.target as HTMLInputElement).checked);
  }

  // onAccept(): void {
  //   if (!this.canAccept()) {
  //     return;
  //   }

  //   this.accepted.emit({
  //     version: this.version,
  //     timestamp: new Date().toISOString(),
  //     scrolledToEnd: this.hasScrolledToEnd(),
  //   });
  // }

  onReject(): void {
    if (this.isSubmitting()) {
      return;
    }
    this.rejected.emit();
  }

  scrollToTop(): void {
    this.scrollContainer?.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─────────────────────────── Privados ─────────────────────────

  private evaluateInitialScrollState(): void {
    const el = this.scrollContainer?.nativeElement;
    if (!el) {
      return;
    }
    if (el.scrollHeight <= el.clientHeight + 4) {
      this.markAsRead();
    }
  }

  private markAsRead(): void {
    this.hasScrolledToEnd.set(true);
    this.scrollProgress.set(100);

    if (!this.readCompletedEmitted) {
      this.readCompletedEmitted = true;
      this.readCompleted.emit();
    }
  }


  onAccept(): void {
  if (!this.canAccept()) return;
  this.isSubmitting.set(true);

  this.termsService
    .accept({ docType: 'terms', version: this.version })
    .subscribe({
      next: (acceptance) => {
        this.isSubmitting.set(false);
        // Emitimos el evento con los datos REALES devueltos por el backend
        this.accepted.emit({
          version: acceptance.version,
          timestamp: acceptance.acceptedAt,
          scrolledToEnd: this.hasScrolledToEnd(),
        });
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(
          err?.error?.message ?? 'No se pudo registrar la aceptación. Inténtalo de nuevo.',
        );
      },
    });
}

}