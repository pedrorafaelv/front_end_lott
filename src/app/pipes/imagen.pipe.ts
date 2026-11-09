import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'imagen',
    standalone: false,
    pure: true  // ⭐ IMPORTANTE: puro para mejor performance
})
export class ImagenPipe implements PipeTransform {

    /**
     * Transforma el número/nombre de una figura a su ruta de imagen
     * 
     * @param valor - Número (60) o string ("60") de la figura
     * @param carpeta - Nombre del tema/carpeta (ej: 'animales', 'frutas', 'deportes')
     * @returns Ruta completa de la imagen
     * 
     * Ejemplos:
     *   transform(60, 'animales')  → './assets/images/animales/60.png'
     *   transform('60', 'frutas')  → './assets/images/frutas/60.png'
     *   transform(null, 'animales')→ './assets/images/no-image.jpg'
     */
    transform(valor: number | string | null | undefined, carpeta?: string): string {

        // 1. Validar que el valor exista
        if (valor === null || valor === undefined || valor === '') {
            return './assets/images/no-image.jpg';
        }

        // 2. Normalizar a string y limpiar
        const valorStr = String(valor).trim();

        // 3. Si está vacío después de limpiar, imagen por defecto
        if (!valorStr) {
            return './assets/images/no-image.jpg';
        }

        // 4. Si la carpeta no se pasa, usar 'Caricatures' por defecto
        const nombreCarpeta = (carpeta || '').trim();

        // 5. Si la carpeta está vacía, usar por defecto
        const carpetaFinal = nombreCarpeta ||'' ;

        // 6. Construir la ruta
        return `./assets/images/${carpetaFinal}/${valorStr}.png`;
    }
}