import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsComponent } from './groups.component';

declare function describe(name: string, spec: () => void): void;
declare function beforeEach(spec: () => void | Promise<void>): void;
declare function it(name: string, spec: () => void): void;
declare const expect: (actual: unknown) => { toBeTruthy(): void };

describe('GroupsComponent', () => {
  let component: GroupsComponent;
  let fixture: ComponentFixture<GroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
