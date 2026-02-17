import { 
  Component, EventEmitter, Input, Output, ViewChild, 
  AfterViewInit, ChangeDetectorRef, OnChanges, SimpleChanges, OnDestroy 
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-custom-paginator',
  templateUrl: './custom-paginator.component.html',
  styleUrls: ['./custom-paginator.component.css']
})
export class CustomPaginatorComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() length: number = 100; // Total items
  @Input() pageSizeOptions: number[] = [10, 50, 100]; // Page size options
  @Input() showFirstLastButtons: boolean = true; // Show first/last buttons
  @Input() currentIndex: number = 1; // Current page index
  @Input() pageSize: number = 10; // Page size input from parent

  @Output() pageChange = new EventEmitter<PageEvent>(); // Emits page changes
  @Output() pageSizeChange = new EventEmitter<number>(); // Emits page size changes

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private pageSubscription!: Subscription;
  private isFirstLoad: boolean = true; // Prevents duplicate triggers on first load

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    setTimeout(() => this.setupPaginator(), 0); // Delay to ensure parent data is available
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['length'] || changes['currentIndex'] || changes['pageSize']) {
      this.setupPaginator();
    }
  }

  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  }

  private setupPaginator() {
    if (!this.paginator) return;

    this.paginator._intl.itemsPerPageLabel = 'Items per page';

    if (this.isFirstLoad) {
      this.isFirstLoad = false;
      this.paginator.pageIndex = this.currentIndex - 1;
      this.paginator.pageSize = this.pageSize; // Set pageSize from input
      this.paginator._changePageSize(this.paginator.pageSize);
      return;
    }

    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }

    this.pageSubscription = this.paginator.page.subscribe((event: PageEvent) => {
      if (this.currentIndex !== event.pageIndex + 1 || this.pageSize !== event.pageSize) { 
        this.currentIndex = event.pageIndex + 1;
        this.pageSize = event.pageSize;

        this.pageChange.emit(event);
        this.pageSizeChange.emit(event.pageSize); // Emit pageSize changes
        this.cdr.detectChanges();
      }
    });
  }
}

