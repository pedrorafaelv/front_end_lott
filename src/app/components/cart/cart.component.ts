import { Component, OnInit } from '@angular/core';
import { faCartArrowDown, faMinus } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs';
import { Product } from 'src/app/interfaces/product';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

public Cart: Product[]= [];
public cantidad: number; 
public total_mount: number =0;
facartarrowdown = faCartArrowDown;
faMinus= faMinus;
  constructor( private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.products.subscribe(val=>{
      console.log("Cart", val);
      this.Cart =val;
      })

      this.cartService.products
      .pipe(map(product=>{
       return product.reduce((prev,curr) => prev + curr.mount, 0);
      }))
      .subscribe(val =>{
       this.total_mount = val * this.Cart[0].mount;
       console.log(val);
     
      })

      this.cantidad = this.Cart.length;
      // console.log('this.Cart[0].mount =', this.Cart[0].mount);
      // this.total_mount = this.Cart[0].mount * this.cantidad;
      //  console.log('total_mount =', this.total_mount);

  }

}
