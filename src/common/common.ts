
import JsSHA from 'jssha';


// 异步工具
export class Defer<T = void> {
   protected _promise: Promise<T>;
   protected _resolve: (value?: T) => void = null;
   protected _reject: (reason: any) => void = null;

   constructor() {
       this._promise = new Promise<T>((resolve, reject) => {
           this._resolve = resolve;
           this._reject = reject;
       });
   }

   public resolve(value?: T): void {
       this._resolve(value);
   }

   public reject(reason: any): void {
       this._reject(reason);
   }

   get promise(): Promise<T> {
       return this._promise;
   }
}
