import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberHeader } from './member-header';

describe('MemberHeader', () => {
  let component: MemberHeader;
  let fixture: ComponentFixture<MemberHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
