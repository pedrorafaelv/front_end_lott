import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AdminWithdrawalsComponent } from './admin-withdrawals.component';
import { AdminWithdrawalService } from '../../services/admin-withdrawal.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

describe('AdminWithdrawalsComponent', () => {
    let component: AdminWithdrawalsComponent;
    let fixture: ComponentFixture<AdminWithdrawalsComponent>;
    let adminService: jasmine.SpyObj<AdminWithdrawalService>;
    let authService: jasmine.SpyObj<AuthService>;
    let userService: jasmine.SpyObj<UserService>;

    const mockList = {
        success: true,
        data: {
            withdrawals: [],
            stats: {
                pending_count: 5,
                pending_amount: 500,
                approved_today: 2,
                completed_today: 3,
                rejected_today: 1,
            },
            pagination: {
                total: 0,
                per_page: 20,
                current_page: 1,
                last_page: 1,
            },
        },
    };

    beforeEach(async () => {
        const adminSpy = jasmine.createSpyObj('AdminWithdrawalService',
            ['getWithdrawals', 'getWithdrawalDetail', 'approve', 'reject', 'complete', 'getStats', 'getLogs', 'export']);
        const authSpy = jasmine.createSpyObj('AuthService', ['getLocalId']);
        const userSpy = jasmine.createSpyObj('UserService', ['getUserByLocalId']);

        await TestBed.configureTestingModule({
            imports: [
                AdminWithdrawalsComponent,
                HttpClientTestingModule,
                FormsModule,
                ReactiveFormsModule,
            ],
            providers: [
                { provide: AdminWithdrawalService, useValue: adminSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: UserService, useValue: userSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminWithdrawalsComponent);
        component = fixture.componentInstance;
        adminService = TestBed.inject(AdminWithdrawalService) as jasmine.SpyObj<AdminWithdrawalService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load withdrawals on init', async () => {
        authService.getLocalId.and.returnValue('admin-1');
        userService.getUserByLocalId.and.returnValue(Promise.resolve({ user: [{ id: 99 }] }));
        adminService.getWithdrawals.and.returnValue(of(mockList as any));
        adminService.getStats.and.returnValue(of({ success: true, data: {} as any, range: { from: '', to: '' } }));

        await component.ngOnInit();

        expect(adminService.getWithdrawals).toHaveBeenCalled();
    });

    it('should change status tab and reload', () => {
        adminService.getWithdrawals.and.returnValue(of(mockList as any));

        component.changeStatusTab('pending');
        expect(component.selectedStatusTab).toBe('pending');
        expect(component.filters.status).toBe('pending');
    });

    it('should clear filters', () => {
        adminService.getWithdrawals.and.returnValue(of(mockList as any));

        component.filters.status = 'pending';
        component.filters.currency_code = 'USD';
        component.clearFilters();

        expect(component.filters.status).toBeNull();
        expect(component.filters.currency_code).toBeNull();
    });

    it('should validate reject form requires notes', () => {
        component.rejectForm.patchValue({ admin_notes: '' });
        expect(component.rejectForm.invalid).toBeTrue();

        component.rejectForm.patchValue({ admin_notes: 'Motivo válido' });
        expect(component.rejectForm.valid).toBeTrue();
    });

    it('should validate complete form requires reference', () => {
        component.completeForm.patchValue({ transaction_reference: '' });
        expect(component.completeForm.invalid).toBeTrue();

        component.completeForm.patchValue({ transaction_reference: 'REF-123' });
        expect(component.completeForm.valid).toBeTrue();
    });

    it('should detect action permissions by status', () => {
        component.selectedWithdrawal = { status: 'pending' } as any;
        expect(component.canApprove).toBeTrue();
        expect(component.canReject).toBeTrue();
        expect(component.canComplete).toBeFalse();

        component.selectedWithdrawal = { status: 'approved' } as any;
        expect(component.canApprove).toBeFalse();
        expect(component.canReject).toBeFalse();
        expect(component.canComplete).toBeTrue();
    });
});