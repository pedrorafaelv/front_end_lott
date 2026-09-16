import {
    Component,
    ElementRef,
    viewChild,
    AfterViewInit,
    OnDestroy,
    OnChanges,
    SimpleChanges,
    Input,
    ChangeDetectionStrategy,
    signal,
    inject,
    NgZone,
} from '@angular/core';
import { CommonModule } from '@angular/common';

type Phase = 'idle' | 'rolling' | 'movingToCenter' | 'holding' | 'fading' | 'gone';

interface Ball {
    x: number;
    y: number;
    vx: number;
    radius: number;
    angle: number;
    angularVel: number;
    number: number;
    opacity: number;
}

@Component({
    selector: 'app-bouncing-ball',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './bouncing-ball.component.html',
    styleUrls: ['./bouncing-ball.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BouncingBallComponent implements AfterViewInit, OnDestroy, OnChanges {

    // ============================================================
    // INPUTS
    // ============================================================
    @Input() imagenActual: string = '';
    @Input() nombreFicha: string = '';

    // ============================================================
    // VIEW CHILDREN (SIN .required para evitar NG0951)
    // ============================================================
    readonly containerRef = viewChild<ElementRef<HTMLDivElement>>('container');
    readonly canvasRef = viewChild<ElementRef<HTMLCanvasElement>>('ballCanvas');

    readonly width = signal(0);
    readonly height = signal(0);

    // ============================================================
    // PROPIEDADES PRIVADAS
    // ============================================================
    private ctx!: CanvasRenderingContext2D;
    private resizeObserver?: ResizeObserver;
    private animationId: number | null = null;
    private readonly zone = inject(NgZone);

    private loadedImage: HTMLImageElement | null = null;
    private imageReady = false;

    private W = 0;
    private H = 0;

    // ----- Física -----
    private readonly GROUND_FRICTION = 0.988;
    private readonly SPIN_DAMPING = 0.995;
    private readonly MIN_SPEED = 0.3;

    // ----- Transición al centro -----
    private readonly CENTER_DURATION = 600;
    private readonly CENTER_SCALE = 1.75;
    private readonly HOLD_DURATION = 1500;
    private readonly FADE_SPEED = 0.02;

    // ----- Radio base -----
    private readonly RADIUS_RATIO = 0.32;
    private readonly MIN_RADIUS = 8;
    private readonly MAX_RADIUS = 40;

    private baseRadius = 20;

    private ball: Ball = {
        x: 0, y: 0, vx: 0,
        radius: 20, angle: 0, angularVel: 0,
        number: 0, opacity: 1,
    };

    private phase: Phase = 'idle';
    private transitionStart = { x: 0, y: 0, r: 0, t: 0 };
    private holdStartTime = 0;

    // ============================================================
    // LIFECYCLE
    // ============================================================

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['imagenActual'] && !changes['imagenActual'].firstChange) {
            console.log('🔄 BouncingBall: Nueva imagen →', this.imagenActual);

            if (this.imagenActual) {
                this.cargarImagen(this.imagenActual);
            } else {
                this.loadedImage = null;
                this.imageReady = false;
            }
        }
    }

    ngAfterViewInit(): void {
        const canvasRef = this.canvasRef();
        const containerRef = this.containerRef();

        if (!canvasRef || !containerRef) {
            console.error('❌ Canvas o container no disponibles');
            return;
        }

        const canvas = canvasRef.nativeElement;
        const container = containerRef.nativeElement;

        const context = canvas.getContext('2d');
        if (!context) {
            console.error('No se pudo obtener el contexto 2D del canvas');
            return;
        }
        this.ctx = context;

        this.handleResize(container.clientWidth, container.clientHeight);

        this.resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                this.handleResize(entry.contentRect.width, entry.contentRect.height);
            }
        });
        this.resizeObserver.observe(container);

        this.zone.runOutsideAngular(() => this.animate());
    }

    ngOnDestroy(): void {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
        }
        this.resizeObserver?.disconnect();
    }

    // ============================================================
    // CARGA DE IMAGEN
    // ============================================================

    private cargarImagen(url: string): void {
        console.log('📥 Cargando imagen:', url);

        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            console.log('✅ Imagen cargada:', url, '→', img.width, 'x', img.height);
            this.loadedImage = img;
            this.imageReady = true;
            this.reiniciarAnimacion();
        };

        img.onerror = () => {
            console.warn('❌ No se pudo cargar la imagen:', url);
            this.loadedImage = null;
            this.imageReady = false;
        };

        img.src = url;
    }

    // ============================================================
    // REINICIAR Y LANZAR
    // ============================================================

    private reiniciarAnimacion(): void {
        console.log('🔄 reiniciarAnimacion - phase antes:', this.phase);

        // Resetear completamente el estado
        this.phase = 'idle';
        this.ball.opacity = 1;
        this.ball.angle = 0;
        this.ball.radius = this.baseRadius;
        this.ball.vx = 0;
        this.ball.angularVel = 0;

        // Lanzar
        this.launchBall();

        console.log('🔄 reiniciarAnimacion - phase después:', this.phase);
    }

    launchBall(): void {
        console.log('🎯 launchBall - phase antes:', this.phase);

        if (this.phase !== 'idle' && this.phase !== 'gone') {
            console.warn('⚠️ launchBall BLOQUEADO - phase es:', this.phase);
            return;
        }

        const dir = Math.random() > 0.5 ? 1 : -1;

        this.ball.radius = this.baseRadius;
        const floorY = this.H - this.ball.radius - 4;
        const speed = this.W * 0.006 + Math.random() * 1.2;

        this.ball.x = dir === 1 ? this.ball.radius + 4 : this.W - this.ball.radius - 4;
        this.ball.y = floorY;
        this.ball.vx = dir * speed;
        this.ball.angularVel = this.ball.vx / this.ball.radius;
        this.ball.number = Math.floor(Math.random() * 90) + 1;
        this.ball.opacity = 1;

        this.phase = 'rolling';
        console.log('✅ launchBall - phase después:', this.phase);
    }

    // ============================================================
    // EVENTOS DE UI
    // ============================================================

    onCanvasClick(): void {
        this.launchBall();
    }

    onKeydown(event: KeyboardEvent): void {
        if (event.key === ' ' || event.key === 'Enter' || event.key === 'r' || event.key === 'R') {
            event.preventDefault();
            this.launchBall();
        }
    }

    // ============================================================
    // RESIZE
    // ============================================================

    private handleResize(cssWidth: number, cssHeight: number): void {
        if (cssWidth <= 0 || cssHeight <= 0) return;

        const dpr = window.devicePixelRatio || 1;
        const canvasRef = this.canvasRef();
        if (!canvasRef) return;
        const canvas = canvasRef.nativeElement;

        canvas.width = Math.round(cssWidth * dpr);
        canvas.height = Math.round(cssHeight * dpr);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${cssHeight}px`;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const oldW = this.W;
        const oldH = this.H;
        this.W = cssWidth;
        this.H = cssHeight;
        this.width.set(cssWidth);
        this.height.set(cssHeight);

        this.baseRadius = Math.min(
            this.MAX_RADIUS,
            Math.max(this.MIN_RADIUS, cssHeight * this.RADIUS_RATIO)
        );

        if (oldW === 0 || oldH === 0) {
            this.ball.radius = this.baseRadius;
            this.ball.x = cssWidth / 2;
            this.ball.y = cssHeight - this.baseRadius - 4;
            this.ball.number = Math.floor(Math.random() * 90) + 1;
            return;
        }

        const sx = cssWidth / oldW;
        const sy = cssHeight / oldH;
        this.ball.x *= sx;
        this.ball.y *= sy;
        this.ball.vx *= sx;

        if (this.phase === 'idle' || this.phase === 'gone' || this.phase === 'rolling') {
            this.ball.radius = this.baseRadius;
        }

        if (this.phase === 'rolling') {
            this.ball.y = this.H - this.ball.radius - 4;
        }
    }

    // ============================================================
    // BUCLE DE ANIMACIÓN
    // ============================================================

    private animate = (): void => {
        const ball = this.ball;
        const now = performance.now();

        // ⭐ Si aún no hay imagen lista, solo esperar
        if (!this.imageReady) {
            this.dibujar();
            this.animationId = requestAnimationFrame(this.animate);
            return;
        }

        // ⭐ FASE IDLE - No hay nada que hacer, esperar
        if (this.phase === 'idle') {
            this.dibujar();
            this.animationId = requestAnimationFrame(this.animate);
            return;
        }

        // ⭐ FASE GONE - Relanzar automáticamente
        if (this.phase === 'gone') {
            // console.log('🔁 Ciclo completado → Relanzando automáticamente');

            // this.ball.opacity = 1;
            // this.ball.angle = 0;
            // this.ball.radius = this.baseRadius;
            // this.ball.number = Math.floor(Math.random() * 90) + 1;

            // // Resetear a idle y lanzar
            // this.phase = 'idle';
            // this.launchBall();

            this.dibujar();
            this.animationId = requestAnimationFrame(this.animate);
            return;
        }

        // ⭐ FASE ROLLING - La bola rueda
        if (this.phase === 'rolling') {
            ball.x += ball.vx;
            ball.vx *= this.GROUND_FRICTION;
            ball.angle += ball.angularVel;
            ball.angularVel = ball.vx / ball.radius;

            // Rebotes en los bordes
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx = -ball.vx * 0.5;
                ball.angularVel = ball.vx / ball.radius;
            } else if (ball.x + ball.radius > this.W) {
                ball.x = this.W - ball.radius;
                ball.vx = -ball.vx * 0.5;
                ball.angularVel = ball.vx / ball.radius;
            }

            // Cuando pierde velocidad, ir al centro
            if (Math.abs(ball.vx) < this.MIN_SPEED) {
                ball.vx = 0;
                this.phase = 'movingToCenter';
                this.transitionStart = { x: ball.x, y: ball.y, r: ball.radius, t: now };
            }
        }
        // ⭐ FASE MOVING TO CENTER - Se mueve al centro
        else if (this.phase === 'movingToCenter') {
            const elapsed = now - this.transitionStart.t;
            const t = Math.min(1, elapsed / this.CENTER_DURATION);
            const eased = t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;

            const targetX = this.W / 2;
            const targetY = this.H / 2;
            const startR = this.baseRadius;
            const targetR = this.baseRadius * this.CENTER_SCALE;

            ball.x = this.transitionStart.x + (targetX - this.transitionStart.x) * eased;
            ball.y = this.transitionStart.y + (targetY - this.transitionStart.y) * eased;
            ball.radius = startR + (targetR - startR) * eased;

            ball.angularVel *= 0.96;
            ball.angle += ball.angularVel;

            if (t >= 1) {
                ball.x = targetX;
                ball.y = targetY;
                ball.radius = targetR;
                this.phase = 'holding';
                this.holdStartTime = now;
            }
        }
        // ⭐ FASE HOLDING - Se queda en el centro pulsando
        else if (this.phase === 'holding') {
            const elapsed = now - this.holdStartTime;
            const pulse = 1 + Math.sin(elapsed / 120) * 0.015;
            const baseR = this.baseRadius * this.CENTER_SCALE;
            ball.radius = baseR * pulse;

            ball.angle += 0.004;

            if (elapsed >= this.HOLD_DURATION) {
                ball.radius = baseR;
                this.phase = 'fading';
            }
        }
        // ⭐ FASE FADING - Se desvanece
        else if (this.phase === 'fading') {
            ball.opacity -= this.FADE_SPEED;
            ball.angle += 0.002;

            if (ball.opacity <= 0) {
                ball.opacity = 0;
                this.phase = 'gone';
                console.log('✅ Llegó a fase gone');
            }
        }

        this.dibujar();
        this.animationId = requestAnimationFrame(this.animate);
    };

    // ============================================================
    // DIBUJO
    // ============================================================

    private dibujar(): void {
        const ctx = this.ctx;
        if (!ctx) return;

        const W = this.W;
        const H = this.H;

        ctx.clearRect(0, 0, W, H);

        this.dibujarSuelo(ctx, W, H);

        if (this.phase === 'rolling' || this.phase === 'movingToCenter') {
            this.dibujarSombra(ctx, this.ball, H);
            this.dibujarPelota(ctx, this.ball);
        } else if (this.phase === 'holding' || this.phase === 'fading') {
            this.dibujarPelota(ctx, this.ball);
        }
    }

    private dibujarSuelo(ctx: CanvasRenderingContext2D, W: number, H: number): void {
        const floorY = H - 4;

        ctx.beginPath();
        ctx.moveTo(0, floorY);
        ctx.lineTo(W, floorY);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const grad = ctx.createLinearGradient(0, floorY - 20, 0, floorY);
        grad.addColorStop(0, 'rgba(120, 170, 255, 0)');
        grad.addColorStop(1, 'rgba(120, 170, 255, 0.08)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, floorY - 20, W, 20);
    }

    private dibujarPelota(ctx: CanvasRenderingContext2D, ball: Ball): void {
        if (ball.opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = ball.opacity;
        ctx.translate(ball.x, ball.y);
        ctx.rotate(ball.angle);

        // 1. Cuerpo blanco de fondo
        ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 2;

        const grad = ctx.createRadialGradient(
            -ball.radius * 0.35, -ball.radius * 0.4, ball.radius * 0.15,
            0, 0, ball.radius * 1.05
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#f1f5f9');
        grad.addColorStop(0.85, '#cbd5e1');
        grad.addColorStop(1, '#94a3b8');

        ctx.beginPath();
        ctx.arc(0, 0, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // 2. Borde
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = 'rgba(100, 116, 139, 0.8)';
        ctx.lineWidth = 0;
        ctx.stroke();

        // 3. Contenido: imagen o número
        if (this.imageReady && this.loadedImage) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(0, 0, ball.radius * 0.86, 0, Math.PI * 2);
            ctx.clip();

            // Mantener aspect ratio de la imagen
            const img = this.loadedImage;
            const imgAspect = img.width / img.height;
            const maxSize = ball.radius * 1.72;

            let drawWidth = maxSize;
            let drawHeight = maxSize;

            if (imgAspect > 1) {
                drawHeight = maxSize / imgAspect;
            } else {
                drawWidth = maxSize * imgAspect;
            }

            ctx.drawImage(
                img,
                -drawWidth / 2,
                -drawHeight / 2,
                drawWidth,
                drawHeight
            );
            ctx.restore();

            // Aro decorativo
            ctx.beginPath();
            ctx.arc(0, 0, ball.radius * 0.86, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        } else {
            // Fallback: número
            ctx.fillStyle = '#1e293b';
            ctx.font = `700 ${ball.radius * 0.9}px system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(ball.number), 0, 1);
        }

        // 4. Brillo superior
        ctx.beginPath();
        ctx.arc(-ball.radius * 0.3, -ball.radius * 0.35, ball.radius * 0.18, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
        ctx.fill();

        ctx.restore();
    }

    private dibujarSombra(ctx: CanvasRenderingContext2D, ball: Ball, H: number): void {
        const floorY = H - 4;

        ctx.save();
        ctx.globalAlpha = ball.opacity * 0.5;
        ctx.beginPath();
        ctx.ellipse(
            ball.x,
            floorY - 1,
            ball.radius * 1.05,
            ball.radius * 0.28,
            0, 0, Math.PI * 2
        );
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fill();
        ctx.restore();
    }
}