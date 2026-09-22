import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Permissions } from '../interfaces/get-user-permissions-response';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { AdminService } from '../services/admin.service';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private usr: UserService,
        private adminService: AdminService,
        private router: Router
    ) { }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {

        // ============================================
        // 1. VERIFICAR AUTENTICACIÓN BÁSICA
        // ============================================
        if (!this.auth.estaAutenticado()) {
            console.warn('⚠️ AdminGuard: No autenticado');
            this.router.navigateByUrl('/log-in');
            return false;
        }

        const localId = this.auth.getLocalId();
        if (!localId) {
            console.warn('⚠️ AdminGuard: No hay localId');
            this.router.navigateByUrl('/log-in');
            return false;
        }

        // ============================================
        // 2. OBTENER EL USER ID
        // ============================================
        let userId: number | null = null;

        try {
            const userRes = await this.usr.getUserByLocalId(localId);
            userId = userRes?.user?.[0]?.id ?? null;

            if (!userId) {
                console.warn('⚠️ AdminGuard: No se encontró el usuario');
                this.router.navigateByUrl('/log-in');
                return false;
            }

            console.log('👤 AdminGuard: userId =', userId);

        } catch (error) {
            console.error('❌ AdminGuard: Error al obtener usuario', error);
            this.router.navigateByUrl('/log-in');
            return false;
        }

        // ============================================
        // 3. INTENTAR VERIFICAR POR PERMISSIONS
        // ============================================
        let isAdminByPermissions = false;

        try {
            console.log('🔑 AdminGuard: Verificando por Permissions...');
            const permissionsRes = await this.usr.getPermissionsByUser(String(userId));

            if (permissionsRes && permissionsRes.Permissions) {
                const permissions: Permissions = permissionsRes.Permissions;
                console.log('🔑 Permissions obtenidos:', permissions);

                isAdminByPermissions = this.checkIfAdminByPermissions(permissions);

                if (isAdminByPermissions) {
                    console.log('✅ AdminGuard: Acceso permitido por Permissions');
                    return true;
                }

                console.log('ℹ️ AdminGuard: Sin permisos de admin por Permissions, intentando fallback...');
            } else {
                console.warn('⚠️ AdminGuard: Permissions vacío o undefined, intentando fallback...');
            }

        } catch (error) {
            console.warn('⚠️ AdminGuard: Error en getPermissionsByUser, usando fallback...', error);
        }
              console.log('🔑 Permissions obtenidos:', Permissions);

        // ============================================
        // 4. FALLBACK: VERIFICAR POR checkAdmin
        // ============================================
        try {
            console.log('🔄 AdminGuard: FALLBACK → Verificando con checkAdmin...');
            const isAdmin = await this.adminService.checkAdmin(userId).toPromise();

            if (isAdmin === true) {
                console.log('✅ AdminGuard: Acceso permitido por checkAdmin (fallback)');
                return true;
            }

            console.warn('⚠️ AdminGuard: checkAdmin devolvió false');

        } catch (error) {
            console.error('❌ AdminGuard: Error en checkAdmin (fallback)', error);
        }
       

        // ============================================
        // 5. SIN PERMISOS → DENEGAR
        // ============================================
        console.warn('🚫 AdminGuard: Acceso denegado - sin permisos de admin');

        Swal.fire({
            icon: 'error',
            title: 'Acceso denegado',
            text: 'No tienes permisos para acceder a esta sección',
            confirmButtonText: 'Ir al dashboard',
            confirmButtonColor: '#176585'
        }).then(() => {
            this.router.navigateByUrl('/dashboard');
        });

        return false;
    }

    /**
     * 🔍 Verifica si el usuario tiene permiso de admin según `Permissions`
     * 
     * ⚠️⚠️⚠️ AJUSTA ESTA VALIDACIÓN según la estructura real de `Permissions` ⚠️⚠️⚠️
     */
    private checkIfAdminByPermissions(permissions: Permissions | undefined | null): boolean {
        if (!permissions) return false;

        console.log('🔍 checkIfAdminByPermissions - input:', permissions);
        const permsAny = permissions as any;

        // ============================================
        // ⚠️ AJUSTA SEGÚN TU ESTRUCTURA
        // ============================================

        // CASO A: Permissions es un array de strings
        // Ejemplo: ["admin", "user", "editor"]
        if (Array.isArray(permsAny)) {
            const found = permsAny.some((p: any) => {
                const value = typeof p === 'string' ? p : (p?.name || p?.code || p?.slug || '');
                return ['admin', 'Admin', 'ADMIN', 'super_admin', 'superadmin'].includes(value);
            });
            if (found) return true;
        }

        // CASO B: Permissions es un objeto con flags
        // Ejemplo: { is_admin: true, role: 'admin', ... }
        if (permsAny?.is_admin === true) return true;
        if (permsAny?.admin === true) return true;
        if (permsAny?.role === 'admin' || permsAny?.role === 'Admin') return true;
        if (permsAny?.role_id === 1) return true;  // Si el rol 1 es admin

        // CASO C: Permissions tiene un array anidado
        // Ejemplo: { permissions: ["admin", "user"] }
        if (Array.isArray(permsAny?.permissions)) {
            return permsAny.permissions.some((p: any) => {
                const value = typeof p === 'string' ? p : (p?.name || p?.code || '');
                return ['admin', 'Admin', 'super_admin'].includes(value);
            });
        }

        // CASO D: Permissions es un array de objetos con `code` o `name`
        // Ejemplo: [{ id: 1, name: 'admin', code: 'ADMIN' }, ...]
        if (Array.isArray(permsAny?.modules)) {
            return permsAny.modules.some((m: any) =>
                m?.code === 'admin' || m?.name === 'admin' || m?.slug === 'admin'
            );
        }

        console.log('🔍 No se encontró coincidencia de admin');
        return false;
    }
}