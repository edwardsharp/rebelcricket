import { Injectable } from '@angular/core';
import { Subject } 		from 'rxjs/Subject';
import { Title } 			from '@angular/platform-browser';

@Injectable()
export class AppTitleService {

	public default: string = 'demo-site';
	public title: Subject<string>;
  title$ = null;

  public searchHidden: Subject<boolean>;
  public quoteHidden: Subject<boolean>;

  constructor(private titleService: Title) {
    this.title = new Subject();
    this.title$ = this.title.asObservable();
    this.searchHidden = new Subject();
    this.quoteHidden = new Subject();
  }

  public toggleSearch(hidden:boolean){
    this.searchHidden.next(hidden);
  }

  public toggleQuote(hidden:boolean){
    this.quoteHidden.next(hidden);
  }

  public setTitle(t:string) {
  	this.titleService.setTitle(`${this.default} | ${t}`);
  	this.title.next(t);
  }

  public resetTitle() {
  	this.titleService.setTitle(this.default);
    this.title.next(this.default);
  }

}
