import { Component, OnInit } from '@angular/core';
import { NavController,NavParams } from "@ionic/angular";
import { TestePage } from '../teste/teste.page';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  constructor(
    public NavCtrl:NavController,
    public navParams:NavParams
    ) { }

  ngOnInit() {
  }

}
