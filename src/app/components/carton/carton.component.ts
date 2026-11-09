import { Component, EventEmitter, Input, OnInit, Output,SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../pipes/pipes.module';
import { Card } from '../../interfaces/get-cards-raffle-response';
import { posiciones } from '../../../environments/environment.development';

@Component({
    selector: 'app-carton',
    standalone: true,  // <-- Hacer standalone
    imports: [
        CommonModule,
        PipesModule,
        // DirectivesModule
    ],
    templateUrl: './carton.component.html',
    styleUrls: ['./carton.component.css']
})
export class CartonComponent implements OnInit {
    @Input() carton!: Card;
    @Input() recordGroup: string = '@';
    @Input() clickable: boolean = true;  // ← Nuevo: controla si es clickeable

    // ⭐ Fichas que ya salieron (para marcar automáticamente)
    @Input() fichasReveladas: string[] = [];

     // ⭐ Trigger para forzar la actualización de marcas
    @Input() triggerActualizarMarcas: number = 0;

     // ⭐ Estado de cada celda: marcada o no
    // Usamos un objeto con clave = nombre del campo (ej: 'desc_pos01')
    marcas: { [key: string]: boolean } = {};

     // Lista de todas las posiciones del cartón
    posiciones = posiciones;  // ← Importadas desde environment.ts

    @Output() cartonClick = new EventEmitter<Card>();  // ← Emite el cartón clickea

    constructor() { }

    ngOnInit(): void {
         console.log('recordGroup = ', this.recordGroup );
         console.log('carton = ', this.carton );
        this.inicializarMarcas();

    }

     onCartonClick(): void {
        if (this.clickable) {
            this.cartonClick.emit(this.carton);
        }
    }


    esFichaRevelada(descripcion: string): boolean {
    if (!this.fichasReveladas || this.fichasReveladas.length === 0) {
        return false;
    }
    
    // Normalizar: quitar extensión y comparar sin extensión
    const descripcionSinExt = descripcion?.replace(/\.[^/.]+$/, '') || '';
    
    return this.fichasReveladas.some(ficha => {
        const fichaSinExt = ficha?.replace(/\.[^/.]+$/, '') || '';
        return fichaSinExt === descripcionSinExt;
    });
 }


   onFichaClick(ficha:any){
    console.log('ficha', ficha);
   }


   ngOnChanges(changes: SimpleChanges): void {
        // ⭐ Si cambia el trigger, actualizar las marcas automáticamente
        if (changes['triggerActualizarMarcas'] && !changes['triggerActualizarMarcas'].firstChange) {
            console.log('🔄 Trigger de actualización recibido');
            this.marcarFichasSalidas();
        }

        // Si cambia el cartón, reiniciar marcas
        if (changes['carton'] && !changes['carton'].firstChange) {
            this.inicializarMarcas();
        }
    }

     /**
     * Inicializa el estado de las marcas (todas en false)
     */
    private inicializarMarcas(): void {
        this.marcas = {};
        this.posiciones.forEach(pos => {
            this.marcas[pos] = false;
        });
    }


     /**
     * 🎯 Marca todas las fichas que ya salieron en el sorteo
     * Se ejecuta cuando se presiona el botón
     */
    marcarFichasSalidas(): void {
        if (!this.fichasReveladas || this.fichasReveladas.length === 0) {
            console.log('⚠️ No hay fichas reveladas');
            return;
        }

        console.log('🎯 Marcando fichas salidas:', this.fichasReveladas);

        this.posiciones.forEach(pos => {
            const valor = this.carton[pos as keyof Card];
            
            if (valor && typeof valor === 'string') {
                // Normalizar comparación
                const valorNormalizado = this.normalizar(valor);
                const estaRevelada = this.fichasReveladas.some(ficha => 
                    this.normalizar(ficha) === valorNormalizado
                );
                
                // Solo marcar (no desmarcar) si está revelada
                if (estaRevelada) {
                    this.marcas[pos] = true;
                }

            }
        });
    }

    /**
     * 🎯 TAREA 2: Marca/desmarca una celda al hacer click
     */
    toggleMarca(pos: string, event: Event): void {
        event.stopPropagation();  // Evitar que el click se propague al cartón
        
        this.marcas[pos] = !this.marcas[pos];
        console.log(`🔀 Celda ${pos} → ${this.marcas[pos] ? 'MARCADA' : 'DESMARCADA'}`);
    }

    /**
     * Verifica si una celda está marcada
     */
    estaMarcada(pos: string): boolean {
        return this.marcas[pos] === true;
    }

    /**
     * Normaliza el valor para comparaciones
     */
    private normalizar(valor: string): string {
        if (!valor) return '';
        // Quitar extensión y espacios, convertir a minúsculas
        return valor.replace(/\.[^/.]+$/, '').trim().toLowerCase();
    }

   
    /**
     * Obtener el valor de una posición del cartón
     */
    getValorPosicion(pos: string): string {
        // console.log('🔍 Obteniendo valor de posición', pos, 'en cartón', this.carton[pos as keyof Card]);
        return this.carton[pos as keyof Card] as string;
    }


    contarMarcadas(): number {
    return Object.values(this.marcas).filter(m => m === true).length;
    }
    // esFichaRevelada(descripcion: string): boolean {
    //     if (!this.fichasReveladas || this.fichasReveladas.length === 0) {
    //         return false;
    //     }
    //     // Comparamos por nombre del archivo de imagen o por ID
    //     return this.fichasReveladas.includes(descripcion);
    // }
}