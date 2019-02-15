import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() totalCount: number;
  @Input() itemsPerPage: number;
  @Input() totalPages: number;
  @Input() currentPage: number;

  @Output() goToPreviousPage = new EventEmitter<boolean>();
  @Output() goToNextPage = new EventEmitter<boolean>();

  previousPage(){
    this.goToPreviousPage.emit(true);
  }

  nextPage(){
    this.goToNextPage.emit(true);
  }

  constructor() { }

  ngOnInit() {
  }

}
