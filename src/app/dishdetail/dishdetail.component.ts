import { Component, OnInit, ViewChild, Inject  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Comment } from '../shared/comment';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {

  commentForm: FormGroup;
  comment: Comment;
  dishcopy: Dish;
  @ViewChild('cform') commentFormDirective;
  
  dish: Dish;
  errMess: string;
  dishIds: string[];
  prev: string;
  next: string;

  formErrors = {
    'comment': '',
    'author': ''
  }

  validationMessages = {
    'comment': {
      'required': 'Comment is required.'
    },
    'author': {
      'required': 'Name is required.',
      'minlength': 'Name must be atleast 2 characters long.',
      'maxlength': 'Name cannot be more than 25 characters long.'
    }
  }

  constructor(private dishService: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) { 
      this.createForm();
    }

  ngOnInit() {
    this.dishService.getDishIds()
      .subscribe((dishIds) => this.dishIds = dishIds);
     this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
     .subscribe((dish) => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id);},
        errmess => this.errMess = <any>errmess );
  }

  createForm() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)]],
      rating: 5,
      comment: ['', [Validators.required]],
      date: ''
    });

    this.commentForm.valueChanges
    .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set form validation message
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }


  onSubmit() {
    this.commentForm.value.date = new Date().toISOString();
    this.comment = this.commentForm.value;
    this.dishcopy.comments.push(this.comment);
    this.dishService.putDish(this.dishcopy).subscribe(dish => { this.dish = dish; this.dishcopy = dish },
      errmess => { this.dish = null; this.dishcopy = null; this.errMess = errmess })
    this.commentFormDirective.resetForm();
    this.commentForm.reset({
      author: '',
      rating: 5,
      comment: ''
    });
  }

}
