import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import Site from 'src/app/classes/site';
import { AppState } from '../../../interfaces/app-state';
import { Store } from '@ngrx/store';
import { AppSettings } from '../../../interfaces/settings';
import * as SettingsActions from '../../../store/actions/app-settings.actions';

@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
})
export class MenuSidebarComponent implements OnInit, AfterViewInit {
  @ViewChild('mainSidebar', { static: false }) mainSidebar;
  @Output() mainSidebarHeight: EventEmitter<any> = new EventEmitter<any>();

  sitelist:Array<Site> = [
    
  ];
  appSettings: AppSettings;

  constructor(
    private store: Store<AppState>
    ) {

    }

  ngOnInit() {
    console.log("menu ngOnInit")
    this.store.select('appSettings').subscribe(settings => {
      this.appSettings = settings;
      this.sitelist = this.appSettings.sitelist;
      // console.log(settings);
    });
  }

  ngAfterViewInit() {
    this.mainSidebarHeight.emit(this.mainSidebar.nativeElement.offsetHeight);
  }

  chooseSite(site: Site){
    // console.log("Choose site = ");
    // console.log(site);
    var appSettings = {
      siteId: site.siteId,
      siteUpdated:true,
    }
    this.store.dispatch(new SettingsActions.Update(appSettings));
  }
}
