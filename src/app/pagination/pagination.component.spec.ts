import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { DebugElement, ElementRef } from '@angular/core';
import { By } from '@angular/platform-browser';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let de: DebugElement;
  let buttonPrevious: ElementRef;
  let buttonNext: ElementRef;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    de = fixture.debugElement;
    buttonPrevious = de.query(By.css('button.previous'));
    buttonNext = de.query(By.css('button.next'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit goToPreviousPage when the button *previous* is clicked', () => {
    spyOn(component.goToPreviousPage, 'emit');
    buttonPrevious.nativeElement.click();
    expect(component.goToPreviousPage.emit).toHaveBeenCalled();
  });

  it('should emit goToNextPage when the button *next* is clicked', () => {
    component.currentPage = 2;
    component.totalPages = 3;
    spyOn(component.goToNextPage, 'emit');
    fixture.detectChanges();

    buttonNext.nativeElement.click();
    expect(component.goToNextPage.emit).toHaveBeenCalled();
  });

  it('should not emit goToNextPage when the currentPage is the last page and the button *next* is clicked', () => {
    component.currentPage = 3;
    component.totalPages = 3;
    spyOn(component.goToNextPage, 'emit');
    fixture.detectChanges();

    buttonNext.nativeElement.click();
    expect(component.goToNextPage.emit).not.toHaveBeenCalled();
  });

});
