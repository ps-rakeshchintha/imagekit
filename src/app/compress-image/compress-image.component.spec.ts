import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompressImageComponent } from './compress-image.component';

describe('CompressImageComponent', () => {
  let component: CompressImageComponent;
  let fixture: ComponentFixture<CompressImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompressImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompressImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
