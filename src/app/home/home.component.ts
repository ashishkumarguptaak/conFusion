import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  dishErrMess: string;
  promotion: Promotion;
  promotionErrMess: string;
  corporateLeader: Leader;
  leaderErrMess: string;

  constructor(private dishService: DishService,
    private promotionService: PromotionService,
    private leaderService: LeaderService,
    @Inject('BaseURL') private BaseURL) { }

  ngOnInit() {
    this.dishService.getFeaturedDish().subscribe((dishes) => this.dish = dishes, errmess => this.dishErrMess = <any>errmess);
    this.promotionService.getFeaturedPromotion().subscribe((promotions) => this.promotion = promotions, errmess => this.promotionErrMess = errmess);
    this.leaderService.getFeaturedLeader().subscribe((leaders) => this.corporateLeader = leaders,
    errmess => this.leaderErrMess = errmess);
  }

}
