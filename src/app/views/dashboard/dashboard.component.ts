import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import Application from '../../classes/application';
import Site from '../../classes/site';
import Process from '../../classes/process';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';
import { SocketService } from 'src/app/services/socket.service';
import { AppService } from 'src/app/utils/services/app.service';
import { AppState } from '../../interfaces/app-state';
import { Store } from '@ngrx/store';
import { AppSettings } from '../../interfaces/settings';
import * as SettingsActions from '../../store/actions/app-settings.actions';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import ProcessDef from '../../classes/process';
import { now } from 'jquery';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('mymodal') content: any;
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement: DataTableDirective;
  lastRowIndex = -1;
  dtOptions: DataTables.Settings = {};
  idActionConfirm = false;
  idShowInfo =  true;
  applicationlist: Array<Application> = [];
  sitelist: Array<Site> = [];
  processlist: Array<Process>;
  //processInfo:ProcessDef;
  processInfo: ProcessDef = {
    processId: '',
    processName: '',
    processState: '',
    processActions: [],
    info: [],
    colour: '',
  };
  doActionContent:any;

  doFlip: Boolean = false;
  updatedTime: String;
  selectedProcessId: String = '';
  selectedSite: String = '';
  selectedApplication: String;
  loading: Boolean = false;
  show: Boolean = false;
  code: String;
  msg: String;
  token: String;
  type: String;
  showModal: String = 'modal';
  viewProcess: Boolean = false;
  instruction: Boolean = true;
  cimWebUserId: String;
  cimWebToken: String;

  appSettings: AppSettings;
  closeResult: string;
  ngZone: any;

  constructor(
    private modalService: NgbModal,
    private socketSrv: SocketService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>,
    private tokenSrv: TokenService,
    public appService: AppService,
    private toastr: ToastrService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.cimWebUserId = params['userid'];
      this.cimWebToken = params['token'];
      // console.log("1this.cimWebUserId="+this.cimWebUserId);
      // console.log("2this.cimWebToken="+this.cimWebToken);
    });
    console.log('this.cimWebToken=' + this.cimWebToken);
    if (!this.tokenSrv.validateToken(this.cimWebToken))
      this.router.navigateByUrl('/error');

    socketSrv.get().subscribe((msg) => {
      this.loading = false;
      if (msg.statusCode !== 200 && msg.statusMsg !== 'OK') {
        this.throwError(msg.statusCode, msg.statusMsg);
      }
      if (msg.txnDate) this.updatedTime = msg.txnDate;
      console.log('socketSrv.get().subscribe ' + msg.txnName);
      switch (msg.txnName) {
        case 'RegisterClient':
          this.handleRegistration(msg);
          break;
        case 'getSiteList':
          this.handleSiteList(msg);
          break;
        case 'getApplicationList':
          this.handleApplicationList(msg);
          break;
        case 'getProcessList':
          this.handleProcessList(msg);
          break;
        case 'getProcessInfo':
          this.handleGetProcessInfo(msg);
          break;
        case 'doAction':
          this.handleDoAction(msg);
          break;
      }
    });
  }
  open() {
    //this.modalService.dismissAll();
    console.log('Modal open');
    console.log(this.content);
    this.modalService.open(this.content, {
      // ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
      // backdrop: 'static'
    });
    // .result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    //   console.log(this.closeResult);
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //   console.log(this.closeResult);
    // });
  }
  viewProcessModal(processId, processName, siteId, appId) {
    // console.log(processId);
    // console.log(processName);
    // console.log(siteId);
    // console.log(appId);
    this.selectedProcessId = processId;
    if (this.token)
      this.socketSrv.continueSend(
        'getProcessInfo',
        {
          siteId: siteId,
          applicationId: appId,
          processId: processId,
        },
        this.token
      );
    this.open();
    // console.log("Modal open done...");
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  buildTableProcess(
    index,
    applicationName,
    applicationState,
    applicationTotalProcessCount
  ) {
    console.log('buildTableProcess call ...');
    var appSettings = {
      siteUpdated: false,
      applicationId: applicationName,
      applicationUpdated: true,
    };
    this.store.dispatch(new SettingsActions.Update(appSettings));
    this.updateTableIndex();
  }

  format(d) {
    // console.log("format d");
    // var appSettings = {
    //   applicationId:d.applicationId,
    //   applicationUpdated: false
    // }
    // this.store.dispatch(new SettingsActions.Update(appSettings));
    setTimeout(() => {
      this.buildTableProcess(
        this.lastRowIndex,
        d.applicationName,
        d.applicationState,
        d.applicationTotalProcessCount
      );
    }, 300);
    var timeline =
      '<div class="card"><div class="card-header"><h3 class="card-title">List Process of ' +
      d.applicationName +
      '</h3>' +
      '</div><div class="card-body">' +
      '<table class="table table-bordered table-triped" style="width:100%" id="datatable_table_process_' +
      this.lastRowIndex +
      '"></table>' +
      '</div>' +
      '</div>';
    console.log(timeline);
    //timeline = '<table class="table table-bordered table-triped" id="datatable_table_process_'+this.lastRowIndex+'"></table>';
    return timeline;
  }
  chooseSite(site: Site) {
    var appSettings = {
      siteId: site.siteId,
      siteUpdated: true,
    };
    this.store.dispatch(new SettingsActions.Update(appSettings));
  }
  ngOnInit() {
    this.store.select('appSettings').subscribe((settings) => {
      console.log('UPDATE SITE DASHBOARD....');
      console.log(this.appSettings);
      console.log(settings);
      if (
        this.appSettings === undefined ||
        (this.appSettings != undefined &&
          settings.siteId != this.appSettings.siteId)
      ) {
        this.getApplicationList(settings.siteId);
      }
      if (this.appSettings != undefined && settings.siteUpdated == true) {
        this.updateTable();
      } else {
        if (
          this.appSettings != undefined &&
          settings.applicationUpdated == true
        ) {
          this.getProcessList(settings.applicationId);
          //console.log("UPDATE LIST TABLE....settings.applicationUpdated="+settings.applicationUpdated)
          this.appSettings = settings;
          //this.updateTableIndex();
        } else {
          if (
            this.appSettings != undefined &&
            settings.processUpdated == true
          ) {
            this.appSettings = settings;
            this.updateTableIndex();
          } else {
            if (
              this.appSettings != undefined &&
              settings.processInfoUpdated == true
            ) {
              console.log('UPDATE PROCESS INFO....');
              this.processInfo = settings.processInfo[0];
              this.appSettings = settings;
            }
          }
        }
      }
      this.appSettings = settings;
    });

    this.dtOptions = {
      //ajax: 'assets/listapp.json',
      data: this.applicationlist,
      columns: [
        { orderable: false, title: 'Site Id', width: '5%', data: 'siteId' },
        {
          orderable: false,
          className: 'text-center details-control',
          title: 'App Id',
          width: '2%',
          data: 'applicationId',
        },
        {
          orderable: false,
          className: 'text-center details-control',
          title: 'App Name',
          width: '30%',
          data: 'applicationName',
          name: 'applicationName',
        },
        {
          orderable: false,
          className: 'text-center details-control',
          title: 'State',
          data: 'applicationState',
          name: 'applicationState',
          render: function (data, type, row) {
            var color_code = {
              UP: 'success',
              DOWN: 'danger',
              UNKNOWN: 'info',
              BUSY: 'primary',
              WARNING: 'warning',
            };
            var html =
              '<span class="badge badge-' +
              color_code[data] +
              '">' +
              data +
              '</span>';
            return html;
          },
        },
        {
          orderable: false,
          className: 'text-center',
          title: 'Total Process',
          data: 'applicationTotalProcessCount',
          name: 'applicationTotalProcessCount',
        },
        // { "orderable": false, "title": "Progress", "data":"applicationPieChartData" , "name":"applicationPieChartData",
        //   "className": "text-left",render: function ( data, type, row ) {
        //     console.log(row);
        //     var color_code = {
        //       'UP': 'success',
        //       'DOWN': 'danger',
        //       'UNKNOWN': 'info',
        //       'BUSY': 'primary',
        //       'WARNING': 'warning'
        //     };
        //     var percen = Math.floor(Math.random() * 100);
        //     var html = '<div class="progress progress-xs">'+
        //       '<div class="progress-bar bg-'+color_code[row.applicationState]+'" style="width: '+percen+'%"></div>'+
        //     '</div>';
        //     return html;
        //   }
        // },
        {
          orderable: false,
          title: 'Last Update',
          data: 'info',
          name: 'info',
          className: 'text-right',
          render: function (data, type, row) {
            var html = data[0][1];
            return html;
          },
        },
      ],
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).unbind('click');
        $('td', row).bind('click', () => {
          this.datatableElement.dtInstance.then(
            (dtInstance: DataTables.Api) => {
              var table = dtInstance;
              if (this.lastRowIndex > -1 && this.lastRowIndex != index) {
                var row_select_old = table.row(this.lastRowIndex);
                if (row_select_old.child.isShown()) {
                  //console.log("====================================Hide +row_select.child.isShown() =====================================");
                  row_select_old.child().hide();
                }
              }
              this.lastRowIndex = index;
              var row_select = table.row(index);
              var tr = $(this).parents('tr');
              if (row_select.child.isShown()) {
                //console.log("===================Hide +row_select.child.isShown()="+row_select.child.isShown()+" index="+index);
                row_select.child('').hide();
              } else {
                //console.log("SHOW +row_select.child.isShown()="+row_select.child.isShown()+" index="+index);
                row_select.child(this.format(data)).show();
              }
            }
          );
        });
        return row;
      },
      paging: false,
      searching: false,
    };
    window['angularComponentReference'] = {
      component: this,
      zone: this.ngZone,
      viewProcessModal: (processId, processName, siteId, appId) =>
        this.viewProcessModal(processId, processName, siteId, appId),
    };

    this.registerClient();
  }

  updateTableIndex() {
    //console.log("updateTableIndex " + "#datatable_table_process_"+this.lastRowIndex);
    //console.log(this.appSettings.processlist);
    var siteId = this.appSettings.siteId;
    var appId = this.appSettings.applicationId;
    if (
      $.fn.dataTable.isDataTable(
        '#datatable_table_process_' + this.lastRowIndex
      )
    ) {
      //console.log("ALREADY EXIST");
      $('#datatable_table_process_' + this.lastRowIndex)
        .DataTable()
        .clear()
        .rows.add(this.appSettings.processlist)
        .draw();
    } else {
      //console.log("CREATE NEW");
      //$("#datatable_table_process_"+this.lastRowIndex).html("");
      $('#datatable_table_process_' + this.lastRowIndex).DataTable({
        dom: 'Bfrtip',
        // Load data for the table's content from an Ajax source
        data: this.appSettings.processlist,
        rowCallback: function (row, data, index) {
          const self = this;
          // Unbind first in order to avoid any duplicate handler
          // (see https://github.com/l-lin/angular-datatables/issues/87)
          $('td', row).unbind('click');
          $('td', row).bind('click', () => {
            //self.someClickHandler(data);
            console.log(data);
          });
          return row;
        },
        // Set column definition initialisation properties.
        columns: [
          {
            orderable: false,
            className: 'text-left',
            title: 'Process Id',
            width: '50%',
            data: 'processId',
            name: 'processId',
          },
          {
            orderable: false,
            title: 'Process Name',
            width: '30%',
            data: 'processName',
            name: 'processName',
          },
          {
            orderable: false,
            className: 'text-center',
            title: 'Process State',
            data: 'processState',
            name: 'processState',
            render: function (data, type, row) {
              var color_code = {
                UP: 'success',
                DOWN: 'danger',
                UNKNOWN: 'info',
                BUSY: 'primary',
                WARNING: 'warning',
              };
              var html =
                '<span class="badge badge-' +
                color_code[data] +
                '">' +
                data +
                '</span>';
              return html;
            },
          },
          {
            orderable: false,
            title: 'Function',
            data: 'info',
            name: 'info',
            className: 'text-center',
            render: function (data, type, row) {
              //console.log(row);
              var html =
                '<button class="btn btn-sm btn-primary" style="margin-left: 5px;" onclick="viewProcessModal(' +
                "'" +
                row.processId +
                "'," +
                "'" +
                row.processName +
                "'," +
                "'" +
                siteId +
                "'," +
                "'" +
                appId +
                "'" +
                ')">View</button>';
              return html;
            },
          },
        ],
        paging: false,
        searching: false,
      });
    }
  }

  updateTable() {
    if (this.datatableElement == undefined) {
      return;
    }
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      var table = dtInstance;
      table.clear().rows.add(this.appSettings.applicationlist).draw();
    });
  }

  registerClient() {
    this.loading = true;
    this.socketSrv
      .initSend('RegisterClient', {}, null)
      .then()
      .catch((err) => console.log(err));
  }

  handleRegistration(msg) {
    if (msg.statusCode == 200 && msg.statusMsg == 'OK') {
      this.token = msg.token;
      this.getSiteList();
      this.show = false;
    } else {
      this.token = null;
    }
  }

  getSiteList() {
    this.loading = true;
    if (this.token) {
      this.socketSrv.continueSend('getSiteList', {}, this.token);
    }
  }

  handleSiteList(msg) {
    if (msg.statusCode == 200 && msg.statusMsg == 'OK') {
      this.sitelist = msg.content;
      this.show = false;
      //console.log(this.appSettings);
      var appSettings = {
        sitelist: [],
        siteId: this.appSettings === undefined ? '' : this.appSettings.siteId,
      };
      this.sitelist.forEach((obj) => {
        appSettings.sitelist.push(obj);
      });
      this.store.dispatch(new SettingsActions.Update(appSettings));
    } else {
      this.sitelist = [];
    }
  }

  getApplicationList(siteId) {
    this.loading = true;
    if (this.token && siteId.length > 0) {
      this.selectedSite = siteId;
      this.socketSrv.continueSend(
        'getApplicationList',
        { siteId: siteId },
        this.token
      );
    }
  }

  stopApplicationList() {
    if (this.token)
      this.socketSrv.continueSend('stopApplicationList', {}, this.token);
  }

  handleApplicationList(msg) {
    if (msg.statusCode == 200 && msg.statusMsg == 'OK') {
      this.applicationlist = msg.content;
      this.show = false;
      //console.log(this.appSettings);
      var appSettings = {
        applicationlist: [],
        siteUpdated: true,
      };
      this.applicationlist.forEach((obj) => {
        obj['siteId'] = this.appSettings.siteId;

        appSettings.applicationlist.push(obj);
      });
      this.store.dispatch(new SettingsActions.Update(appSettings));
    } else {
      this.applicationlist = [];
    }
  }

  getProcessList(applicationId) {
    this.loading = true;
    if (this.token) {
      //this.socketSrv.continueSend('getProcessList',{siteId:this.selectedSite,applicationId:this.selectedApplication},this.token);
      this.socketSrv.continueSend(
        'getProcessList',
        {
          siteId: this.appSettings.siteId,
          applicationId: applicationId,
        },
        this.token
      );
    }
  }

  handleProcessList(msg) {
    if (msg.statusCode == 200 && msg.statusMsg == 'OK') {
      this.processlist = msg.content;
      this.show = false;

      var appSettings = {
        processlist: [],
        applicationUpdated: false,
        siteUpdated: false,
        processInfoUpdated: false,
        processUpdated: true,
      };
      this.processlist.forEach((obj) => {
        appSettings.processlist.push(obj);
      });
      this.store.dispatch(new SettingsActions.Update(appSettings));
    } else {
      this.processlist = [];
      this.throwError(msg.statusCode, msg.statusMsg);
    }
  }

  
  handleDoAction(msg) {
    if (msg.statusCode == 200 && msg.statusMsg == 'OK') {
      this.show = false;
      this.doActionContent = msg.content;
      console.log( this.doActionContent );
      this.toastr.success('Trigger doAction sucessful...');
    } else {
      this.throwError(msg.statusCode, msg.statusMsg);
    }
  }
  handleGetProcessInfo(msg) {
    if (msg.statusCode == 200 && msg.statusMsg == 'OK') {
      this.show = false;
      this.processInfo = msg.content;
      var appSettings = {
        processId: this.selectedProcessId,
        processInfo: msg.content,
        processInfoUpdated: true,
        applicationUpdated: false,
        siteUpdated: false,
        processUpdated: false,
      };
      this.store.dispatch(new SettingsActions.Update(appSettings));
    } else {
      this.throwError(msg.statusCode, msg.statusMsg);
    }
  }
  stopProcessList() {
    if (this.token)
      this.socketSrv.continueSend('stopProcessList', {}, this.token);
  }
  throwError(code, msg) {
    this.show = true;
    this.code = 'Error Code ' + code + ':';
    this.msg = msg;
    this.type = 'alert';
    this.toastr.error(''+this.msg);
  }

  // rotateItem(application) {
  //   application.doFlip = !application.doFlip;
  // }

  // selectSite(site){
  //   this.selectedSite = site.siteId;
  //   this.instruction = false;
  //   this.getApplicationList();
  // }

  // selectApplication(application:Application){
  //   this.selectedApplication = application.applicationId;
  //   this.stopApplicationList();
  //   this.getProcessList();
  //   this.viewProcess = true;
  //   this.showModal = "modal is-active";
  // }

  // onCloseModal(){
  //   this.viewProcess = false;
  //   this.showModal = "modal";
  //   this.stopProcessList();
  //   this.getApplicationList();
  // }
  actionSelected = "";
  sendActionConfirm(action){
    this.idActionConfirm = true;
    this.idShowInfo = false;
    this.actionSelected = action;
  }
  confirmBack(){
    this.actionSelected = "";
    this.idActionConfirm = false;
    this.idShowInfo = true;
  }
  sendAction() {
    var data = {
      siteId: this.selectedSite,
      applicationId: this.selectedApplication,
      processName: this.selectedProcessId,
      action: this.actionSelected,
    };
    if (this.token){
      this.socketSrv.continueSend('doAction', data, this.token);
    }
  }
}