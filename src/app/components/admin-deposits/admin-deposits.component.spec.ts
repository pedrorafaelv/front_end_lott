import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AdminDepositsComponent } from './admin-deposits.component';
import { AdminDepositService } from '../../services/admin-deposit.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

describe('AdminDepositsComponent', () => {
    let component: AdminDepositsComponent;
    let fixture: ComponentFixture<AdminDepositsComponent>;
    let depositService: jasmine.SpyObj<AdminDepositService>;
    let authService: jasmine.SpyObj<AuthService>;
    let userService: jasmine.SpyObj<UserService>;

    const mockList = {
        success: true,
        data: {
            deposits: [],
            stats: {
                pending_count: 3,
                pending_amount: 300,
                approved_today: 1,
                completed_today: 2,
                rejected_today: 0,
            },
            pagination: { total: 0, per_page: 20, current_page: 1, last_page: 1 },
        },
    };

    beforeEach(async () => {
        const depositSpy = jasmine.createSpyObj('AdminDepositService',
            ['getDeposits', 'getDepositDetail', 'approve', 'reject', 'complete', 'getStats', 'export', 'createManual', 'searchUsers']);
        const authSpy = jasmine.createSpyObj('AuthService', ['getLocalId']);
        const userSpy = jasmine.createSpyObj('UserService', ['getUserByLocalId']);

        await TestBed.configureTestingModule({
            imports: [AdminDepositsComponent, HttpClientTestingModule, FormsModule, ReactiveFormsModule],
            providers: [
                { provide: AdminDepositService, useValue: depositSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: UserService, useValue: userSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminDepositsComponent);
        component = fixture.componentInstance;
        depositService = TestBed.inject(AdminDepositService) as jasmine.SpyObj<AdminDepositService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load deposits on init', async () => {
        authService.getLocalId.and.returnValue('admin-1');
        userService.getUserByLocalId.and.returnValue(Promise.resolve({ user: [{ id: 99 }] }));
        depositService.getDeposits.and.returnValue(of(mockList as any));
        depositService.getStats.and.returnValue(of({ success: true, data: {} as any, range: { from: '', to: '' } }));

        await component.ngOnInit();

        expect(depositService.getDeposits).toHaveBeenCalled();
    });

    it('should change tab correctly', () => {
        component.changeTab('create');
        expect(component.activeTab).toBe('create');
    });

    it('should validate deposit form requires amount', () => {
        component.depositForm.patchValue({ amount: '' });
        expect(component.depositForm.get('amount')?.invalid).toBeTrue();

        component.depositForm.patchValue({ amount: 100 });
        expect(component.depositForm.get('amount')?.valid).toBeTrue();
    });

    it('should calculate new balance preview', () => {
        component.userCurrentBalance = 500;
        component.depositForm.patchValue({ amount: 100 });

        expect(component.newBalancePreview).toBe(600);
    });

    it('should search users with debounce', (done) => {
        depositService.searchUsers.and.returnValue(of({ success: true, data: [] }));

        component.onUserSearchInput({ target: { value: 'juan' } });

        setTimeout(() => {
            expect(depositService.searchUsers).toHaveBeenCalledWith('juan');
            done();
        }, 500);
    });
});