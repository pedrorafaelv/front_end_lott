import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { map } from 'rxjs';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-total',
  templateUrl: './total.component.html',
  styleUrls: ['./total.component.css']
})
export class TotalComponent implements OnInit {
public Product: Product;
public tot: number;
  constructor(private CartService: CartService) { }

  ngOnInit(): void {
 this.CartService.products
 .pipe(map(product=>{
  return product.reduce((prev,curr) => prev + curr.mount, 0);
 }))
 .subscribe(val =>{
  this.tot = val ;
  console.log(val);

 })
  }

}
