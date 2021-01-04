import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingsBoardComponent } from './meetings-board.component';

describe('MeetingsBoardComponent', () => {
  let component: MeetingsBoardComponent;
  let fixture: ComponentFixture<MeetingsBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingsBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingsBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
