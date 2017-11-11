export class Gfx {
  _id?: string;
  _rev?: string;
  _attachments?: any;
  
  created_at?: Date;
  modified_at?: Date;

  order_id?: string;


  constructor() { 
    this._id = this._id || Math.floor(Date.now()).toString(36); 
    this.created_at = new Date(parseInt(this._id, 36));
    this.modified_at = new Date;
  }
}
