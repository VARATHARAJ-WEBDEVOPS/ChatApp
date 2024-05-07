import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChattingComponent } from './group-chatting.component';

describe('GroupChattingComponent', () => {
  let component: GroupChattingComponent;
  let fixture: ComponentFixture<GroupChattingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupChattingComponent]
    });
    fixture = TestBed.createComponent(GroupChattingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
