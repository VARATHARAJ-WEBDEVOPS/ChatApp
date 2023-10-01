import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyFriendsListsComponent } from './my-friends-lists.component';

describe('MyFriendsListsComponent', () => {
  let component: MyFriendsListsComponent;
  let fixture: ComponentFixture<MyFriendsListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyFriendsListsComponent]
    });
    fixture = TestBed.createComponent(MyFriendsListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
