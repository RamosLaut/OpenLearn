import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberFooter } from './member-footer';

describe('MemberFooter', () => {
  let component: MemberFooter;
  let fixture: ComponentFixture<MemberFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
