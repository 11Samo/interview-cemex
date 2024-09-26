import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.scss',
})
export class FiltersComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<any>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      statusPending: [false],
      statusInProgress: [false],
      statusCompleted: [false],
      productLine: [''],
      startDate: [''],
      endDate: [''],
      orderNumber: [''],
    });
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe((filters) => {
      this.filtersChanged.emit(filters);
    });
  }

  // Emit applied filters
  applyFilters() {
    const filters = this.filterForm.value;
    this.filtersChanged.emit(filters);
  }

  resetFilters() {
    this.filterForm.reset({
      statusPending: false,
      statusInProgress: false,
      statusCompleted: false,
      productLine: '',
      startDate: '',
      endDate: '',
      orderNumber: '',
    });
    this.applyFilters();
  }
}
