import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PublicityImage {
    id: number;
    imageUrl: string;
    title: string;
    description: string;
    link?: string;
}

@Component({
    selector: 'app-publicity',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './publicity.component.html',
    styleUrls: ['./publicity.component.css']
})
export class PublicityComponent implements OnInit, OnDestroy {
    @Input() intervalTime: number = 10000; // 10 segundos por defecto
    @Input() autoPlay: boolean = true;
    @Input() showIndicators: boolean = true;
    @Input() showControls: boolean = false;

    // Lista de imágenes publicitarias
    images: PublicityImage[] = [
        {
            id: 1,
            imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            title: '¡Gran Sorteo!',
            description: 'Participa y gana increíbles premios',
            link: '/sorteos'
        },
        {
            id: 2,
            imageUrl: 'https://images.unsplash.com/photo-1635320184824-5416c8f0c5e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            title: 'Nuevos Cartones',
            description: 'Descubre nuestra nueva colección',
            link: '/cartones'
        },
        {
            id: 3,
            imageUrl: 'https://images.unsplash.com/photo-1612774412771-005ed8e861d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            title: 'Jackpot Millonario',
            description: 'El premio más grande de la historia',
            link: '/jackpot'
        },
        {
            id: 4,
            imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            title: 'Sorteo Especial',
            description: 'Solo por tiempo limitado',
            link: '/especial'
        },
        {
            id: 5,
            imageUrl: 'https://images.unsplash.com/photo-1575311373936-6e9f028c59e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            title: '¡Fiesta de la Suerte!',
            description: 'Celebra con nosotros esta noche',
            link: '/fiesta'
        }
    ];

    currentIndex: number = 0;
    private intervalId: any = null;
    private isTransitioning: boolean = false;

    ngOnInit(): void {
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }

    ngOnDestroy(): void {
        this.stopAutoPlay();
    }

    startAutoPlay(): void {
        this.stopAutoPlay();
        this.intervalId = setInterval(() => {
            this.nextSlide();
        }, this.intervalTime);
    }

    stopAutoPlay(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    nextSlide(): void {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    prevSlide(): void {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    goToSlide(index: number): void {
        if (this.isTransitioning || index === this.currentIndex) return;
        this.isTransitioning = true;
        this.currentIndex = index;
        setTimeout(() => {
            this.isTransitioning = false;
        }, 500);
    }

    onImageClick(image: PublicityImage): void {
        if (image.link) {
            // Redirigir a la URL
            window.location.href = image.link;
            // O usar el router si prefieres navegación interna
            // this.router.navigate([image.link]);
        }
        console.log('📢 Click en publicidad:', image.title);
    }

    // Pausar autoplay al hacer hover
    onMouseEnter(): void {
        if (this.autoPlay) {
            this.stopAutoPlay();
        }
    }

    onMouseLeave(): void {
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }
}