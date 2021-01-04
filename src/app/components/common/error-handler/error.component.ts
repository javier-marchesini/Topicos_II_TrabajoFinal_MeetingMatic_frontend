import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
	public  error;

	constructor(
		private activatedRoute: ActivatedRoute,

	) {

	}
	ngOnInit() {
		this.error = this.activatedRoute.snapshot.queryParams;
	}


}
