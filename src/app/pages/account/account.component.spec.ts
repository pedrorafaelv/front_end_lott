import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { AccountComponent } from './account.component';
import { AccountService } from '../../services/account.service';
import { WithdrawalService } from '../../services/withdrawal.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

describe('AccountComponent', () => {
    let component: AccountComponent;
    let fixture: ComponentFixture<AccountComponent>;
    let accountService: jasmine.SpyObj<AccountService>;
    let withdrawalService: jasmine.SpyObj<WithdrawalService>;
    let authService: jasmine.SpyObj<AuthService>;
    let userService: jasmine.SpyObj<UserService>;

    const mockSummary = {
        success: true,
        data: {
            balances: {
                USD: {
                    currency_code: 'USD',
                    amount: 500,
                    credit_promotion: 50,
                    total: 550,
                },
            },
            totals: {
                deposits: 1000,
                withdrawals: 500,
                bets: 200,
                awards: 300,
                promotions: 50,
            },
            recent_transactions: [],
            withdrawal_requests: [],
            currencies: [
                { id: 1, code: 'USD', name: 'Dólar', symbol: '$', decimals: 2, flag: 'us', is_crypto: false, is_active: true, display_order: 1 },
            ],
            vias: [
                { id: 1, code: 'bet', label: 'Apuesta', icon: 'fas fa-dice', color: '#ff4757', type: 'debit', is_active: true, display_order: 1 },
            ],
        },
    };

    beforeEach(async () => {
        const accountSpy = jasmine.createSpyObj('AccountService', ['getSummary', 'getTransactions', 'checkBet', 'store']);
        const withdrawalSpy = jasmine.createSpyObj('WithdrawalService', ['requestWithdrawal', 'myWithdrawals', 'cancelWithdrawal']);
        const authSpy = jasmine.createSpyObj('AuthService', ['getLocalId']);
        const userSpy = jasmine.createSpyObj('UserService', ['getUserByLocalId']);

        await TestBed.configureTestingModule({
            imports: [
                AccountComponent,
                HttpClientTestingModule,
                FormsModule,
                ReactiveFormsModule,
            ],
            providers: [
                { provide: AccountService, useValue: accountSpy },
                { provide: WithdrawalService, useValue: withdrawalSpy },
                { provide: AuthService, useValue: authSpy },
                { provide: UserService, useValue: userSpy },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AccountComponent);
        component = fixture.componentInstance;
        accountService = TestBed.inject(AccountService) as jasmine.SpyObj<AccountService>;
        withdrawalService = TestBed.inject(WithdrawalService) as jasmine.SpyObj<WithdrawalService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load user and summary on init', async () => {
        authService.getLocalId.and.returnValue('local-123');
        userService.getUserByLocalId.and.returnValue(Promise.resolve({ user: [{ id: 1 }] }));
        accountService.getSummary.and.returnValue(of(mockSummary as any));

        await component.ngOnInit();

        expect(component.userId).toBe(1);
        expect(accountService.getSummary).toHaveBeenCalledWith(1);
    });

    it('should format currency correctly', () => {
        component.currencies = mockSummary.data.currencies as any;
        component.selectedCurrency = 'USD';

        const formatted = component.formatCurrency(1234.56);
        expect(formatted).toBe('$1,234.56');
    });

    it('should open withdrawal modal only if balance > 0', () => {
        component.currentBalance = null;
        component.openWithdrawalModal();
        expect(component.showWithdrawalModal).toBeFalse();

        component.currentBalance = { currency_code: 'USD', amount: 100, credit_promotion: 0, total: 100 };
        component.openWithdrawalModal();
        expect(component.showWithdrawalModal).toBeTrue();
    });

    it('should change currency and reload transactions', () => {
        accountService.getTransactions.and.returnValue(of({ success: true, data: { transactions: [], pagination: { total: 0, per_page: 20, current_page: 1, last_page: 1 } } } as any));

        component.changeCurrency('EUR');

        expect(component.selectedCurrency).toBe('EUR');
        expect(component.filters.currency_code).toBe('EUR');
        expect(accountService.getTransactions).toHaveBeenCalled();
    });

    it('should clear filters and reload', () => {
        accountService.getTransactions.and.returnValue(of({ success: true, data: { transactions: [], pagination: { total: 0, per_page: 20, current_page: 1, last_page: 1 } } } as any));

        component.filters.via_id = 1;
        component.filters.type = 'debit';
        component.clearFilters();

        expect(component.filters.via_id).toBeNull();
        expect(component.filters.type).toBeNull();
        expect(accountService.getTransactions).toHaveBeenCalled();
    });

    it('should validate amount in withdrawal form', () => {
        component.withdrawalForm.patchValue({ amount: -5 });
        expect(component.withdrawalForm.get('amount')?.invalid).toBeTrue();

        component.withdrawalForm.patchValue({ amount: 100 });
        expect(component.withdrawalForm.get('amount')?.valid).toBeTrue();
    });
});