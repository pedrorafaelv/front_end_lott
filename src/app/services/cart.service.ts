import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartProducts: Product[]=[];

private _products: BehaviorSubject<Product[]>;
public  existe: any ;
  constructor() {
     this._products= new BehaviorSubject<Product[]>([]);
     this.existe = false;
   }

  get products(){
    return this._products.asObservable();
  }

  addNewProduct(user_id: number, raffle_id: number, card_id: number, mount: number){
    console.log("addNewProduct", card_id);
    var prod=[['user_id', user_id], ['raffle_id',raffle_id], ['card_id',card_id], ['mount',mount]];
    var p = Object.fromEntries(prod);
    this.existe = this.cartProducts.find(card_id => card_id);
   if (this.existe){
     console.log('producto ya existe en el carrito de compras', card_id);
     console.log('this.existe', this.existe);
    } else{
      this.cartProducts.push(p);
      this._products.next(this.cartProducts);
       console.log('producto agregado', p);
    }
    
    console.log('prod', prod);
  }
  deleteProduct(index: number){
    this.cartProducts.splice(index,1);
    this._products.next(this.cartProducts);

  }
}
