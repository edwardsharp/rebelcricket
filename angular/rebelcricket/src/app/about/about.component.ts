import { Component, OnInit } from '@angular/core';

import { SettingsService } from '../settings/settings.service';
import { Settings } from '../settings/settings';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

	settings: Settings;

  constructor(private settingsService: SettingsService) { }

  ngOnInit() {
  	this.settingsService.getSettings().then(settings => {
      this.settings = settings;
    });

  }

}
